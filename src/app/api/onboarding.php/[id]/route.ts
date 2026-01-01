// Onboarding Update API Route - Documentation Path
import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedUser } from "../../../lib/authMiddleware";
import fs from "fs";
import path from "path";

interface OnboardingData {
  id?: number;
  organization_id?: number;
  anon_id?: string;
  sales_objective?: string;
  company_role?: string;
  short_term_goal?: string;
  website_url?: string;
  gtm?: string;
  target_industry?: string;
  target_revenue_size?: string;
  target_employee_size?: string;
  target_departments?: string[];
  target_region?: string;
  target_location?: string;
  target_audience_list_exist?: boolean;
  status?: "draft" | "auth_needed" | "completed" | "data_processed";
  onboarding_completed?: boolean;
  data_processed?: boolean;
  data_processed_at?: string;
  created_at?: string;
  updated_at?: string;

  // Legacy fields for backward compatibility
  userId?: string;
  currentStep?: string;
  salesObjective?: string;
  userRole?: string;
  immediateGoal?: string;
  companyWebsite?: string;
  marketFocus?: "B2B" | "B2C" | "B2G";
  companyInfo?: {
    industry: string;
    revenueSize: string;
    employeeSize: string;
  };
  targetTitles?: string[];
  targetRegion?: string;
  hasTargetList?: boolean;
  contactListStatus?: {
    isUpToDate: boolean;
    isVerified: boolean;
    needsEnrichment: boolean;
  };
  outreachChannels?: string[];
  leadHandlingCapacity?: number;
  currentLeadGeneration?: number;
  budget?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  isAnonymous?: boolean;
}

// JSON file storage utilities
const getDataFilePath = () => {
  return path.join(process.cwd(), "src", "data", "onboarding.json");
};

const readOnboardingData = (): {
  _metadata?: Record<string, unknown>;
  users: Record<string, OnboardingData>;
} => {
  try {
    const filePath = getDataFilePath();
    if (!fs.existsSync(filePath)) {
      return { users: {} };
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    // Handle legacy format (direct user data) or new format (with users object)
    if (data.users) {
      return data;
    } else {
      // Convert legacy format to new format
      return { users: data };
    }
  } catch (error) {
    console.error("Error reading onboarding data:", error);
    return { users: {} };
  }
};

const writeOnboardingData = (data: {
  _metadata?: Record<string, unknown>;
  users: Record<string, OnboardingData>;
}) => {
  try {
    const filePath = getDataFilePath();
    const dirPath = path.dirname(filePath);

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Add metadata if not present
    if (!data._metadata) {
      data._metadata = {
        version: "1.0",
        lastUpdated: new Date().toISOString(),
        description: "SalesAI onboarding data storage",
      };
    } else {
      data._metadata.lastUpdated = new Date().toISOString();
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing onboarding data:", error);
    throw error;
  }
};

const handleUpdateOnboarding = async (
  request: NextRequest,
  { params }: { params: { id: string } },
  user?: AuthenticatedUser
) => {
  try {
    const onboardingId = parseInt(params.id);
    const body = await request.json();
    const data: Partial<OnboardingData> = body;

    // Get anon_id from request body or query parameter
    const url = new URL(request.url);
    const anonIdParam = url.searchParams.get("anon_id");
    const anonId = data.anon_id || anonIdParam;

    // Determine user ID (authenticated user or anonymous)
    const userId = user?.uid || anonId;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const allData = readOnboardingData();
    const existing = allData.users[userId];

    if (!existing) {
      return NextResponse.json(
        { error: "Onboarding record not found" },
        { status: 404 }
      );
    }

    // Check if the ID matches (if provided)
    if (existing.id && existing.id !== onboardingId) {
      return NextResponse.json(
        { error: "Onboarding ID mismatch" },
        { status: 400 }
      );
    }

    const onboardingData: OnboardingData = {
      ...existing,
      ...data,
      id: existing.id || onboardingId,
      organization_id: existing.organization_id ?? null,
      anon_id: anonId || existing.anon_id,
      status: data.status || existing.status || "draft",
      onboarding_completed:
        data.onboarding_completed || existing.onboarding_completed || false,
      data_processed: data.data_processed || existing.data_processed || false,
      created_at: existing.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    allData.users[userId] = onboardingData;
    writeOnboardingData(allData);

    return NextResponse.json({
      success: true,
      onboarding: onboardingData,
      message: "Onboarding updated successfully",
    });
  } catch (error) {
    console.error("Update onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to update onboarding data" },
      { status: 500 }
    );
  }
};

// Handle both authenticated and anonymous requests
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Try to authenticate first
  try {
    const { authenticate } = await import("../../../lib/authMiddleware");
    const user = await authenticate(request);

    if (user) {
      return handleUpdateOnboarding(request, { params }, user);
    }
  } catch {
    // Authentication failed, continue as anonymous
    console.log("Authentication failed, handling as anonymous user");
  }

  // Handle as anonymous user
  return handleUpdateOnboarding(request, { params });
}
