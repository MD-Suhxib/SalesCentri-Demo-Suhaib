// Conversational Onboarding API Route - Batch Persistence
// This route implements a memory-first approach where all onboarding answers
// are stored in memory during the conversation and only persisted to the backend
// in one batch request when the onboarding is complete.
import { NextRequest, NextResponse } from "next/server";
import {
  onboardingSmartRouter,
  OnboardingState,
} from "../../../lib/langchain/onboardingSmartRouter";

interface ConversationRequest {
  message: string;
  chatId: string;
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp?: number;
  }>;
  // anonymousUserId is now extracted from tracker_anon_id query parameter, not request body
}

// Chat API integration for saving onboarding conversation
const createOnboardingChatSession = async (
  anonId?: string,
  authToken?: string
): Promise<string | null> => {
  try {
    const baseURL = "https://app.demandintellect.com/app/api";
    let url = `${baseURL}/chats.php`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Bearer token if available
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    } else if (anonId) {
      url += `?anon_id=${anonId}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ title: "Onboarding Chat" }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Created onboarding chat session:", data.id);
      return data.id;
    }
  } catch (error) {
    console.error("Error creating onboarding chat session:", error);
  }
  return null;
};

const saveMessageToChatAPI = async (
  chatId: string,
  role: "user" | "assistant",
  content: string,
  anonId?: string,
  authToken?: string
): Promise<void> => {
  try {
    const baseURL = "https://app.demandintellect.com/app/api";
    let url = `${baseURL}/messages.php?chat_id=${chatId}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Bearer token if available
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    } else if (anonId) {
      url += `&anon_id=${anonId}`;
    }

    await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ role, content }),
    });
  } catch (error) {
    console.error("Error saving message to chat API:", error);
  }
};

// Call real onboarding API for getting current state
const getOnboardingData = async (
  anonId?: string,
  authToken?: string
): Promise<OnboardingState | null> => {
  try {
    const baseURL = "https://app.demandintellect.com/app/api";
    let url = `${baseURL}/onboarding.php`;

    // Add anon_id as query parameter if available
    if (anonId) {
      url += `?anon_id=${anonId}`;
    }

    console.log(`🌐 GET ONBOARDING: ${url}`);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Bearer token if available
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const config: RequestInit = {
      method: "GET",
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      console.error(
        `Onboarding API error: ${response.status} ${response.statusText}`
      );
      return {};
    }

    // If backend returns a list, pick the latest and fetch by ID
    const raw = await response.json();
    const container = (raw?.onboarding || raw?.data || raw) as Record<string, unknown>;
    let list: Array<Record<string, unknown>> | undefined;
    if (Array.isArray(container)) {
      list = container as Array<Record<string, unknown>>;
    } else if (Array.isArray((container as Record<string, unknown>).onboarding_list as unknown)) {
      list = (container as Record<string, unknown>).onboarding_list as Array<Record<string, unknown>>;
    } else if (Array.isArray((raw as Record<string, unknown>).onboarding_list as unknown)) {
      list = (raw as Record<string, unknown>).onboarding_list as Array<Record<string, unknown>>;
    }
    if (Array.isArray(list) && list.length > 0) {
      const latest = [...list].sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0))[0];
      if (latest?.id) {
        let byIdUrl = `${baseURL}/onboarding.php/${latest.id}`;
        if (anonId && !authToken) byIdUrl += `?anon_id=${anonId}`;
        const byIdResp = await fetch(byIdUrl, { method: "GET", headers });
        if (byIdResp.ok) {
          const byIdRaw = await byIdResp.json();
          return (byIdRaw && (byIdRaw.onboarding || byIdRaw.data || byIdRaw)) as OnboardingState;
        }
      }
    }

    console.log("✅ GET ONBOARDING: Success");
    const data = (raw && (raw.onboarding || raw.data || raw)) as OnboardingState;
    return data;
  } catch (error) {
    console.error("Error getting onboarding data:", error);
    return {};
  }
};

// Create or update onboarding data depending on presence of id
const updateOnboardingData = async (
  userData: Partial<OnboardingState>,
  anonId?: string,
  authToken?: string
): Promise<OnboardingState | null> => {
  try {
    const baseURL = "https://app.demandintellect.com/app/api";
    const hasId =
      typeof (userData as Record<string, unknown>).id !== "undefined" &&
      (userData as Record<string, unknown>).id !== null;
    let url = hasId
      ? `${baseURL}/onboarding.php/${(userData as Record<string, unknown>).id}`
      : `${baseURL}/onboarding.php`;

    // Add anon_id as query parameter if available
    if (anonId) {
      url += `?anon_id=${anonId}`;
    }

    // Clean the data before sending - remove problematic fields
    const cleanedData = { ...userData } as Record<string, unknown>;

    // Don't send target_audience_list_exist if it's 0 and not a boolean
    if ((cleanedData.target_audience_list_exist as unknown) === 0) {
      delete cleanedData.target_audience_list_exist;
    }

    // Ensure boolean fields are properly typed
    if (
      typeof (cleanedData.target_audience_list_exist as unknown) === "number"
    ) {
      cleanedData.target_audience_list_exist =
        (cleanedData.target_audience_list_exist as unknown as number) === 1;
    }

    // Normalize target_location: treat "null"/"no"/"none"/"na" as null
    if (typeof cleanedData.target_location === "string") {
      const lower = (cleanedData.target_location as string)
        .trim()
        .toLowerCase();
      if (["null", "no", "n", "none", "na", "not applicable"].includes(lower)) {
        cleanedData.target_location = null;
      }
    }

    console.log(`🌐 UPDATE ONBOARDING: ${hasId ? "PATCH" : "POST"} ${url}`);
    console.log("📤 Update Data:", cleanedData);
    console.log("🔐 Auth Details:", {
      hasAuthToken: !!authToken,
      hasAnonId: !!anonId,
      anonIdLength: anonId?.length || 0,
      authTokenPreview: authToken ? `${authToken.substring(0, 10)}...` : "none",
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Bearer token if available
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
      console.log("✅ Added Bearer token to headers");
    } else {
      console.log("⚠️ No Bearer token available");
    }

    if (anonId) {
      console.log("✅ Added anon_id to URL parameter");
    } else {
      console.log("⚠️ No anon_id available");
    }

    const config: RequestInit = {
      method: hasId ? ("PATCH" as const) : "POST",
      headers,
      body: JSON.stringify(cleanedData),
    };

    let response = await fetch(url, config);

    // Fallback: some environments may not allow PATCH; retry with POST to base endpoint
    if (response.status === 405 && hasId) {
      try {
        console.warn(
          "⚠️ PATCH not allowed, retrying with POST to /onboarding.php"
        );
        const fallbackUrl = `${baseURL}/onboarding.php${anonId ? `?anon_id=${anonId}` : ""}`;
        response = await fetch(fallbackUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(cleanedData),
        });
      } catch (e) {
        // continue to normal error handling
      }
    }

    if (!response.ok) {
      console.error(
        `Onboarding API error: ${response.status} ${response.statusText}`
      );
      const errorText = await response.text();
      console.error("Error details:", errorText);
      return null;
    }

    const raw = await response.json();
    console.log("✅ UPDATE ONBOARDING: Success");
    const data = (raw &&
      (raw.onboarding || raw.data || raw)) as OnboardingState;
    return data;
  } catch (error) {
    console.error("Error updating onboarding data:", error);
    return null;
  }
};

// Persistent onboarding state storage using chat memory
const onboardingStates = new Map<string, OnboardingState>();

// Helper function to reconstruct state from conversation history
const reconstructStateFromHistory = (
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
): OnboardingState => {
  console.log("🔄 RECONSTRUCTING STATE from conversation history");
  const reconstructedState: OnboardingState = {};

  // Define the onboarding sequence to match the smart router
  const onboardingSequence = [
    "sales_objective",
    "company_role",
    "short_term_goal",
    "website_url",
    "gtm",
    "target_industries",
    "target_revenue_size",
    "target_employee_size",
    "target_departments",
    "target_region",
    "target_location",
    "target_audience_list_exist",
  ];

  // Extract user responses from conversation history (excluding START_ONBOARDING)
  const userResponses: string[] = [];
  for (const msg of conversationHistory) {
    if (msg.role === "user" && msg.content !== "START_ONBOARDING") {
      userResponses.push(msg.content);
    }
  }

  console.log(
    `📝 Found ${userResponses.length} user responses to reconstruct from`
  );

  // Apply simple quick mappings first to rebuild state quickly
  for (
    let i = 0;
    i < userResponses.length && i < onboardingSequence.length;
    i++
  ) {
    const fieldName = onboardingSequence[i];
    const userResponse = userResponses[i].toLowerCase().trim();

    // Simple field mappings based on known patterns
    switch (fieldName) {
      case "sales_objective": {
        // First check for exact match with predefined options (case-insensitive)
        const salesObjectiveOptions = [
          "Generate qualified leads",
          "Expand into a new region or sector",
          "Enrich or clean an existing list",
          "Purchase a new contact list"
        ];
        const exactObjectiveMatch = salesObjectiveOptions.find(
          opt => opt.toLowerCase() === userResponses[i].toLowerCase().trim()
        );
        if (exactObjectiveMatch) {
          reconstructedState.sales_objective = exactObjectiveMatch;
          console.log(`🔍 Quick reconstructed sales_objective (EXACT): "${exactObjectiveMatch}"`);
          break;
        }
        
        // Fallback to pattern matching
        if (userResponse.includes("lead") || userResponse === "1") {
          reconstructedState.sales_objective = "Generate qualified leads";
          console.log(
            `🔍 Quick reconstructed sales_objective: "Generate qualified leads"`
          );
        } else if (userResponse.includes("expand") || userResponse === "2") {
          reconstructedState.sales_objective =
            "Expand into a new region or sector";
          console.log(
            `🔍 Quick reconstructed sales_objective: "Expand into a new region or sector"`
          );
        } else if (
          userResponse.includes("enrich") ||
          userResponse.includes("clean") ||
          userResponse === "3"
        ) {
          reconstructedState.sales_objective =
            "Enrich or clean an existing list";
          console.log(
            `🔍 Quick reconstructed sales_objective: "Enrich or clean an existing list"`
          );
        } else if (userResponse.includes("purchase") || userResponse === "4") {
          reconstructedState.sales_objective = "Purchase a new contact list";
          console.log(
            `🔍 Quick reconstructed sales_objective: "Purchase a new contact list"`
          );
        }
        break;
      }
      case "company_role": {
        // First check for exact match with predefined options (case-insensitive)
        const companyRoleOptions = [
          "Founder / CEO",
          "Sales Director or Manager",
          "Marketing Director or Manager",
          "Sales Development Representative (SDR)",
          "Consultant / Advisor",
          "Other"
        ];
        const exactRoleMatch = companyRoleOptions.find(
          opt => opt.toLowerCase() === userResponses[i].toLowerCase().trim()
        );
        if (exactRoleMatch) {
          reconstructedState.company_role = exactRoleMatch;
          console.log(`🔍 Quick reconstructed company_role (EXACT): "${exactRoleMatch}"`);
          break;
        }
        
        // Fallback to pattern matching
        if (
          userResponse.includes("ceo") ||
          userResponse.includes("founder") ||
          userResponse === "1"
        ) {
          reconstructedState.company_role = "Founder / CEO";
          console.log(`🔍 Quick reconstructed company_role: "Founder / CEO"`);
        } else if (
          userResponse.includes("sales director") ||
          userResponse.includes("sales manager") ||
          userResponse === "2"
        ) {
          reconstructedState.company_role = "Sales Director or Manager";
          console.log(
            `🔍 Quick reconstructed company_role: "Sales Director or Manager"`
          );
        } else if (
          userResponse.includes("marketing director") ||
          userResponse.includes("marketing manager") ||
          userResponse === "3"
        ) {
          reconstructedState.company_role = "Marketing Director or Manager";
          console.log(
            `🔍 Quick reconstructed company_role: "Marketing Director or Manager"`
          );
        } else if (userResponse.includes("sdr") || userResponse === "4") {
          reconstructedState.company_role =
            "Sales Development Representative (SDR)";
          console.log(
            `🔍 Quick reconstructed company_role: "Sales Development Representative (SDR)"`
          );
        } else if (
          userResponse.includes("consultant") ||
          userResponse.includes("advisor") ||
          userResponse === "5"
        ) {
          reconstructedState.company_role = "Consultant / Advisor";
          console.log(
            `🔍 Quick reconstructed company_role: "Consultant / Advisor"`
          );
        } else if (userResponse.includes("other") || userResponse === "6") {
          reconstructedState.company_role = "Other";
          console.log(`🔍 Quick reconstructed company_role: "Other"`);
        }
        break;
      }
      case "short_term_goal": {
        // First check for exact match with predefined options (case-insensitive)
        const shortTermGoalOptions = [
          "Purchase or download contacts",
          "Create a new list from scratch"
        ];
        const exactGoalMatch = shortTermGoalOptions.find(
          opt => opt.toLowerCase() === userResponses[i].toLowerCase().trim()
        );
        if (exactGoalMatch) {
          reconstructedState.short_term_goal = exactGoalMatch;
          console.log(`🔍 Quick reconstructed short_term_goal (EXACT): "${exactGoalMatch}"`);
          break;
        }
        
        // Fallback: Order matters - check more specific intents first to avoid generic keyword collisions
        if (
          userResponse.includes("create") ||
          userResponse.includes("new list") ||
          userResponse.includes("from scratch") ||
          userResponse === "4"
        ) {
          reconstructedState.short_term_goal = "Create a new list from scratch";
          console.log(
            `🔍 Quick reconstructed short_term_goal: "Create a new list from scratch"`
          );
          break;
        }
        if (
          userResponse.includes("purchase") ||
          userResponse.includes("buy") ||
          userResponse.includes("download") ||
          userResponse === "2"
        ) {
          reconstructedState.short_term_goal = "Purchase or download contacts";
          console.log(
            `🔍 Quick reconstructed short_term_goal: "Purchase or download contacts"`
          );
          break;
        }
        break;
      }
      case "website_url":
        // Enhanced website URL detection
        if (
          userResponse.includes("http") ||
          userResponse.includes("www") ||
          userResponse.includes(".com") ||
          userResponse.includes(".org") ||
          userResponse.includes(".net") ||
          userResponse.includes(".co")
        ) {
          let url = userResponses[i]; // Use original case
          // Clean up the URL
          if (!url.startsWith("http")) {
            url = "https://" + url;
          }
          reconstructedState.website_url = url;
          console.log(`🔍 Quick reconstructed website_url: "${url}"`);
        } else if (
          !["skip", "none", "not applicable", "na"].includes(userResponse)
        ) {
          // If it's not a skip but might be a domain name
          const originalResponse = userResponses[i];
          if (originalResponse.includes(".")) {
            const url = originalResponse.startsWith("http")
              ? originalResponse
              : "https://" + originalResponse;
            reconstructedState.website_url = url;
            console.log(
              `🔍 Quick reconstructed website_url (domain): "${url}"`
            );
          }
        }
        break;
      case "gtm": {
        // First check for exact match with predefined options (case-insensitive)
        const gtmOptions = ["B2B", "B2C", "B2G", "BOTH (B2B & B2C)"];
        const exactGtmMatch = gtmOptions.find(
          opt => opt.toLowerCase() === userResponses[i].toLowerCase().trim()
        );
        if (exactGtmMatch) {
          reconstructedState.gtm = exactGtmMatch;
          console.log(`🔍 Quick reconstructed gtm (EXACT): "${exactGtmMatch}"`);
          break;
        }
        
        // Fallback to pattern matching
        if (userResponse.includes("b2b") || userResponse === "1") {
          reconstructedState.gtm = "B2B";
          console.log(`🔍 Quick reconstructed gtm: "B2B"`);
        } else if (userResponse.includes("b2c") || userResponse === "2") {
          reconstructedState.gtm = "B2C";
          console.log(`🔍 Quick reconstructed gtm: "B2C"`);
        } else if (userResponse.includes("b2g") || userResponse === "3") {
          reconstructedState.gtm = "B2G";
          console.log(`🔍 Quick reconstructed gtm: "B2G"`);
        } else if (userResponse.includes("both") || userResponse === "4") {
          reconstructedState.gtm = "BOTH";
          console.log(`🔍 Quick reconstructed gtm: "BOTH"`);
        }
        break;
      }
      case "target_industries": {
        const tokens = userResponses[i]
          .split(/[,;\n\|]/)
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
        const addUnique = (arr: string[], val: string) => {
          if (!arr.includes(val)) arr.push(val);
        };
        const selected: string[] = [];

        const candidates = tokens.length > 0 ? tokens : [userResponses[i]];
        for (const t of candidates) {
          const v = t.toLowerCase();
          if (v.includes("tech") || v.includes("technology") || v.includes("software") || v === "it") {
            addUnique(selected, "Technology/IT");
            continue;
          }
          if (v.includes("healthcare") || v.includes("health") || v.includes("medical") || v.includes("pharma")) {
            addUnique(selected, "Healthcare/Wellness");
            continue;
          }
          if (v.includes("finance") || v.includes("financial") || v.includes("bank")) {
            addUnique(selected, "Accounting/Finance");
            continue;
          }
          if (v.includes("retail") || v.includes("wholesale") || v.includes("ecommerce")) {
            addUnique(selected, "Retail/Wholesale");
            continue;
          }
          if (v.includes("manufacturing") || v.includes("industrial") || v.includes("factory")) {
            addUnique(selected, "Manufacturing/Industrial");
            continue;
          }
        }

        if (selected.length > 0) {
          reconstructedState.target_industries = selected;
          console.log(`🔍 Quick reconstructed target_industries: ${selected.join(", ")}`);
        } else if (userResponse && !["skip", "none"].includes(userResponse)) {
          reconstructedState.target_industries = ["Other"];
          console.log(`🔍 Quick reconstructed target_industries: Other`);
        }
        break;
      }
      case "target_audience_list_exist":
        if (
          ["yes", "y", "true", "1", "have", "exist"].some((val) =>
            userResponse.includes(val)
          )
        ) {
          reconstructedState.target_audience_list_exist = true;
          console.log(
            `🔍 Quick reconstructed target_audience_list_exist: true`
          );
        } else if (
          ["no", "n", "false", "0", "don't", "dont", "none"].some((val) =>
            userResponse.includes(val)
          )
        ) {
          reconstructedState.target_audience_list_exist = false;
          console.log(
            `🔍 Quick reconstructed target_audience_list_exist: false`
          );
        }
        break;
      case "target_region": {
        // First check for exact match with predefined options (case-insensitive)
        const regionOptions = [
          "India",
          "North America",
          "Europe",
          "Asia-Pacific",
          "Global / Multiple regions"
        ];
        const exactRegionMatch = regionOptions.find(
          opt => opt.toLowerCase() === userResponses[i].toLowerCase().trim()
        );
        if (exactRegionMatch) {
          reconstructedState.target_region = exactRegionMatch;
          console.log(`🔍 Quick reconstructed target_region (EXACT): "${exactRegionMatch}"`);
          break;
        }
        
        // Fallback to pattern matching
        if (userResponse.includes("india") || userResponse === "1") {
          reconstructedState.target_region = "India";
          console.log(`🔍 Quick reconstructed target_region: "India"`);
        } else if (
          userResponse.includes("north america") ||
          userResponse.includes("usa") ||
          userResponse === "2"
        ) {
          reconstructedState.target_region = "North America";
          console.log(`🔍 Quick reconstructed target_region: "North America"`);
        } else if (userResponse.includes("europe") || userResponse === "3") {
          reconstructedState.target_region = "Europe";
          console.log(`🔍 Quick reconstructed target_region: "Europe"`);
        } else if (
          userResponse.includes("asia") ||
          userResponse.includes("pacific") ||
          userResponse === "4"
        ) {
          reconstructedState.target_region = "Asia-Pacific";
          console.log(`🔍 Quick reconstructed target_region: "Asia-Pacific"`);
        } else if (
          userResponse.includes("global") ||
          userResponse.includes("multiple") ||
          userResponse === "5"
        ) {
          reconstructedState.target_region = "Global / Multiple regions";
          console.log(
            `🔍 Quick reconstructed target_region: "Global / Multiple regions"`
          );
        }
        break;
      }
      case "target_revenue_size":
        if (
          userResponse.includes("under") ||
          userResponse.includes("<10") ||
          userResponse === "1"
        ) {
          reconstructedState.target_revenue_size = "0-500K";
          console.log(`🔍 Quick reconstructed target_revenue_size: "0-500K"`);
        } else if (userResponse.includes("10-50") || userResponse === "2") {
          reconstructedState.target_revenue_size = "1M-5M";
          console.log(`🔍 Quick reconstructed target_revenue_size: "1M-5M"`);
        } else if (userResponse.includes("50-250") || userResponse === "3") {
          reconstructedState.target_revenue_size = "10M-50M";
          console.log(`🔍 Quick reconstructed target_revenue_size: "10M-50M"`);
        } else if (
          userResponse.includes("over") ||
          userResponse.includes(">250") ||
          userResponse === "4"
        ) {
          reconstructedState.target_revenue_size = "100M-500M";
          console.log(
            `🔍 Quick reconstructed target_revenue_size: "100M-500M"`
          );
        }
        break;
      case "target_employee_size":
        if (
          userResponse.includes("under") ||
          userResponse.includes("<50") ||
          userResponse === "1"
        ) {
          reconstructedState.target_employee_size = "0-10";
          console.log(`🔍 Quick reconstructed target_employee_size: "0-10"`);
        } else if (userResponse.includes("50-249") || userResponse === "2") {
          reconstructedState.target_employee_size = "11-50";
          console.log(`🔍 Quick reconstructed target_employee_size: "11-50"`);
        } else if (userResponse.includes("250-999") || userResponse === "3") {
          reconstructedState.target_employee_size = "51-200";
          console.log(`🔍 Quick reconstructed target_employee_size: "51-200"`);
        } else if (
          userResponse.includes("1000") ||
          userResponse.includes(">=1000") ||
          userResponse === "4"
        ) {
          reconstructedState.target_employee_size = "501-1000";
          console.log(
            `🔍 Quick reconstructed target_employee_size: "501-1000"`
          );
        }
        break;
    }
  }

  console.log("🧩 RECONSTRUCTED STATE:", Object.keys(reconstructedState));
  return reconstructedState;
};

// Helper function to get onboarding state from memory or reconstruct from chat history
const getOnboardingState = async (
  chatId: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  anonymousUserId?: string,
  authToken?: string,
  ignoreExternal?: boolean
): Promise<OnboardingState> => {
  // Prefer local memory state to avoid repeating questions mid-flow
  const localState = onboardingStates.get(chatId);
  if (localState && Object.keys(localState).length > 0) {
    console.log("✅ Using local memory state (preferred)");
    return localState;
  }

  // If no local state, optionally fetch external state
  if (!ignoreExternal) {
    const externalState = await getOnboardingData(anonymousUserId, authToken);
    if (externalState && Object.keys(externalState).length > 0) {
      console.log("✅ Using external API state (fallback)");
      return externalState;
    }
  } else {
    console.log("🚫 Ignoring external onboarding state (restart mode)");
  }

  // Reconstruct from conversation history if available
  if (conversationHistory.length > 0) {
    console.log("🔄 Reconstructing state from conversation history");
    const reconstructedState = reconstructStateFromHistory(conversationHistory);
    onboardingStates.set(chatId, reconstructedState);
    return reconstructedState;
  }

  console.log("🆕 Starting with empty state");
  return {};
};

// Helper function to save onboarding state to memory (memory-only, no backend persistence)
const saveOnboardingState = async (
  chatId: string,
  state: OnboardingState,
  anonymousUserId?: string,
  authToken?: string
): Promise<void> => {
  // Only save to local memory - no backend persistence until completion
  const stateToStore = { ...state } as OnboardingState;
  onboardingStates.set(chatId, stateToStore);
  console.log(
    "💾 Saved state to local memory only:",
    Object.keys(stateToStore)
  );
};

const syncDashboardOnboarding = async (
  request: NextRequest,
  payload: OnboardingState,
  fallbackUserId?: string
): Promise<void> => {
  try {
    const payloadRecord = payload as Record<string, unknown>;
    const resolvedUserId =
      (typeof payloadRecord.userId === "string" && payloadRecord.userId) ||
      fallbackUserId ||
      (typeof payloadRecord.anon_id === "string"
        ? (payloadRecord.anon_id as string)
        : undefined);

    if (!resolvedUserId) {
      console.warn(
        "⚠️ DASHBOARD SYNC: Missing user identifier, skipping local store sync."
      );
      return;
    }

    const saveUrl = new URL("/api/onboarding/save", request.url);
    const response = await fetch(saveUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        onboardingData: payload,
        anonymousUserId: resolvedUserId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "❌ DASHBOARD SYNC: Failed to persist onboarding data:",
        response.status,
        errorText
      );
    } else {
      console.log(
        "✅ DASHBOARD SYNC: Onboarding data stored locally for",
        resolvedUserId
      );
    }
  } catch (error) {
    console.error(
      "❌ DASHBOARD SYNC: Unexpected error while saving onboarding data:",
      error
    );
  }
};

// Helper function to persist complete onboarding to backend
const persistCompleteOnboarding = async (
  state: OnboardingState,
  request: NextRequest,
  anonymousUserId?: string,
  authToken?: string
): Promise<OnboardingState | null> => {
  console.log("🚀 PERSISTING COMPLETE ONBOARDING to backend");
  console.log("📋 Complete state:", Object.keys(state));

  const saved = await updateOnboardingData(state, anonymousUserId, authToken);
  if (saved && typeof (saved as Record<string, unknown>).id !== "undefined") {
    console.log("✅ BACKEND PERSISTENCE: Success");
    await syncDashboardOnboarding(request, saved, anonymousUserId);
    return saved;
  } else {
    console.error("❌ BACKEND PERSISTENCE: Failed");
    return null;
  }
};

const handleConversationalOnboarding = async (request: NextRequest) => {
  try {
    const {
      message,
      chatId,
      conversationHistory = [],
    }: ConversationRequest = await request.json();

    if (!message || !chatId) {
      return NextResponse.json(
        {
          error: "Message and chatId are required",
        },
        { status: 400 }
      );
    }

    // Handle explicit reset request: clear local memory state and optionally reset external
    const urlObj = new URL(request.url);
    const shouldReset = urlObj.searchParams.get("reset") === "1";
    // Extract auth token early for reset branch
    const authHeaderForReset = request.headers.get("authorization");
    const authTokenForReset = authHeaderForReset?.startsWith("Bearer ")
      ? authHeaderForReset.substring(7)
      : undefined;
    const anonymousUserIdForReset =
      urlObj.searchParams.get("anon_id") || undefined;
    if (shouldReset || message === "RESET_ONBOARDING") {
      console.log(
        "♻️ RESET_ONBOARDING requested - clearing state and returning first question"
      );
      // Clear local memory for this chat
      onboardingStates.delete(chatId);

      // Start with empty state; ask smart router for the first question
      const analysis = await onboardingSmartRouter.analyzeConversation(
        "",
        {},
        []
      );

      // Optionally also touch external API to overwrite with empty state
      await saveOnboardingState(
        chatId,
        {},
        anonymousUserIdForReset,
        authTokenForReset
      );

      const response = {
        result: analysis.question,
        response: analysis.question,
        chatId,
        timestamp: new Date().toISOString(),
        onboarding: {
          isComplete: false,
          nextField: analysis.nextField,
          currentState: {},
          extractedValues: {},
          redirectToDashboard: false,
        },
        model_used: "onboarding_smart_router",
      };
      return NextResponse.json(response);
    }

    // Extract auth token from headers
    const authHeader = request.headers.get("authorization");
    const authToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : undefined;

    // Extract anon_id and flags from query parameters
    const url = new URL(request.url);
    const anonymousUserId = url.searchParams.get("anon_id") || undefined;
    const ignoreExternal = url.searchParams.get("ignore_external") === "1";

    console.log("🎯 CONVERSATIONAL ONBOARDING: Processing message");
    console.log(`📝 User Message: "${message}"`);
    console.log(`👤 User ID: ${anonymousUserId || "authenticated"}`);
    console.log(`💬 Chat ID: ${chatId}`);
    console.log(
      `🔐 Auth Token: ${authToken ? `Present (${authToken.substring(0, 10)}...)` : "Not present"}`
    );
    console.log(
      `🆔 Anonymous ID: ${anonymousUserId ? `Present (${anonymousUserId.substring(0, 10)}...)` : "Not present"}`
    );

    // Handle special case for starting onboarding - ALWAYS start fresh
    if (message === "START_ONBOARDING") {
      console.log("🚀 STARTING NEW ONBOARDING: Fresh journey requested");
      
      // Clear any existing state for this chat to ensure fresh start
      onboardingStates.delete(chatId);
      
      // Start with completely empty state for a new journey
      const currentState: OnboardingState = {};

      // Analyze with empty conversation to get the first question
      const analysis = await onboardingSmartRouter.analyzeConversation(
        "", // Empty message for initial state
        currentState,
        [] // Empty conversation history
      );

      console.log("🧠 INITIAL ANALYSIS RESULT:", {
        nextField: analysis.nextField,
        isComplete: analysis.isComplete,
        question: analysis.question.substring(0, 200) + "...", // Truncate for readability
      });

      // Save initial empty state
      await saveOnboardingState(
        chatId,
        currentState,
        anonymousUserId,
        authToken
      );

      // Return the initial question
      const response = {
        result: analysis.question,
        response: analysis.question,
        chatId,
        timestamp: new Date().toISOString(),
        onboarding: {
          isComplete: analysis.isComplete,
          nextField: analysis.nextField,
          currentState: currentState,
          extractedValues: {},
          redirectToDashboard: false,
        },
        model_used: "onboarding_smart_router",
      };

      return NextResponse.json(response);
    }

    // Get current onboarding state using memory management (for continuing conversations)
    const currentState: OnboardingState = await getOnboardingState(
      chatId,
      conversationHistory,
      anonymousUserId,
      authToken,
      ignoreExternal
    );

    console.log("📊 CURRENT STATE:", Object.keys(currentState));

    // This code is no longer needed as START_ONBOARDING is handled above
    // Keeping this comment for reference: START_ONBOARDING now ALWAYS starts fresh
    if (false && message === "START_ONBOARDING") {
      // Dead code - kept for reference, never executes
    }

    // Analyze conversation and get next step
    const analysis = await onboardingSmartRouter.analyzeConversation(
      message,
      currentState,
      conversationHistory
    );

    console.log("🧠 ANALYSIS RESULT:", {
      nextField: analysis.nextField,
      isComplete: analysis.isComplete,
      extractedFields: Object.keys(analysis.extractedValues),
    });

    // Update state with extracted values, but clean up any problematic values
    const cleanedExtractedValues = { ...analysis.extractedValues };

    // Remove any fields that shouldn't be sent to the API yet
    // Don't send target_audience_list_exist as 0 if it's not being asked for
    if (
      (cleanedExtractedValues.target_audience_list_exist as unknown) === 0 &&
      analysis.nextField !== "target_audience_list_exist"
    ) {
      delete cleanedExtractedValues.target_audience_list_exist;
    }

    const updatedState = {
      ...currentState,
      ...cleanedExtractedValues,
    } as OnboardingState;

    // Save updated state to memory (no backend persistence until completion)
    await saveOnboardingState(chatId, updatedState, anonymousUserId, authToken);
    console.log(`📝 Field '${analysis.nextField}' collected, stored in memory`);

    // Create or get chat session for this onboarding
    // IMPORTANT: Only create a new external chat session on explicit START_ONBOARDING.
    // Never auto-create mid-flow based on empty conversation/state, to avoid accidental resets.
    let realChatId = chatId;
    if (message === "START_ONBOARDING") {
      const newChatId = await createOnboardingChatSession(
        anonymousUserId,
        authToken
      );
      if (newChatId) {
        realChatId = newChatId;
        console.log("✅ Created new chat session for onboarding:", realChatId);
      }
    } else if (conversationHistory.length === 0 && Object.keys(currentState).length === 0) {
      console.warn(
        "⏭️ Skipping chat session creation mid-flow (no history/state). This prevents unintended resets."
      );
    }

    // Save user message to chat API (skip START_ONBOARDING)
    if (message !== "START_ONBOARDING") {
      await saveMessageToChatAPI(
        realChatId,
        "user",
        message,
        anonymousUserId,
        authToken
      );
    }

    // Save AI response to chat API
    await saveMessageToChatAPI(
      realChatId,
      "assistant",
      analysis.question,
      anonymousUserId,
      authToken
    );

    // Prepare response in the expected format
    const response = {
      result: analysis.question,
      response: analysis.question, // Backward compatibility
      chatId: realChatId, // Return the real chat ID for frontend tracking
      timestamp: new Date().toISOString(),
      onboarding: {
        isComplete: analysis.isComplete,
        nextField: analysis.nextField,
        currentState: updatedState,
        extractedValues: analysis.extractedValues,
        redirectToDashboard: analysis.isComplete,
      },
      model_used: "onboarding_smart_router",
    };

    // Log completion status and make final backend save
    if (analysis.isComplete) {
      console.log("🎉 ONBOARDING COMPLETE: All fields collected");
      console.log("📋 FINAL STATE:", updatedState);

      // Persist complete onboarding to backend in one batch request
      const finalSaveResult = await persistCompleteOnboarding(
        updatedState,
        request,
        anonymousUserId,
        authToken
      );

      if (finalSaveResult) {
        // Update local state with the persisted data (including ID)
        await saveOnboardingState(
          chatId,
          finalSaveResult,
          anonymousUserId,
          authToken
        );
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ CONVERSATIONAL ONBOARDING ERROR:", error);

    return NextResponse.json(
      {
        error: "Onboarding processing failed",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
};

export const POST = handleConversationalOnboarding;
