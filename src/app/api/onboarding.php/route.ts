// Main Onboarding API Route - Documentation Path
import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedUser } from "../../lib/authMiddleware";

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

// API utilities for MariaDB via PHP API
const baseURL = "https://app.demandintellect.com/app/api";

const getOnboardingDataFromAPI = async (
  userId: string,
  authToken?: string
): Promise<OnboardingData | null> => {
  try {
    let url = `${baseURL}/onboarding.php?anon_id=${userId}`;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
      url = `${baseURL}/onboarding.php`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return null;
    }

    const raw = await response.json();
    const container = raw?.onboarding || raw?.data || raw;
    
    // Handle array response - get the latest
    if (Array.isArray(container) && container.length > 0) {
      const latest = [...container].sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0))[0];
      if (latest?.id) {
        const byIdUrl = authToken 
          ? `${baseURL}/onboarding.php/${latest.id}`
          : `${baseURL}/onboarding.php/${latest.id}?anon_id=${userId}`;
        const byIdResp = await fetch(byIdUrl, { method: "GET", headers });
        if (byIdResp.ok) {
          const byIdRaw = await byIdResp.json();
          return (byIdRaw?.onboarding || byIdRaw?.data || byIdRaw) as OnboardingData;
        }
      }
      return latest as OnboardingData;
    }

    return container as OnboardingData;
  } catch (error) {
    console.error("Error getting onboarding data from API:", error);
    return null;
  }
};

const saveOnboardingDataToAPI = async (
  data: Partial<OnboardingData>,
  userId: string,
  authToken?: string
): Promise<OnboardingData | null> => {
  try {
    const hasId = data.id !== undefined && data.id !== null;
    let url = hasId
      ? `${baseURL}/onboarding.php/${data.id}`
      : `${baseURL}/onboarding.php`;

    // Add anon_id as query parameter if not authenticated
    if (!authToken && userId) {
      url += `?anon_id=${userId}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Clean the data
    const cleanedData = { ...data } as Record<string, unknown>;
    
    // Normalize target_location
    if (typeof cleanedData.target_location === "string") {
      const lower = cleanedData.target_location.trim().toLowerCase();
      if (["null", "no", "n", "none", "na", "not applicable"].includes(lower)) {
        cleanedData.target_location = null;
      }
    }

    const response = await fetch(url, {
      method: hasId ? "PATCH" : "POST",
      headers,
      body: JSON.stringify(cleanedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error saving onboarding data:", errorText);
      return null;
    }

    const raw = await response.json();
    return (raw?.onboarding || raw?.data || raw) as OnboardingData;
  } catch (error) {
    console.error("Error saving onboarding data to API:", error);
    return null;
  }
};

const handleGetOnboarding = async (
  request: NextRequest,
  user?: AuthenticatedUser
) => {
  try {
    // Get user ID from authenticated user or query parameter for anonymous users
    let userId = user?.uid;

    if (!userId) {
      const url = new URL(request.url);
      const anonIdParam = url.searchParams.get("anon_id");
      userId = anonIdParam || undefined;
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Get auth token if authenticated
    const authToken = request.headers.get("authorization")?.replace("Bearer ", "");

    const onboardingData = await getOnboardingDataFromAPI(userId, authToken || undefined);

    if (!onboardingData) {
      return NextResponse.json(
        {
          success: false,
          error: "No onboarding data found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      onboarding: onboardingData,
    });
  } catch (error) {
    console.error("Error retrieving onboarding data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve onboarding data",
      },
      { status: 500 }
    );
  }
};

const handleCreateOnboarding = async (
  request: NextRequest,
  user?: AuthenticatedUser
) => {
  try {
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

    // Get auth token if authenticated
    const authToken = request.headers.get("authorization")?.replace("Bearer ", "");

    // Get existing data from API
    const existing = await getOnboardingDataFromAPI(userId, authToken || undefined);

    // Merge with new data
    const onboardingData: Partial<OnboardingData> = {
      ...existing,
      ...data,
      id: data.id || existing?.id,
      organization_id: data.organization_id || existing?.organization_id || null,
      anon_id: anonId,
      status: data.status || existing?.status || "draft",
      data_processed: data.data_processed || existing?.data_processed || false,
      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to API
    const saved = await saveOnboardingDataToAPI(onboardingData, userId, authToken || undefined);

    if (!saved) {
      return NextResponse.json(
        { error: "Failed to create onboarding data in database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      onboarding: saved,
      message: "Onboarding created successfully",
    });
  } catch (error) {
    console.error("Create onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to create onboarding data" },
      { status: 500 }
    );
  }
};

// Handle both authenticated and anonymous requests
export async function GET(request: NextRequest) {
  // Try to authenticate first
  try {
    const { authenticate } = await import("../../lib/authMiddleware");
    const user = await authenticate(request);

    if (user) {
      return handleGetOnboarding(request, user);
    }
  } catch {
    // Authentication failed, continue as anonymous
    console.log("Authentication failed, handling as anonymous user");
  }

  // Handle as anonymous user
  return handleGetOnboarding(request);
}

export async function POST(request: NextRequest) {
  // Try to authenticate first
  try {
    const { authenticate } = await import("../../lib/authMiddleware");
    const user = await authenticate(request);

    if (user) {
      return handleCreateOnboarding(request, user);
    }
  } catch {
    // Authentication failed, continue as anonymous
    console.log("Authentication failed, handling as anonymous user");
  }

  // Handle as anonymous user
  return handleCreateOnboarding(request);
}
