import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { upsertPricingRows } from "@/app/lib/pricingRepo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Removed file-based storage in favor of Firestore

const EXPECTED_HEADERS = [
  "Segment",
  "Billing Cycle",
  "Plan Name",
  "Credits",
  "Tagline",
  "Price (USD)",
  "AI Hunter Searches",
  "Contact Validations",
  "Additional Features",
];

// Funnel Level specific headers (some are required when Segment is "Funnel Level")
const FUNNEL_LEVEL_HEADERS = [
  "Funnel Level", // TOFU, MOFU, BOFU
  "Lead Gen Name", // Name of the lead generation model
  "Type", // Model type (Inbound/Outbound, Qualification Metric, etc.)
  "Minimum Price", // Minimum price for the model
];

function normalizeKey(key: string): string {
  return key.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function findHeaderKey(rowKeys: string[], expected: string): string | null {
  const target = normalizeKey(expected);
  for (const k of rowKeys) {
    if (normalizeKey(k) === target) return k;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    // Enforce authentication via dashboard profile.php
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }

    // Add timeout and better error handling for external API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let profileRes;
    try {
      profileRes = await fetch(
        "https://app.demandintellect.com/app/api/profile.php",
        {
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: "Authentication service timeout" }, { status: 504 });
      }
      console.error('Authentication API error:', error);
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 });
    }

    if (profileRes.status === 401) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    
    if (profileRes.status !== 200) {
      return NextResponse.json({ 
        error: "Authentication service error", 
        status: profileRes.status 
      }, { status: 503 });
    }

    // Parse profile and check for admin role
    let profile;
    try {
      profile = await profileRes.json();
    } catch (parseError) {
      console.error('Error parsing profile response:', parseError);
      return NextResponse.json({ error: "Invalid profile response" }, { status: 500 });
    }

    // Enforce admin role requirement
    if (!profile?.user?.role || profile.user.role !== 'admin') {
      return NextResponse.json({ 
        error: "Insufficient permissions. Admin role required to upload pricing data." 
      }, { status: 403 });
    }

    console.log('Admin user authenticated:', profile.user.email, 'Role:', profile.user.role);

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json({ error: "No sheets found in the workbook." }, { status: 400 });
    }
    const sheet = workbook.Sheets[sheetName];
    
    // Strategy 1: Let xlsx infer headers from the first row (most robust)
    let rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
      defval: "",
    });
    console.log('Rows (default header inference) sample:', rows.slice(0, 2));

    // Check if any expected headers are present; if not, fall back to manual mapping
    const hasAnyExpectedHeader = (() => {
      const keys = Object.keys(rows[0] || {});
      return EXPECTED_HEADERS.some((h) => !!findHeaderKey(keys, h));
    })();

    if (!hasAnyExpectedHeader) {
      console.log('No expected headers detected with default inference, trying array fallback...');
      const arrays = XLSX.utils.sheet_to_json<any[]>(sheet, {
        defval: "",
        header: 1, // Return as arrays (first row = headers)
      });
      console.log('Fallback rows (array mode) sample:', arrays.slice(0, 2));

      if (!arrays.length || arrays.length < 2) {
        return NextResponse.json({ error: "No data found in the sheet." }, { status: 400 });
      }

      const headerRow = (arrays[0] as any[]).map((h) => String(h || '').trim());
      const dataRows = arrays.slice(1) as any[][];

      rows = dataRows.map((arr) => {
        const obj: Record<string, any> = {};
        headerRow.forEach((h, idx) => {
          if (h) obj[h] = arr[idx] ?? '';
        });
        return obj;
      });
      console.log('Rows after fallback conversion:', rows.slice(0, 2));
    }

    if (!rows.length) {
      return NextResponse.json({ error: "No rows found in the sheet." }, { status: 400 });
    }

    // Validate headers by checking the first row's keys
    const rowKeys = Object.keys(rows[0] ?? {});
    console.log('Detected headers in Excel file:', rowKeys);
    console.log('Expected headers:', EXPECTED_HEADERS);
    
    // Check for Segment column to determine if we need funnel-level headers
    const segmentKey = findHeaderKey(rowKeys, "Segment");
    if (!segmentKey) {
      return NextResponse.json(
        { error: "Segment header is required." },
        { status: 400 }
      );
    }
    
    // Check what types of rows exist in the file
    const hasFunnelLevel = rows.some(r => 
      String(r[segmentKey] || '').trim().toLowerCase() === 'funnel level'
    );
    const hasPersonalBusiness = rows.some(r => {
      const seg = String(r[segmentKey] || '').trim().toLowerCase();
      return seg === 'personal' || seg === 'business';
    });
    
    // Required headers for all rows
    const requiredHeaders = ["Segment", "Billing Cycle"];
    
    // For Personal/Business rows, these are required
    const personalBusinessHeaders = ["Plan Name", "Price (USD)"];
    
    // For Funnel Level rows, these are required instead
    const funnelLevelRequired = ["Funnel Level", "Lead Gen Name"];
    
    const missingHeaders: string[] = [];
    
    // Always check required headers
    for (const expected of requiredHeaders) {
      const found = findHeaderKey(rowKeys, expected);
      if (!found) missingHeaders.push(expected);
    }
    
    // Check for headers based on what row types are present
    if (hasPersonalBusiness) {
      for (const expected of personalBusinessHeaders) {
        const found = findHeaderKey(rowKeys, expected);
        if (!found) missingHeaders.push(expected);
      }
    }
    
    if (hasFunnelLevel) {
      for (const expected of funnelLevelRequired) {
        const found = findHeaderKey(rowKeys, expected);
        if (!found) missingHeaders.push(expected);
      }
    }
    
    console.log('Missing headers:', missingHeaders);
    
    if (missingHeaders.length) {
      const expectedHeaders = [...requiredHeaders];
      if (hasPersonalBusiness) expectedHeaders.push(...personalBusinessHeaders);
      if (hasFunnelLevel) expectedHeaders.push(...funnelLevelRequired);
      
      return NextResponse.json(
        {
          error: "Invalid or missing headers.",
          missing: missingHeaders,
          expected: expectedHeaders,
          detected: rowKeys,
        },
        { status: 400 }
      );
    }

    // Build a header map to actual keys found (include all possible headers)
    const headerMap: Record<string, string> = {};
    const allHeaders = [...EXPECTED_HEADERS, ...FUNNEL_LEVEL_HEADERS];
    for (const expected of allHeaders) {
      const actual = findHeaderKey(rowKeys, expected);
      if (actual) headerMap[expected] = actual;
    }

    console.log('Starting data processing for', rows.length, 'rows');
    
    // Helper function to remove undefined values from objects (Firestore doesn't allow undefined)
    const removeUndefined = (obj: any): any => {
      const cleaned: any = {};
      for (const key in obj) {
        if (obj[key] !== undefined) {
          cleaned[key] = obj[key];
        }
      }
      return cleaned;
    };
    
    const data = rows
      .map((r, index) => {
      try {
        console.log(`Processing row ${index + 1}:`, Object.keys(r));
        
        const segment = String(r[headerMap["Segment"]] ?? "").trim();
        const billingCycle = String(r[headerMap["Billing Cycle"]] ?? "").trim();
        
        // Skip empty rows (missing required fields)
        if (!segment || !billingCycle) {
          console.log(`Row ${index + 1} skipped: missing segment or billingCycle`);
          return null;
        }
        
        const isFunnelLevel = segment.toLowerCase() === 'funnel level';
        
        // Common fields
        const tagline = String(r[headerMap["Tagline"]] ?? "").trim();
        const additionalRaw = String(r[headerMap["Additional Features"]] ?? "");
        const additionalFeatures = additionalRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        
        // Handle Funnel Level rows
        if (isFunnelLevel) {
          const funnelLevel = String(r[headerMap["Funnel Level"]] ?? "").trim().toUpperCase();
          const leadGenName = String(r[headerMap["Lead Gen Name"]] ?? "").trim();
          const type = String(r[headerMap["Type"]] ?? "").trim();
          const minimumPriceRaw = r[headerMap["Minimum Price"]];
          const priceRaw = r[headerMap["Price (USD)"]];
          
          // Parse minimumPrice and price
          let minimumPrice: number | undefined;
          if (minimumPriceRaw !== undefined && minimumPriceRaw !== null && String(minimumPriceRaw).trim() !== '') {
            const minPriceNum = Number(minimumPriceRaw);
            if (Number.isFinite(minPriceNum)) {
              minimumPrice = minPriceNum;
            }
          }
          
          // Parse price - prefer minimumPrice if available, otherwise use priceRaw
          let price: number | string;
          if (minimumPrice !== undefined) {
            price = minimumPrice; // Use minimumPrice as the price
          } else if (priceRaw !== undefined && priceRaw !== null && String(priceRaw).trim() !== '') {
            const priceNum = Number(priceRaw);
            if (Number.isFinite(priceNum)) {
              price = priceNum;
              // Also set minimumPrice to price if minimumPrice wasn't provided
              minimumPrice = priceNum;
            } else {
              price = String(priceRaw).trim();
            }
          } else {
            price = "Flexible";
          }
          
          console.log(`Row ${index + 1} raw values (Funnel Level):`, {
            segment, billingCycle, funnelLevel, leadGenName, type, minimumPriceRaw, priceRaw
          });

          const processedRow: any = {
            segment,
            billingCycle,
            funnelLevel,
            leadGenName,
            price,
          };
          
          // Only include optional fields if they have values
          if (tagline) processedRow.tagline = tagline;
          if (additionalFeatures.length > 0) processedRow.features = additionalFeatures;
          if (type) processedRow.type = type;
          if (minimumPrice !== undefined) processedRow.minimumPrice = minimumPrice;
          
          console.log(`Row ${index + 1} processed successfully (Funnel Level):`, processedRow);
          return removeUndefined(processedRow);
        }
        
        // Handle Personal/Business rows (existing logic)
        const planName = String(r[headerMap["Plan Name"]] ?? "").trim();
        const creditsRaw = r[headerMap["Credits"]];
        const priceRaw = r[headerMap["Price (USD)"]];
        const aiHunterRaw = r[headerMap["AI Hunter Searches"]];
        const contactValidationsRaw = r[headerMap["Contact Validations"]];

        console.log(`Row ${index + 1} raw values (Personal/Business):`, {
          segment, billingCycle, planName, creditsRaw, tagline, 
          priceRaw, aiHunterRaw, contactValidationsRaw, additionalRaw
        });

        const credits = Number.isFinite(Number(creditsRaw)) ? Number(creditsRaw) : String(creditsRaw || "").trim();
        const aiHunterSearches = Number.isFinite(Number(aiHunterRaw)) ? Number(aiHunterRaw) : String(aiHunterRaw || "").trim();
        const contactValidations = Number.isFinite(Number(contactValidationsRaw)) ? Number(contactValidationsRaw) : String(contactValidationsRaw || "").trim();

        const priceParsed = Number.isFinite(Number(priceRaw)) ? Number(priceRaw) : String(priceRaw || "").trim();

        const processedRow: any = {
          segment,
          billingCycle,
          planName,
          price: priceParsed,
        };
        
        // Only include optional fields if they have values
        if (tagline) processedRow.tagline = tagline;
        if (credits && String(credits).trim()) processedRow.credits = credits;
        if (aiHunterSearches && String(aiHunterSearches).trim()) processedRow.aiHunterSearches = aiHunterSearches;
        if (contactValidations && String(contactValidations).trim()) processedRow.contactValidations = contactValidations;
        if (additionalFeatures.length > 0) processedRow.features = additionalFeatures;
        
        console.log(`Row ${index + 1} processed successfully (Personal/Business):`, processedRow);
        return removeUndefined(processedRow);
      } catch (rowError) {
        console.error(`Error processing row ${index + 1}:`, rowError);
        throw new Error(`Failed to process row ${index + 1}: ${rowError.message}`);
      }
    })
    .filter((row) => row !== null); // Remove skipped rows

    console.log('Data processing completed. Writing to Firestore...');
    const result = await upsertPricingRows(data as any);
    console.log('Firestore write completed:', result);
    return NextResponse.json({ success: true, count: result.count, updatedAt: result.updatedAt });
  } catch (error) {
    console.error('Upload pricing error:', error);
    console.error('Error stack:', error.stack);
    
    // Return more specific error information in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Failed to process upload: ${error.message}` 
      : "Failed to process upload.";
      
    return NextResponse.json({ 
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message,
        stack: error.stack 
      })
    }, { status: 500 });
  }
}


