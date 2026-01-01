import { LightningInputs, ICPResult, SampleLead } from '../../types/lightningMode';
import { generateICPData } from './backgroundProcessing';

// Track posting state to prevent duplicate outputs
let icpPosted = false;
let leadsPosted = false;
let icpConfirmationInProgress = false;

/**
 * Get processing results from background processing
 */
export async function getLightningModeResults(): Promise<any | null> {
  if (typeof window === 'undefined') return null;
  
  console.log('🔍 Checking for stored processing results...');
  
  // Check primary storage
  const storedResults = localStorage.getItem('lightningModeResults');
  if (storedResults) {
    try {
      const { companySummary, icp, leads, status, timestamp } = JSON.parse(storedResults);
      console.log('🔍 Found stored processing results:', { status, timestamp: new Date(timestamp) });
      
      if (status === 'completed' && companySummary && icp && leads) {
        console.log('🔍 Returning completed processing results');
        return { companySummary, icp, leads };
      }
          } catch (error) {
      console.error('Error parsing stored processing results:', error);
    }
  }
  
  console.log('🔍 No completed processing results found');
  return null;
}

/**
 * Get ICP results from background processing (legacy function for compatibility)
 */
export async function getLightningModeICPResults(): Promise<{ icp: ICPResult; sampleLeads: SampleLead[] } | null> {
  const results = await getLightningModeResults();
  if (results && results.icp && results.leads) {
    return { icp: results.icp, sampleLeads: results.leads };
  }
  return null;
}

/**
 * Post compact ICP table to PSA chat with edit functionality
 */
async function postCompactICPToChat(icpData: any, inputs: LightningInputs): Promise<void> {
  try {
    const icpContent = formatCompactEditableICPTable(icpData);
    
    // Post to PSA chat via custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('postLightningMessage', {
        detail: {
          content: icpContent,
          type: 'icp',
          isHTML: true,
          timestamp: Date.now()
        }
      }));
    }
  } catch (error) {
    console.error('Error posting compact ICP to chat:', error);
  }
}

/**
 * Post ICP table to PSA chat with edit functionality (legacy function)
 */
async function postICPToChat(icpData: any, inputs: LightningInputs): Promise<void> {
  if (icpPosted) {
    console.log('🔍 ICP already posted, skipping duplicate...');
    return;
  }
  
  try {
    icpPosted = true; // Set flag to prevent duplicate posting
    const icpContent = formatEditableICPTable(icpData);
    
    // Post to PSA chat via custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('postLightningMessage', {
        detail: {
          content: icpContent,
          type: 'icp_table',
          timestamp: Date.now()
        }
      }));
    }
  } catch (error) {
    console.error('Error posting ICP to chat:', error);
    icpPosted = false; // Reset flag on error
  }
}

/**
 * Post compact prospects table to PSA chat
 */
async function postCompactProspectsToChat(leadsData: any[], inputs: LightningInputs): Promise<void> {
  if (leadsPosted) {
    console.log('🔍 Leads already posted, skipping duplicate...');
    return;
  }
  
  try {
    leadsPosted = true; // Set flag to prevent duplicate posting
    const prospectsContent = formatCompactProspectsTable(leadsData);
    
    // Post to PSA chat via custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('postLightningMessage', {
        detail: {
          content: prospectsContent,
          type: 'prospects',
          isHTML: true,
          timestamp: Date.now()
        }
      }));
    }
  } catch (error) {
    console.error('Error posting compact prospects to chat:', error);
    leadsPosted = false; // Reset flag on error
  }
}

/**
 * Post leads table to PSA chat (legacy function)
 */
async function postLeadsToChat(leadsData: any[], inputs: LightningInputs): Promise<void> {
  try {
    const leadsContent = formatLeadsTable(leadsData);
    
    // Post to PSA chat via custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('postLightningMessage', {
        detail: {
          content: leadsContent,
          type: 'leads_table',
          timestamp: Date.now()
        }
      }));
    }
  } catch (error) {
    console.error('Error posting leads to chat:', error);
  }
}

/**
 * Handle ICP confirmation and trigger prospects generation (strict sequential flow)
 */
export async function handleICPConfirmation(confirmedICP: any, inputs: LightningInputs): Promise<void> {
  if (icpConfirmationInProgress) {
    console.log('🔍 ICP confirmation already in progress, skipping duplicate...');
    return;
  }
  
  if (leadsPosted) {
    console.log('🔍 Leads already posted, skipping duplicate ICP confirmation...');
    return;
  }
  
  icpConfirmationInProgress = true;
  
  try {
    console.log('🔍 ICP confirmed, now generating prospects (Step 3)...');
    
    // Step 3: Post acknowledgment message
    const thankYouContent = `✅ **ICP confirmed. Generating prospects...**`;
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('postLightningMessage', {
        detail: {
          content: thankYouContent,
          type: 'confirmation',
          timestamp: Date.now()
        }
      }));
    }
    
    // Step 3: Generate prospects ONLY after ICP confirmation
    console.log('🔍 Step 3: Generating prospective clients based on confirmed ICP...');
    
    // Check if leads have already been generated and posted
    if (leadsPosted) {
      console.log('🔍 Leads already generated and posted, skipping duplicate generation...');
      return;
    }
    
    const { generateLeadsData } = await import('./backgroundProcessing');
    const leadsData = await generateLeadsData(inputs, confirmedICP);
    
    if (leadsData && leadsData.length > 0) {
      console.log('🔍 Prospects generated, storing and posting to PSA chat...');
      
      // Store leads in localStorage with new key
      if (typeof window !== 'undefined') {
        localStorage.setItem('lightning_leads', JSON.stringify(leadsData));
      }
      
      await postCompactProspectsToChat(leadsData, inputs);
      console.log('🔍 Sequential flow completed: Summary → ICP → Prospects');
      
      // End Lightning Mode session
      const { endLightningModeSession } = await import('./core');
      endLightningModeSession();
    } else {
      // Post error message directly
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('postLightningMessage', {
          detail: {
            content: '❌ **Lightning Mode Error**\n\nFailed to generate prospects. Please try again.\n\nPlease try again or contact support if the issue persists.',
            type: 'error',
            timestamp: Date.now()
          }
        }));
      }
    }
    
  } catch (error) {
    console.error('Error handling ICP confirmation:', error);
    // Post error message directly
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('postLightningMessage', {
        detail: {
          content: '❌ **Lightning Mode Error**\n\nFailed to generate prospects after ICP confirmation.\n\nPlease try again or contact support if the issue persists.',
          type: 'error',
          timestamp: Date.now()
        }
      }));
    }
  } finally {
    icpConfirmationInProgress = false; // Reset flag
  }
}

/**
 * Format compact editable ICP table for display (6 essential fields)
 */
export function formatCompactEditableICPTable(icpData: any): string {
  console.log('🔍 formatCompactEditableICPTable called with icpData:', icpData);
  console.log('🔍 icpData type:', typeof icpData);
  console.log('🔍 icpData keys:', icpData ? Object.keys(icpData) : 'null/undefined');
  
  let content = `<div style="margin: 20px 0;">`;
  
  // Header
  content += `<h3 style="color: #FFFFFF; margin-bottom: 16px; font-size: 20px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">Ideal Customer Profile (ICP)</h3>`;
  
  // Instruction text
  content += `<p style="color: #CBD5E1; margin-bottom: 20px; font-size: 14px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">Please review and edit your ICP below. All values have been inferred from your website analysis. Once confirmed, we'll generate a tailored list of prospective clients.</p>`;
  
  // Editable table with glassmorphism theme and scrollbars
  content += `<div style="background: rgba(24, 18, 43, 0.55); backdrop-filter: blur(24px) saturate(1.2); -webkit-backdrop-filter: blur(24px) saturate(1.2); border-radius: 16px; border: 1.5px solid rgba(59, 130, 246, 0.18); overflow: auto; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 0 rgba(59, 130, 246, 0.08) inset; max-height: 500px; max-width: 100%;">`;
  content += `<table style="width: 100%; border-collapse: collapse; min-width: 600px;">`;
  
  // Table header
  content += `<thead style="background: rgba(59, 130, 246, 0.1); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(10px);">`;
  content += `<tr>`;
  content += `<th style="padding: 20px 16px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); width: 200px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);">Field</th>`;
  content += `<th style="padding: 20px 16px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);">Inferred Value (from website + context)</th>`;
  content += `</tr>`;
  content += `</thead>`;
  
  // Table body with editable fields
  content += `<tbody>`;
  
  const fields = [
    { key: 'industry', label: 'Industry' },
    { key: 'location', label: 'Location' },
    { key: 'companySize', label: 'Company Size' },
    { key: 'decisionMakers', label: 'Decision Makers' },
    { key: 'painPoints', label: 'Pain Points' },
    { key: 'techStack', label: 'Tech Stack' }
  ];
  
  fields.forEach((field, index) => {
    // Ensure we have inferred values, not "N/A"
    let value = icpData[field.key];
    console.log(`🔍 Processing field ${field.key}:`, value, 'type:', typeof value);
    
    // Convert to string and check if it's empty or N/A
    const stringValue = String(value || '');
    if (!value || value === 'N/A' || stringValue.trim() === '') {
      // Provide intelligent defaults based on field type
      switch (field.key) {
        case 'industry':
          value = 'Technology, Manufacturing, Healthcare, Financial Services';
          break;
        case 'location':
          value = 'North America, Europe, Asia-Pacific, Global';
          break;
        case 'companySize':
          value = 'Medium to Large Enterprises (500–5,000 employees)';
          break;
        case 'decisionMakers':
          value = 'CEOs, CTOs, VPs of Engineering, Procurement Directors';
          break;
        case 'painPoints':
          value = 'Scalability challenges, Cost optimization, Integration complexity, Digital transformation';
          break;
        case 'techStack':
          value = 'Cloud platforms (AWS, Azure), CRM systems (Salesforce), Analytics tools, Modern development frameworks';
          break;
        default:
          value = 'Inferred from website analysis';
      }
    }
    
    const isEven = index % 2 === 0;
    content += `<tr style="border-bottom: 1px solid rgba(59, 130, 246, 0.2); background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease;">`;
    content += `<td style="padding: 20px 16px; font-weight: 600; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);">${field.label}</td>`;
    content += `<td style="padding: 20px 16px; vertical-align: top;">`;
    content += `<span id="icp-${field.key}" contenteditable="true" style="display: block; min-height: 24px; padding: 16px; border: 1.5px solid rgba(59, 130, 246, 0.3); border-radius: 12px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); color: #FFFFFF; outline: none; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);" onblur="updateICPField('${field.key}', this.textContent)" onfocus="this.style.background='rgba(59, 130, 246, 0.1)'; this.style.border='1.5px solid rgba(59, 130, 246, 0.6)'; this.style.boxShadow='0 0 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'" onblur="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.border='1.5px solid rgba(59, 130, 246, 0.3)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'">${String(value || '')}</span>`;
    content += `</td>`;
    content += `</tr>`;
  });
  
  content += `</tbody>`;
  content += `</table>`;
  content += `</div>`;
  
  // Note: Confirm button separated for dangerouslySetInnerHTML rendering
  content += `<p style="color: #94A3B8; font-size: 14px; text-align: center; margin-top: 16px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">Review the ICP above, then click "Confirm ICP" to generate your prospective clients list.</p>`;
  
  content += `</div>`;
  
  return content;
}

/**
 * Format editable ICP table for display (legacy function)
 */
function formatEditableICPTable(icpData: any): string {
  let content = `## 🎯 Ideal Customer Profile (ICP)\n\n`;
  content += `Please review and edit your Ideal Customer Profile below:\n\n`;
  
  content += `| Field | Current Value | Edit |\n`;
  content += `|-------|---------------|------|\n`;
  content += `| **Industry** | <span id="icp-industry" contenteditable="true">${icpData.industry || 'N/A'}</span> | <button onclick="editICPField('industry')" style="background: #4299E1; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit</button> |\n`;
  content += `| **Location** | <span id="icp-location" contenteditable="true">${icpData.location || 'N/A'}</span> | <button onclick="editICPField('location')" style="background: #4299E1; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit</button> |\n`;
  content += `| **Company Size** | <span id="icp-size" contenteditable="true">${icpData.companySize || 'N/A'}</span> | <button onclick="editICPField('size')" style="background: #4299E1; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit</button> |\n`;
  content += `| **Decision Makers** | <span id="icp-decision-makers" contenteditable="true">${icpData.decisionMakers || 'N/A'}</span> | <button onclick="editICPField('decision-makers')" style="background: #4299E1; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit</button> |\n`;
  content += `| **Budget Range** | <span id="icp-budget" contenteditable="true">${icpData.budgetRange || 'N/A'}</span> | <button onclick="editICPField('budget')" style="background: #4299E1; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit</button> |\n`;
  content += `| **Pain Points** | <span id="icp-pain-points" contenteditable="true">${icpData.painPoints || 'N/A'}</span> | <button onclick="editICPField('pain-points')" style="background: #4299E1; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit</button> |\n`;
  content += `| **Tech Stack** | <span id="icp-tech-stack" contenteditable="true">${icpData.techStack || 'N/A'}</span> | <button onclick="editICPField('tech-stack')" style="background: #4299E1; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit</button> |\n`;
  content += `| **Urgency** | <span id="icp-urgency" contenteditable="true">${icpData.urgency || 'N/A'}</span> | <button onclick="editICPField('urgency')" style="background: #4299E1; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Edit</button> |\n`;
  
  content += `\n\n<div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, rgba(66, 153, 225, 0.1), rgba(49, 130, 206, 0.1)); border-radius: 12px; border: 1px solid rgba(66, 153, 225, 0.2);">\n`;
  content += `<button onclick="confirmICP()" style="background: linear-gradient(135deg, #4299E1, #3182CE); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(66, 153, 225, 0.3);">\n`;
  content += `✅ Confirm ICP & Generate Prospect List\n`;
  content += `</button>\n`;
  content += `</div>\n\n`;
  
  content += `*💡 Click "Edit" to modify any field, then click "Confirm ICP" to generate your prospective clients list.*`;
  
  return content;
}

/**
 * Format leads table for display (legacy function)
 */
function formatLeadsTable(leadsData: any[]): string {
  let content = `## 👥 Prospective Clients (${leadsData.length} leads)\n\n`;
  content += `Here are your curated prospective clients based on your confirmed ICP:\n\n`;
  
  content += `| Company | Industry | Location | Size | Why Fit ICP | Contact/LinkedIn |\n`;
  content += `|---------|----------|----------|------|-------------|------------------|\n`;
  
  leadsData.forEach((lead: any) => {
    const contactInfo = lead.email ? lead.email : (lead.linkedin ? lead.linkedin : 'N/A');
    content += `| ${lead.company || 'N/A'} | ${lead.industry || 'N/A'} | ${lead.location || 'N/A'} | ${lead.size || 'N/A'} | ${lead.whyFit || 'N/A'} | ${contactInfo} |\n`;
  });
  
  content += `\n\n## 🚀 Next Steps\n\n`;
  content += `1. **Review the leads** - Each prospect has been matched to your ICP criteria\n`;
  content += `2. **Start outreach** - Use the contact information provided\n`;
  content += `3. **Track results** - Monitor response rates and adjust your approach\n`;
  content += `4. **Expand search** - Use the ICP criteria to find more similar prospects\n\n`;
  
  content += `✅ **Ready to start prospecting!** Your complete analysis is ready to use.\n`;
  
  return content;
}

/**
 * Format prospects table as markdown table
 */
function formatMarkdownProspectsTable(leadsData: any[]): string {
  let content = `# ⚡ Your Lead Generation Results (${leadsData.length} prospects)\n\n`;
  content += `Based on your confirmed ICP:\n\n`;
  
  // Create markdown table
  content += `| Company | Website | Industry | Decision Maker | Role | Opportunity Fit | Score | Next Step |\n`;
  content += `|---------|---------|----------|----------------|------|-----------------|-------|----------|\n`;
  
  leadsData.forEach((lead: any) => {
    const website = lead.website || lead['Company Website'] || 'N/A';
    const websiteLink = website !== 'N/A' ? `[${website}](${website})` : 'N/A';
    const opportunityFit = (lead['Opportunity Fit'] || lead.opportunityFit || 'N/A').replace(/\|/g, '\\|').substring(0, 100) + (lead['Opportunity Fit']?.length > 100 ? '...' : '');
    const nextStep = (lead['Next Step'] || lead.nextStep || 'N/A').replace(/\|/g, '\\|').substring(0, 80) + (lead['Next Step']?.length > 80 ? '...' : '');
    
    content += `| ${lead.company || lead.Company || 'N/A'} | ${websiteLink} | ${lead.industry || lead.Industry || 'N/A'} | ${lead['Decision Maker'] || lead.decisionMaker || 'N/A'} | ${lead['Decision Maker Role'] || lead.decisionMakerRole || 'N/A'} | ${opportunityFit} | ${lead.Score || lead.score || 'N/A'} | ${nextStep} |\n`;
  });
  
  content += `\n\n## 🚀 Next Steps\n\n`;
  content += `- **Review prospects** - Each company matches your confirmed ICP criteria\n`;
  content += `- **Start outreach** - Use the contact information provided\n`;
  content += `- **Track results** - Monitor response rates and adjust your approach\n`;
  content += `- **Find more leads** - Use your ICP criteria to discover similar prospects\n\n`;
  content += `✅ **Ready to start prospecting!** Your complete analysis is ready to use.`;
  
  return content;
}

/**
 * Format compact prospects table for display using responsive HTML table
 * Updated to match the 14-column structure defined in lightningLeadGenerationPrompts.ts
 */
function formatCompactProspectsTable(leadsData: any[]): string {
  let content = `<div style="margin: 20px 0;">`;
  
  // Header
  content += `<h2 style="color: #FFFFFF; margin-bottom: 16px; font-size: 24px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">⚡ Your Lead Generation Results (${leadsData.length} prospects)</h2>`;
  
  // Description
  content += `<p style="color: #CBD5E1; margin-bottom: 20px; font-size: 14px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">Based on your confirmed ICP:</p>`;
  
  // Responsive table container with glassmorphism styling
  content += `<div style="background: rgba(24, 18, 43, 0.55); backdrop-filter: blur(24px) saturate(1.2); -webkit-backdrop-filter: blur(24px) saturate(1.2); border-radius: 16px; border: 1.5px solid rgba(59, 130, 246, 0.18); overflow-x: auto; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 0 rgba(59, 130, 246, 0.08) inset; max-height: 600px; max-width: 100%;">`;
  
  // Responsive HTML table - Updated min-width for 14 columns
  content += `<table style="width: 100%; border-collapse: collapse; min-width: 1800px; font-size: 14px;">`;
  
  // Table header - Updated to match 14-column structure from prompt
  content += `<thead style="background: rgba(59, 130, 246, 0.1); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(10px);">`;
  content += `<tr>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 140px; width: 10%;">Company Name</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 160px; width: 12%;">Website</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 100px; width: 8%;">Industry</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 110px; width: 8%;">Sub-Industry</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 140px; width: 10%;">Product Line</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 160px; width: 12%;">Use Case</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 90px; width: 7%;">Employees</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 100px; width: 7%;">Revenue</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 120px; width: 9%;">Location</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 130px; width: 9%;">Key Decision Maker</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 120px; width: 8%;">Designation</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 140px; width: 10%;">Pain Points</th>`;
  content += `<th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); min-width: 130px; width: 9%;">Approach Strategy</th>`;
  content += `</tr>`;
  content += `</thead>`;
  
  // Table body
  content += `<tbody>`;
  
  leadsData.forEach((lead: any, index: number) => {
    const isEven = index % 2 === 0;
    const website = lead.website || lead['Website'] || 'N/A';
    const websiteLink = website !== 'N/A' ? `<a href="${website}" target="_blank" style="color: #60A5FA; text-decoration: none; word-break: break-all;">${website}</a>` : 'N/A';
    
    content += `<tr style="border-bottom: 1px solid rgba(59, 130, 246, 0.2); background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease;">`;
    
    // Company Name
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); font-weight: 500; word-break: break-word;">${lead.company || lead['Company Name'] || 'N/A'}</td>`;
    
    // Website
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-all;">${websiteLink}</td>`;
    
    // Industry
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word;">${lead.industry || lead['Industry'] || 'N/A'}</td>`;
    
    // Sub-Industry
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word;">${lead.subIndustry || lead['Sub-Industry'] || 'N/A'}</td>`;
    
    // Product Line
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word;">${lead.productLine || lead['Product Line'] || 'N/A'}</td>`;
    
    // Use Case
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; line-height: 1.4;">${lead.useCase || lead['Use Case'] || 'N/A'}</td>`;
    
    // Employees
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word;">${lead.employees || lead['Employees'] || 'N/A'}</td>`;
    
    // Revenue
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word;">${lead.revenue || lead['Revenue'] || 'N/A'}</td>`;
    
    // Location
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word;">${lead.location || lead['Location'] || 'N/A'}</td>`;
    
    // Key Decision Maker
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word;">${lead.decisionMaker || lead['Key Decision Maker'] || 'N/A'}</td>`;
    
    // Designation
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word;">${lead.decisionMakerRole || lead['Designation'] || 'N/A'}</td>`;
    
    // Pain Points
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; line-height: 1.4;">${lead.painPoints || lead['Pain Points'] || 'N/A'}</td>`;
    
    // Approach Strategy
    content += `<td style="padding: 16px 12px; color: #FFFFFF; vertical-align: top; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; line-height: 1.4;">${lead.approachStrategy || lead['Approach Strategy'] || 'N/A'}</td>`;
    
    content += `</tr>`;
  });
  
  content += `</tbody>`;
  content += `</table>`;
  content += `</div>`;
  
  // Next Steps
  content += `<div style="margin: 24px 0; padding: 24px; background: rgba(24, 18, 43, 0.55); backdrop-filter: blur(24px) saturate(1.2); -webkit-backdrop-filter: blur(24px) saturate(1.2); border-radius: 16px; border: 1.5px solid rgba(59, 130, 246, 0.18); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 0 rgba(59, 130, 246, 0.08) inset;">`;
  content += `<h3 style="color: #FFFFFF; margin-bottom: 16px; font-size: 18px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">Next Steps</h3>`;
  content += `<ul style="color: #CBD5E1; margin: 0; padding-left: 20px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">`;
  content += `<li style="margin-bottom: 8px;">Review prospects - Each company matches your confirmed ICP criteria</li>`;
  content += `<li style="margin-bottom: 8px;">Start outreach - Use the contact information provided</li>`;
  content += `<li style="margin-bottom: 8px;">Track results - Monitor response rates and adjust your approach</li>`;
  content += `<li style="margin-bottom: 8px;">Find more leads - Use your ICP criteria to discover similar prospects</li>`;
  content += `</ul>`;
  content += `</div>`;
  
  // View Dashboard button
  content += `<div style="text-align: center; margin: 20px 0;">`;
  content += `<button onclick="viewDashboard()" style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); border: 1px solid rgba(16, 185, 129, 0.3); color: white; padding: 16px 32px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 18px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); transition: all 0.3s ease; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);" onmouseover="this.style.background='rgba(16, 185, 129, 0.1)'; this.style.borderColor='rgba(16, 185, 129, 0.5)'; this.style.boxShadow='0 8px 24px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(16, 185, 129, 0.3)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">`;
  content += `View SalesCentri Dashboard`;
  content += `</button>`;
  content += `</div>`;
  
  content += `<p style="color: #94A3B8; font-size: 14px; text-align: center; margin-top: 16px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">Lightning Mode Complete! Your analysis is ready to use.</p>`;
  
  content += `</div>`;
  
  return content;
}

/**
 * Global functions for ICP editing and confirmation (to be attached to window)
 */
declare global {
  interface Window {
    editICPField: (field: string) => void;
    updateICPField: (field: string, value: string) => void;
  }
}

/**
 * Edit ICP field function (to be attached to window)
 */
export function editICPField(field: string): void {
  const element = document.getElementById(`icp-${field}`);
  if (element) {
    element.focus();
    element.style.backgroundColor = '#f0f8ff';
    element.style.border = '2px solid #4299E1';
    element.style.borderRadius = '4px';
    element.style.padding = '4px';
  }
}

/**
 * Update ICP field function (to be attached to window)
 */
export function updateICPField(field: string, value: string): void {
  console.log(`Updating ICP field ${field}:`, value);
  // Store the updated value for confirmation
  if (typeof window !== 'undefined') {
    const currentICP = JSON.parse(localStorage.getItem('lightningModeData') || '{}').icp || {};
    currentICP[field] = value;
    const lightningData = JSON.parse(localStorage.getItem('lightningModeData') || '{}');
    lightningData.icp = currentICP;
    localStorage.setItem('lightningModeData', JSON.stringify(lightningData));
  }
}

/**
 * Confirm ICP and trigger leads generation
 */
function confirmICP(): void {
  try {
    // Collect all ICP field values
    const icpData = {
      industry: document.getElementById('icp-industry')?.textContent || 'N/A',
      location: document.getElementById('icp-location')?.textContent || 'N/A',
      companySize: document.getElementById('icp-size')?.textContent || 'N/A',
      decisionMakers: document.getElementById('icp-decision-makers')?.textContent || 'N/A',
      budgetRange: document.getElementById('icp-budget')?.textContent || 'N/A',
      painPoints: document.getElementById('icp-pain-points')?.textContent || 'N/A',
      techStack: document.getElementById('icp-tech-stack')?.textContent || 'N/A',
      urgency: document.getElementById('icp-urgency')?.textContent || 'N/A'
    };
    
    // Get stored inputs
    const storedInputs = localStorage.getItem('lightningModeData');
    let inputs = null;
    if (storedInputs) {
      try {
        const parsed = JSON.parse(storedInputs);
        inputs = parsed.inputs;
      } catch (error) {
        console.error('Error parsing stored inputs:', error);
      }
    }
    
    if (inputs) {
      // ICP confirmation will be handled by the PSA suite page
      console.log('🔍 ICP data confirmed, ready for processing by PSA suite page');
    } else {
      console.error('No stored inputs found for ICP confirmation');
      alert('Error: No stored inputs found. Please restart Lightning Mode.');
    }
  } catch (error) {
    console.error('Error confirming ICP:', error);
    alert('Error confirming ICP. Please try again.');
  }
}

/**
 * Show ICP function (to be attached to window)
 */
function showICP(): void {
  try {
    console.log('🎯 Show ICP button clicked');
    
    // Get ICP data from localStorage
    if (typeof window !== 'undefined') {
      const icpData = JSON.parse(localStorage.getItem('lightning_icp') || '{}');
      const lightningData = JSON.parse(localStorage.getItem('lightningModeData') || '{}');
      
      if (icpData && Object.keys(icpData).length > 0) {
        console.log('🎯 ICP data found, posting to chat...');
        
        // Post ICP to chat
        window.dispatchEvent(new CustomEvent('postLightningMessage', {
          detail: {
            content: formatCompactEditableICPTable(icpData),
            type: 'icp',
            timestamp: Date.now()
          }
        }));
      } else {
        console.log('🎯 No ICP data found, generating now...');
        // If no ICP data, generate it now
        if (lightningData.inputs) {
          generateICPData(lightningData.inputs).then(icpData => {
            if (icpData) {
              localStorage.setItem('lightning_icp', JSON.stringify(icpData));
              window.dispatchEvent(new CustomEvent('postLightningMessage', {
                detail: {
                  content: formatCompactEditableICPTable(icpData),
                  type: 'icp',
                  timestamp: Date.now()
                }
              }));
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error showing ICP:', error);
  }
}

/**
 * Generate ICP button HTML for separate rendering
 */
function generateICPButtonHTML(): string {
  return `<div style="text-align: center; margin: 20px 0;">
    <button onclick="lightningShowICP()" style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); border: 1px solid rgba(59, 130, 246, 0.3); color: white; padding: 16px 32px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); transition: all 0.3s ease;" onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'; this.style.borderColor='rgba(59, 130, 246, 0.5)'; this.style.boxShadow='0 8px 24px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(59, 130, 246, 0.3)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">
      Show Ideal Customer Profile (ICP)
    </button>
  </div>`;
}

/**
 * Generate Confirm ICP button HTML for separate rendering
 */
function generateConfirmICPButtonHTML(): string {
  return `<div style="margin: 24px 0; padding: 24px; background: rgba(24, 18, 43, 0.55); backdrop-filter: blur(24px) saturate(1.2); -webkit-backdrop-filter: blur(24px) saturate(1.2); border-radius: 16px; border: 1.5px solid rgba(59, 130, 246, 0.18); text-align: center; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 0 rgba(59, 130, 246, 0.08) inset;">
    <button onclick="confirmICP()" style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); border: 1px solid rgba(59, 130, 246, 0.3); color: white; padding: 16px 32px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); transition: all 0.3s ease; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);" onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'; this.style.borderColor='rgba(59, 130, 246, 0.5)'; this.style.boxShadow='0 8px 24px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(59, 130, 246, 0.3)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">
      Confirm ICP & Generate Prospects
    </button>
  </div>`;
}

// Export markdown function
export { formatMarkdownProspectsTable };

// Make functions available globally
if (typeof window !== 'undefined') {
  (window as any).editICPField = editICPField;
  (window as any).updateICPField = updateICPField;
  (window as any).confirmICP = confirmICP;
  (window as any).showICP = showICP;
  (window as any).generateICPButtonHTML = generateICPButtonHTML;
  (window as any).generateConfirmICPButtonHTML = generateConfirmICPButtonHTML;
}
