import { NextRequest, NextResponse } from 'next/server';
import { runGemini } from '../gemini/geminiHandler';

interface DecisionMakerVerificationRequest {
  companyName: string;
  website?: string;
  industry?: string;
  companySize?: string;
}

interface DecisionMakerVerificationResponse {
  success: boolean;
  decisionMakers: Array<{
    name: string;
    title: string;
    department: string;
    verificationStatus: 'verified' | 'unverified' | 'not_found';
    source: string;
    linkedinUrl?: string;
  }>;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { companyName, website, industry, companySize }: DecisionMakerVerificationRequest = await request.json();

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Verifying decision makers for company:', companyName);

    // Create a comprehensive search prompt for decision maker verification
    const verificationPrompt = `
You are a professional business intelligence researcher. Your task is to find and verify the actual decision makers for the company: ${companyName}

COMPANY CONTEXT:
- Company Name: ${companyName}
- Website: ${website || 'Not provided'}
- Industry: ${industry || 'Not specified'}
- Company Size: ${companySize || 'Not specified'}

MANDATORY RESEARCH STEPS:
1. Search for "${companyName} leadership team" to find executives
2. Search for "${companyName} executives" to find C-level and VP-level staff
3. Search for "${companyName} about us team" to find key personnel
4. If website provided, search for "${companyName} ${website} leadership" for specific site info
5. Search for "${companyName} LinkedIn company page" to find verified employees

VERIFICATION REQUIREMENTS:
- Find REAL decision makers with ACTUAL names and titles
- Focus on C-level executives (CEO, CTO, CMO, CFO, etc.)
- Include VP-level positions (VP Sales, VP Marketing, VP Operations, etc.)
- Include Director-level positions for mid-size companies
- Include Department Heads for smaller companies
- NEVER invent or guess names - only use verified information
- If you cannot find specific names, indicate "Contact [Department]" format

OUTPUT FORMAT:
Provide a JSON array of decision makers with this exact structure:
[
  {
    "name": "First Name Last Name",
    "title": "Exact Job Title",
    "department": "Department Name",
    "verificationStatus": "verified|unverified|not_found",
    "source": "URL or source where found",
    "linkedinUrl": "LinkedIn profile URL if available"
  }
]

VERIFICATION STATUS RULES:
- "verified": Found on official company website or LinkedIn company page
- "unverified": Found on third-party sources but not confirmed on company site
- "not_found": No specific person found, use "Contact [Department]" format

CRITICAL REQUIREMENTS:
- Only include decision makers you can actually verify through search
- Use real names and titles from official sources
- Include source URLs where you found the information
- If no specific decision makers found, provide department contacts
- Focus on roles relevant to business decisions (not technical staff)

Search thoroughly and provide accurate, verified decision maker information.
`;

    // Use Gemini to perform the verification
    const verificationResult = await runGemini(verificationPrompt, [], {
      mode: 'research',
      useWebSearch: true
    });

    // Parse the JSON response
    let decisionMakers;
    try {
      // Extract JSON from the response
      const jsonMatch = verificationResult.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        decisionMakers = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create a generic response
        decisionMakers = [
          {
            name: `Contact ${industry || 'Business'} Department`,
            title: 'Department Head',
            department: industry || 'Business',
            verificationStatus: 'not_found',
            source: 'No specific decision makers found through search'
          }
        ];
      }
    } catch (parseError) {
      console.error('Error parsing decision maker verification result:', parseError);
      decisionMakers = [
        {
          name: `Contact ${industry || 'Business'} Department`,
          title: 'Department Head',
          department: industry || 'Business',
          verificationStatus: 'not_found',
          source: 'Error parsing verification results'
        }
      ];
    }

    const response: DecisionMakerVerificationResponse = {
      success: true,
      decisionMakers
    };

    console.log('✅ Decision maker verification completed for:', companyName);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Decision maker verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify decision makers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
