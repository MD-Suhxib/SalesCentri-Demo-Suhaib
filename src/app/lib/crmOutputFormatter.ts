// CRM-ready output formatter for sales opportunities

export interface CRMLead {
  company: string;
  website: string;
  industry: string;
  decisionMaker: string;
  decisionMakerRole: string;
  opportunityFit: string;
  score: number;
  nextStep: string;
  // CRM-specific fields
  leadSource: string;
  status: string;
  priority: string;
  estimatedValue: string;
  followUpDate: string;
  notes: string;
}

export interface CRMExportOptions {
  format: 'csv' | 'json' | 'html' | 'excel';
  includeContactInfo: boolean;
  includeNotes: boolean;
  includeScoring: boolean;
  customFields?: Record<string, string>;
}

// Convert lead data to CRM-ready format
export function formatForCRM(
  leads: Array<{
    company: string;
    website: string;
    industry: string;
    decisionMaker: string;
    decisionMakerRole: string;
    opportunityFit: string;
    score: number;
    nextStep: string;
  }>,
  options: CRMExportOptions = {
    format: 'csv',
    includeContactInfo: true,
    includeNotes: true,
    includeScoring: true
  }
): CRMLead[] {
  return leads.map(lead => ({
    ...lead,
    leadSource: 'SalesCentri Research Bot',
    status: getLeadStatus(lead.score),
    priority: getLeadPriority(lead.score),
    estimatedValue: estimateLeadValue(lead),
    followUpDate: getFollowUpDate(lead.score),
    notes: generateLeadNotes(lead, options)
  }));
}

// Determine lead status based on score
function getLeadStatus(score: number): string {
  if (score >= 8) return 'Hot Lead';
  if (score >= 6) return 'Warm Lead';
  if (score >= 4) return 'Cold Lead';
  return 'Unqualified';
}

// Determine lead priority based on score
function getLeadPriority(score: number): string {
  if (score >= 8) return 'High';
  if (score >= 6) return 'Medium';
  return 'Low';
}

// Estimate lead value based on industry and score
function estimateLeadValue(lead: {
  industry: string;
  score: number;
  decisionMakerRole: string;
}): string {
  const baseValues: Record<string, number> = {
    'technology': 50000,
    'finance': 75000,
    'healthcare': 100000,
    'manufacturing': 40000,
    'retail': 25000,
    'consulting': 30000,
    'marketing': 20000,
    'general': 35000
  };

  const baseValue = baseValues[lead.industry.toLowerCase()] || baseValues['general'];
  const scoreMultiplier = lead.score / 10;
  const roleMultiplier = lead.decisionMakerRole.toLowerCase().includes('ceo') ? 1.5 :
                        lead.decisionMakerRole.toLowerCase().includes('vp') ? 1.3 :
                        lead.decisionMakerRole.toLowerCase().includes('director') ? 1.2 : 1.0;

  const estimatedValue = Math.round(baseValue * scoreMultiplier * roleMultiplier);
  
  if (estimatedValue >= 100000) return `$${(estimatedValue / 1000)}K+`;
  if (estimatedValue >= 10000) return `$${(estimatedValue / 1000)}K`;
  return `$${estimatedValue}`;
}

// Generate follow-up date based on score
function getFollowUpDate(score: number): string {
  const now = new Date();
  let daysToAdd = 0;

  if (score >= 8) daysToAdd = 1; // Hot leads - follow up tomorrow
  else if (score >= 6) daysToAdd = 3; // Warm leads - follow up in 3 days
  else if (score >= 4) daysToAdd = 7; // Cold leads - follow up in a week
  else daysToAdd = 14; // Unqualified - follow up in 2 weeks

  const followUpDate = new Date(now.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
  return followUpDate.toISOString().split('T')[0];
}

// Generate comprehensive lead notes
function generateLeadNotes(
  lead: {
    company: string;
    industry: string;
    decisionMaker: string;
    decisionMakerRole: string;
    opportunityFit: string;
    score: number;
    nextStep: string;
    website?: string;
  },
  options: CRMExportOptions
): string {
  const notes = [];

  if (options.includeScoring) {
    notes.push(`BANT Score: ${lead.score}/10`);
  }

  notes.push(`Decision Maker: ${lead.decisionMaker} (${lead.decisionMakerRole})`);
  notes.push(`Industry: ${lead.industry}`);
  notes.push(`Opportunity: ${lead.opportunityFit}`);
  notes.push(`Next Step: ${lead.nextStep}`);

  if (options.includeContactInfo) {
    notes.push(`Website: ${lead.website}`);
  }

  // Add custom fields if provided
  if (options.customFields) {
    Object.entries(options.customFields).forEach(([key, value]) => {
      notes.push(`${key}: ${value}`);
    });
  }

  return notes.join('\n');
}

// Export leads in various formats
export function exportLeads(leads: CRMLead[], format: 'csv' | 'json' | 'html'): string {
  switch (format) {
    case 'csv':
      return exportToCSV(leads);
    case 'json':
      return exportToJSON(leads);
    case 'html':
      return exportToHTML(leads);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

// Export to CSV format
function exportToCSV(leads: CRMLead[]): string {
  const headers = [
    'Company', 'Website', 'Industry', 'Decision Maker', 'Decision Maker Role',
    'Opportunity Fit', 'Score', 'Next Step', 'Status', 'Priority',
    'Estimated Value', 'Follow Up Date', 'Lead Source', 'Notes'
  ];

  const rows = leads.map(lead => [
    lead.company,
    lead.website,
    lead.industry,
    lead.decisionMaker,
    lead.decisionMakerRole,
    lead.opportunityFit,
    lead.score.toString(),
    lead.nextStep,
    lead.status,
    lead.priority,
    lead.estimatedValue,
    lead.followUpDate,
    lead.leadSource,
    lead.notes.replace(/\n/g, '; ')
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}

// Export to JSON format
function exportToJSON(leads: CRMLead[]): string {
  return JSON.stringify(leads, null, 2);
}

// Export to HTML format
function exportToHTML(leads: CRMLead[]): string {
  const tableRows = leads.map(lead => `
    <tr>
      <td>${lead.company}</td>
      <td><a href="${lead.website}" target="_blank">${lead.website}</a></td>
      <td>${lead.industry}</td>
      <td>${lead.decisionMaker}</td>
      <td>${lead.decisionMakerRole}</td>
      <td>${lead.opportunityFit}</td>
      <td>${lead.score}</td>
      <td>${lead.nextStep}</td>
      <td><span class="status-${lead.status.toLowerCase().replace(' ', '-')}">${lead.status}</span></td>
      <td><span class="priority-${lead.priority.toLowerCase()}">${lead.priority}</span></td>
      <td>${lead.estimatedValue}</td>
      <td>${lead.followUpDate}</td>
      <td>${lead.leadSource}</td>
      <td>${lead.notes.replace(/\n/g, '<br>')}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sales Opportunities Export</title>
      <style>
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .status-hot-lead { color: #d32f2f; font-weight: bold; }
        .status-warm-lead { color: #f57c00; font-weight: bold; }
        .status-cold-lead { color: #1976d2; font-weight: bold; }
        .status-unqualified { color: #757575; }
        .priority-high { color: #d32f2f; font-weight: bold; }
        .priority-medium { color: #f57c00; font-weight: bold; }
        .priority-low { color: #757575; }
      </style>
    </head>
    <body>
      <h1>Sales Opportunities Export</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Website</th>
            <th>Industry</th>
            <th>Decision Maker</th>
            <th>Decision Maker Role</th>
            <th>Opportunity Fit</th>
            <th>Score</th>
            <th>Next Step</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Estimated Value</th>
            <th>Follow Up Date</th>
            <th>Lead Source</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

// Generate sales team action items
export function generateActionItems(leads: CRMLead[]): Array<{
  lead: string;
  action: string;
  dueDate: string;
  priority: string;
  assignedTo: string;
}> {
  return leads.map(lead => ({
    lead: lead.company,
    action: lead.nextStep,
    dueDate: lead.followUpDate,
    priority: lead.priority,
    assignedTo: getAssignedRep(lead)
  }));
}

// Assign leads to sales reps based on territory or workload
function getAssignedRep(lead: CRMLead): string {
  // Simple assignment logic - in production, this would be more sophisticated
  const reps = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Chen'];
  const hash = lead.company.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return reps[hash % reps.length];
}

// Generate summary statistics
export function generateSummaryStats(leads: CRMLead[]): {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  averageScore: number;
  totalEstimatedValue: string;
  highPriorityLeads: number;
} {
  const hotLeads = leads.filter(lead => lead.status === 'Hot Lead').length;
  const warmLeads = leads.filter(lead => lead.status === 'Warm Lead').length;
  const coldLeads = leads.filter(lead => lead.status === 'Cold Lead').length;
  const averageScore = leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length;
  const highPriorityLeads = leads.filter(lead => lead.priority === 'High').length;
  
  // Calculate total estimated value
  const totalValue = leads.reduce((sum, lead) => {
    const value = parseInt(lead.estimatedValue.replace(/[$,K]/g, ''));
    return sum + (lead.estimatedValue.includes('K') ? value * 1000 : value);
  }, 0);

  return {
    totalLeads: leads.length,
    hotLeads,
    warmLeads,
    coldLeads,
    averageScore: Math.round(averageScore * 10) / 10,
    totalEstimatedValue: totalValue >= 1000000 ? `$${(totalValue / 1000000).toFixed(1)}M` : `$${(totalValue / 1000).toFixed(0)}K`,
    highPriorityLeads
  };
}
