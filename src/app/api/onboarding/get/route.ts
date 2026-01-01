import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedUser } from "../../../lib/authMiddleware";
import fs from "fs";
import path from "path";

// Types for onboarding data
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
  businessName?: string;
  businessDescription?: string;
  businessIndustry?: string;
  businessTargetAudience?: string;
  businessGoals?: string[];
  businessChallenges?: string[];
  salesProcessStage?: string;
  salesChannels?: string[];
  salesTeamSize?: string;
  salesCycleDuration?: string;
  leadSources?: string[];
  painPoints?: string[];
  currentTools?: string[];
  budget?: string;
  timeline?: string;
  successMetrics?: string[];
  companyWebsite?: string;
  companySize?: string;
  companyRevenue?: string;
  companyLocation?: string;
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

const handleGetOnboarding = async (
  request: NextRequest,
  user?: AuthenticatedUser
) => {
  try {
    // Get user ID from authenticated user or query parameter for anonymous users
    let userId = user?.uid;

    if (!userId) {
      const url = new URL(request.url);
      const anonymousUserIdParam = url.searchParams.get("anonymousUserId");
      userId = anonymousUserIdParam || undefined;
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const allData = readOnboardingData();
    const onboardingData = allData.users[userId];

    if (!onboardingData) {
      return NextResponse.json(
        {
          success: false,
          error: "No onboarding data found",
          data: null,
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

// Handle both authenticated and anonymous requests
export async function GET(request: NextRequest) {
  // Try to authenticate first
  try {
    const { authenticate } = await import("../../../lib/authMiddleware");
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
