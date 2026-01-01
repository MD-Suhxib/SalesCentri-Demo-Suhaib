import { runGemini } from '../api/gemini/geminiHandler';

export interface DecisionMaker {
  name: string;
  title: string;
  department: string;
  verificationStatus: 'verified' | 'unverified' | 'not_found';
  source: string;
  linkedinUrl?: string;
}

export interface CompanyInfo {
  name: string;
  website?: string;
  industry?: string;
  companySize?: string;
}

/**
 * Verifies decision makers for a specific company using web search
 */
export async function verifyDecisionMakers(companyInfo: CompanyInfo): Promise<DecisionMaker[]> {
  try {
    console.log('🔍 Verifying decision makers for:', companyInfo.name);

    const verificationPrompt = `
You are a professional business intelligence researcher. Find and verify the actual decision makers for: ${companyInfo.name}

COMPANY CONTEXT:
- Company Name: ${companyInfo.name}
- Website: ${companyInfo.website || 'Not provided'}
- Industry: ${companyInfo.industry || 'Not specified'}
- Company Size: ${companyInfo.companySize || 'Not specified'}

MANDATORY RESEARCH STEPS:
1. Search for "${companyInfo.name} leadership team" to find executives
2. Search for "${companyInfo.name} executives" to find C-level and VP-level staff
3. Search for "${companyInfo.name} about us team" to find key personnel
4. ${companyInfo.website ? `Search for "${companyInfo.name} ${companyInfo.website} leadership" for specific site info` : ''}
5. Search for "${companyInfo.name} LinkedIn company page" to find verified employees

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

    const verificationResult = await runGemini(verificationPrompt, [], {
      mode: 'research',
      useWebSearch: true
    });

    // Parse the JSON response
    let decisionMakers: DecisionMaker[];
    try {
      // Extract JSON from the response
      const jsonMatch = verificationResult.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        decisionMakers = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create a generic response
        decisionMakers = [
          {
            name: `Contact ${companyInfo.industry || 'Business'} Department`,
            title: 'Department Head',
            department: companyInfo.industry || 'Business',
            verificationStatus: 'not_found',
            source: 'No specific decision makers found through search'
          }
        ];
      }
    } catch (parseError) {
      console.error('Error parsing decision maker verification result:', parseError);
      decisionMakers = [
        {
          name: `Contact ${companyInfo.industry || 'Business'} Department`,
          title: 'Department Head',
          department: companyInfo.industry || 'Business',
          verificationStatus: 'not_found',
          source: 'Error parsing verification results'
        }
      ];
    }

    console.log('✅ Decision maker verification completed for:', companyInfo.name);
    return decisionMakers;

  } catch (error) {
    console.error('Decision maker verification error:', error);
    // Return fallback decision maker
    return [
      {
        name: `Contact ${companyInfo.industry || 'Business'} Department`,
        title: 'Department Head',
        department: companyInfo.industry || 'Business',
        verificationStatus: 'not_found',
        source: 'Verification failed - using fallback'
      }
    ];
  }
}

/**
 * Masks the last name of a decision maker for GDPR compliance
 * Format: "FirstName ****"
 */
export function maskDecisionMakerName(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length === 0) return fullName;
  
  // Return first name with masked last names
  if (nameParts.length === 1) {
    return `${nameParts[0]}`;
  }
  
  // First name + asterisks for remaining names
  return `${nameParts[0]} ${'*'.repeat(Math.max(4, nameParts[nameParts.length - 1].length))}`;
}

/**
 * Formats decision maker information for display in tables
 * Applies GDPR compliance by masking last names
 */
export function formatDecisionMakerForDisplay(decisionMaker: DecisionMaker): string {
  if (decisionMaker.verificationStatus === 'not_found') {
    return decisionMaker.name;
  }
  
  const verificationIcon = decisionMaker.verificationStatus === 'verified' ? '✅' : '⚠️';
  const maskedName = maskDecisionMakerName(decisionMaker.name);
  return `${maskedName} ${verificationIcon}`;
}

/**
 * Gets the best decision maker for a specific role/industry
 */
export function getBestDecisionMaker(decisionMakers: DecisionMaker[], preferredRole?: string): DecisionMaker | null {
  if (decisionMakers.length === 0) return null;

  // If preferred role specified, try to find exact match
  if (preferredRole) {
    const exactMatch = decisionMakers.find(dm => 
      dm.title.toLowerCase().includes(preferredRole.toLowerCase())
    );
    if (exactMatch) return exactMatch;
  }

  // Prioritize verified decision makers
  const verified = decisionMakers.filter(dm => dm.verificationStatus === 'verified');
  if (verified.length > 0) {
    // Prefer C-level executives
    const cLevel = verified.find(dm => 
      dm.title.toLowerCase().includes('ceo') || 
      dm.title.toLowerCase().includes('cto') || 
      dm.title.toLowerCase().includes('cmo') || 
      dm.title.toLowerCase().includes('cfo')
    );
    if (cLevel) return cLevel;

    // Then VP-level
    const vpLevel = verified.find(dm => 
      dm.title.toLowerCase().includes('vp') || 
      dm.title.toLowerCase().includes('vice president')
    );
    if (vpLevel) return vpLevel;

    // Then Director-level
    const directorLevel = verified.find(dm => 
      dm.title.toLowerCase().includes('director')
    );
    if (directorLevel) return directorLevel;

    // Return first verified
    return verified[0];
  }

  // Fallback to first unverified
  return decisionMakers[0];
}
