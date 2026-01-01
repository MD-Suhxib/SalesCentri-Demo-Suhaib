// Post-processing for lead generation results
// Verifies decision makers from official company websites

import { getDecisionMakerWithVerification } from './decisionMakerVerification';

interface ExtractedLead {
  companyName: string;
  website: string;
  decisionMaker?: string;
  title?: string;
  lineNumber: number;
}

/**
 * Extract leads from HTML table format
 */
function extractLeadsFromHTML(html: string): ExtractedLead[] {
  const leads: ExtractedLead[] = [];
  
  // Parse HTML table rows
  const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
  const cellRegex = /<td[^>]*>(.*?)<\/td>/gis;
  
  let rowMatch;
  let rowIndex = 0;
  
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowContent = rowMatch[1];
    const cells: string[] = [];
    
    // Extract all cells from the row
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      // Clean HTML tags and get text content
      const cellText = cellMatch[1].replace(/<[^>]*>/g, '').trim();
      cells.push(cellText);
    }
    
    // Expected format: Company | Website | Industry | Decision Maker | Title | ...
    if (cells.length >= 5) {
      const companyName = cells[0];
      const website = cells[1];
      
      // Decision maker and title are typically columns 3 and 4
      const decisionMaker = cells[3] || '';
      const title = cells[4] || '';
      
      if (companyName && website && website.startsWith('http')) {
        leads.push({
          companyName,
          website,
          decisionMaker: decisionMaker || undefined,
          title: title || undefined,
          lineNumber: rowIndex
        });
      }
    }
    
    rowIndex++;
  }
  
  return leads;
}

/**
 * Extract leads from markdown table format
 */
function extractLeadsFromMarkdown(markdown: string): ExtractedLead[] {
  const leads: ExtractedLead[] = [];
  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for table rows (contains | separators)
    if (line.includes('|') && !line.includes('---') && !line.includes('Company Name')) {
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      
      // Expected format: Company | Website | Industry | ... | Decision Maker | Title | ...
      if (cells.length >= 6) {
        const companyName = cells[0];
        const website = cells[1];
        
        // Find decision maker and title columns (usually columns 5-6 or 6-7)
        let decisionMaker = '';
        let title = '';
        
        // Search for columns that look like decision maker info
        for (let j = 4; j < Math.min(cells.length, 8); j++) {
          const cell = cells[j];
          // Decision makers often have names with *** for privacy
          if (cell.includes('*') || /^[A-Z][a-z]+\s+[A-Z]/.test(cell)) {
            decisionMaker = cell;
            if (j + 1 < cells.length) {
              const nextCell = cells[j + 1];
              // Check if next cell looks like a title
              if (/VP|CEO|Director|Manager|President|Officer|Head|Chief|CTO|CMO|CFO|COO/i.test(nextCell)) {
                title = nextCell;
                break;
              }
            }
          }
        }
        
        if (companyName && website && website.startsWith('http')) {
          leads.push({
            companyName,
            website,
            decisionMaker: decisionMaker || undefined,
            title: title || undefined,
            lineNumber: i
          });
        }
      }
    }
  }
  
  return leads;
}

/**
 * Verify decision makers in lead generation output
 * Updates the markdown with verified information or disclaimer
 */
export async function verifyDecisionMakersInLeads(leadOutput: string): Promise<string> {
  console.log('🔍 Starting decision maker verification for leads...');
  
  // Extract all leads from the output (handle both HTML and markdown)
  const leads = leadOutput.includes('<table') ? 
    extractLeadsFromHTML(leadOutput) : 
    extractLeadsFromMarkdown(leadOutput);
  console.log(`📋 Found ${leads.length} leads to verify`);
  
  if (leads.length === 0) {
    console.log('⚠️ No leads found in output to verify');
    return leadOutput;
  }
  
  // Verify each lead's decision maker
  const verificationResults = new Map<string, {
    verified: boolean;
    name: string;
    title: string;
    disclaimer?: string;
    source?: string;
  }>();
  
  for (const lead of leads) {
    try {
      const result = await getDecisionMakerWithVerification(
        lead.website,
        lead.companyName,
        lead.decisionMaker,
        lead.title
      );
      
      verificationResults.set(lead.companyName, {
        verified: result.verified,
        name: result.name,
        title: result.title,
        disclaimer: result.disclaimer,
        source: result.source
      });
      
    } catch (error) {
      console.error(`Error verifying decision maker for ${lead.companyName}:`, error);
      // Keep original data if verification fails
      if (lead.decisionMaker && lead.title) {
        verificationResults.set(lead.companyName, {
          verified: false,
          name: lead.decisionMaker,
          title: lead.title,
          disclaimer: '⚠️ This information may be outdated - verification failed'
        });
      }
    }
  }
  
  // Update the output with verification results
  let updatedOutput = leadOutput;
  
  if (leadOutput.includes('<table')) {
    // Handle HTML table updates
    for (const lead of leads) {
      const verification = verificationResults.get(lead.companyName);
      if (!verification) continue;
      
      // Create replacement pattern for HTML table cells
      const decisionMakerPattern = new RegExp(
        `(<td[^>]*>\\s*)${lead.decisionMaker?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*</td>)`,
        'gi'
      );
      
      const titlePattern = new RegExp(
        `(<td[^>]*>\\s*)${lead.title?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*</td>)`,
        'gi'
      );
      
      if (verification.verified) {
        // Replace with verified information and add checkmark
        updatedOutput = updatedOutput.replace(
          decisionMakerPattern,
          `$1${verification.name} ✅$2`
        );
        updatedOutput = updatedOutput.replace(
          titlePattern,
          `$1${verification.title}$2`
        );
        console.log(`✅ Verified: ${lead.companyName} - ${verification.name} from ${verification.source}`);
      } else if (verification.disclaimer) {
        // Add disclaimer after the table
        updatedOutput += `\n<div style="margin-top: 16px; padding: 12px; background: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; border-radius: 4px;">\n<p style="color: #ffc107; margin: 0; font-size: 14px;">⚠️ ${verification.disclaimer}</p>\n</div>`;
        console.log(`⚠️ Unverified: ${lead.companyName} - added disclaimer`);
      }
    }
  } else {
    // Handle markdown table updates
    const lines = leadOutput.split('\n');
    
    for (const lead of leads) {
      const verification = verificationResults.get(lead.companyName);
      if (!verification) continue;
      
      const originalLine = lines[lead.lineNumber];
      
      // Replace the decision maker information with verified data
      let updatedLine = originalLine;
      
      if (verification.verified) {
        // Add checkmark for verified info
        updatedLine = updatedLine.replace(
          /\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|/,
          `| ${verification.name} ✅ | ${verification.title} |`
        );
        console.log(`✅ Verified: ${lead.companyName} - ${verification.name} from ${verification.source}`);
      } else if (verification.disclaimer) {
        // Add disclaimer for unverified info
        updatedLine = originalLine;
        
        // Add disclaimer after the table row
        const disclaimerLine = `\n> ${verification.disclaimer}`;
        lines.splice(lead.lineNumber + 1, 0, disclaimerLine);
        console.log(`⚠️ Unverified: ${lead.companyName} - added disclaimer`);
      }
      
      lines[lead.lineNumber] = updatedLine;
    }
    
    updatedOutput = lines.join('\n');
  }
  
  const verifiedCount = Array.from(verificationResults.values()).filter(v => v.verified).length;
  console.log(`✅ Verification complete: ${verifiedCount}/${leads.length} decision makers verified from official websites`);
  
  return updatedOutput;
}

/**
 * Add verification disclaimer to lead output if not already present
 */
export function addVerificationDisclaimer(leadOutput: string): string {
  const disclaimer = `\n\n---\n\n**Decision Maker Verification Notice:**\n✅ Verified decision makers are marked with a checkmark and sourced from official company websites\n⚠️ Unverified decision makers may be outdated and could not be confirmed from official sources\n\nFor the most accurate information, please visit the company's official website or LinkedIn profile.\n`;
  
  if (!leadOutput.includes('Decision Maker Verification')) {
    return leadOutput + disclaimer;
  }
  
  return leadOutput;
}

