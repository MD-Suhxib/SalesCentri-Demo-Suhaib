import * as XLSX from 'xlsx';

interface ResearchResults {
  gpt4o: string | null;
  gemini: string | null;
  perplexity: string | null;
}

interface ExcelExportOptions {
  fileName?: string;
  includeSalesOpportunities?: boolean;
  category?: string;
  website?: string;
  website2?: string;
}

export function exportResearchToExcel(
  query: string,
  results: ResearchResults,
  options: ExcelExportOptions = {}
) {
  const {
    fileName = `Sales_Centri_research_${query.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`,
    includeSalesOpportunities = true,
    category,
    website,
    website2
  } = options;

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Summary sheet with branding at the top
  const summaryData = [
    ['🎯 Sales Centri'],
    ['AI-Powered Sales Automation Platform'],
    ['Goals, ICP, and Leads on Autopilot'],
    [''],
    ['Research Summary'],
    ['Query:', query],
    ['Date:', new Date().toLocaleDateString()],
    ['Category:', category || 'N/A'],
    ['Your Website:', website || 'N/A'],
    ['Prospective Client Website:', website2 || 'N/A'],
    [''],
    ['Model Results Available:'],
    ['GPT-4o:', results.gpt4o ? 'Yes' : 'No'],
    ['Gemini:', results.gemini ? 'Yes' : 'No'],
    ['Perplexity:', results.perplexity ? 'Yes' : 'No']
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  // Style headers where supported (some viewers ignore styles)
  summarySheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }
  ];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Individual model sheets
  if (results.gpt4o) {
    const gptData = parseResultToSheet(results.gpt4o, 'GPT-4o Analysis');
    const gptSheet = XLSX.utils.aoa_to_sheet(gptData);
    XLSX.utils.book_append_sheet(workbook, gptSheet, 'GPT-4o');
  }

  if (results.gemini) {
    const geminiData = parseResultToSheet(results.gemini, 'Gemini Analysis');
    const geminiSheet = XLSX.utils.aoa_to_sheet(geminiData);
    XLSX.utils.book_append_sheet(workbook, geminiSheet, 'Gemini');
  }

  if (results.perplexity) {
    const perplexityData = parseResultToSheet(results.perplexity, 'Perplexity Analysis');
    const perplexitySheet = XLSX.utils.aoa_to_sheet(perplexityData);
    XLSX.utils.book_append_sheet(workbook, perplexitySheet, 'Perplexity');
  }

  // Sales Opportunities sheet (if category is sales_opportunities)
  if (includeSalesOpportunities && category === 'sales_opportunities') {
    const salesOpportunitiesData = extractSalesOpportunities(results);
    if (salesOpportunitiesData.length > 1) { // More than just headers
      const salesSheet = XLSX.utils.aoa_to_sheet(salesOpportunitiesData);
      
      // Set column widths for better readability
      const wscols = [
        { wch: 25 }, // Company Name
        { wch: 30 }, // Website
        { wch: 15 }, // Industry
        { wch: 12 }, // Employees
        { wch: 15 }, // Revenue Range
        { wch: 20 }, // Decision Maker
        { wch: 20 }, // Title
        { wch: 25 }, // Contact Info
        { wch: 30 }, // LinkedIn
        { wch: 30 }, // Pain Points
        { wch: 15 }, // Qualification Score
        { wch: 10 }, // Priority
        { wch: 12 }  // Source Model
      ];
      salesSheet['!cols'] = wscols;
      
      XLSX.utils.book_append_sheet(workbook, salesSheet, 'Lead Generation');
    }

    // Create separate sheets for different company size segments
    const sizeSegments = extractSizeSegmentedTables(results);
    Object.entries(sizeSegments).forEach(([segmentName, segmentData]) => {
      if (segmentData.length > 1) {
        const segmentSheet = XLSX.utils.aoa_to_sheet(segmentData);
        segmentSheet['!cols'] = [
          { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
          { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 30 }, { wch: 30 },
          { wch: 15 }, { wch: 10 }, { wch: 12 }
        ];
        XLSX.utils.book_append_sheet(workbook, segmentSheet, segmentName);
      }
    });

    // Create industry-specific sheets
    const industrySegments = extractIndustrySegmentedTables(results);
    Object.entries(industrySegments).forEach(([industryName, industryData]) => {
      if (industryData.length > 1) {
        const industrySheet = XLSX.utils.aoa_to_sheet(industryData);
        industrySheet['!cols'] = [
          { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
          { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 30 }, { wch: 30 },
          { wch: 15 }, { wch: 10 }, { wch: 12 }
        ];
        XLSX.utils.book_append_sheet(workbook, industrySheet, industryName);
      }
    });
  }

  // Generate and download file
  XLSX.writeFile(workbook, fileName);
}

function parseResultToSheet(result: string, title: string): any[][] {
  const data: any[][] = [
    ['🎯 Sales Centri'],
    ['AI-Powered Sales Automation Platform'],
    ['Goals, ICP, and Leads on Autopilot'],
    [''],
    [title],
    ['']
  ];

  const lines = result.split('\n');
  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];
    const trimmedLine = rawLine.trim();

    if (!trimmedLine) {
      index++;
      continue;
    }

    const tableParse = tryParseMarkdownTable(lines, index);
    if (tableParse) {
      if (data.length && data[data.length - 1].some(cell => cell)) {
        data.push(['']);
      }

      data.push(...tableParse.rows);

      if (tableParse.rows.length) {
        data.push(['']);
      }

      index = tableParse.nextIndex;
      continue;
    }

    const cleanLine = stripMarkdownFormatting(trimmedLine);
    if (cleanLine) {
      data.push([cleanLine]);
    }

    index++;
  }

  return data;
}

function tryParseMarkdownTable(
  lines: string[],
  startIndex: number
): { rows: any[][]; nextIndex: number } | null {
  const headerLine = lines[startIndex];
  if (!headerLine.includes('|')) {
    return null;
  }

  const separatorLine = lines[startIndex + 1] ?? '';
  if (!(separatorLine.includes('|') && /-/.test(separatorLine))) {
    return null;
  }

  const rows: any[][] = [];
  let hasSeparator = false;
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];
    if (!line || !line.includes('|')) {
      break;
    }

    let parts = line.split('|').map(part => part.trim());
    if (parts[0] === '') {
      parts = parts.slice(1);
    }
    if (parts[parts.length - 1] === '') {
      parts = parts.slice(0, -1);
    }

    if (parts.length === 0) {
      index++;
      continue;
    }

    const isSeparatorRow = parts.every(cell => /^:?-{2,}:?$/.test(cell));
    if (isSeparatorRow) {
      hasSeparator = true;
      index++;
      continue;
    }

    rows.push(parts.map(stripMarkdownFormatting));
    index++;
  }

  if (!hasSeparator || rows.length === 0) {
    return null;
  }

  return { rows, nextIndex: index };
}

function stripMarkdownFormatting(value: string): string {
  return value
    .replace(/^\s*[-*+]\s+/, '') // Remove bullet markers
    .replace(/^\d+\.\s*/, '') // Remove numbered list markers
    .replace(/^\#+\s*/, '') // Remove heading markers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove code spans
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Replace markdown links with text
    .replace(/\!\[(.*?)\]\((.*?)\)/g, '$1') // Replace image syntax with alt text
    .trim();
}

function extractSalesOpportunities(results: ResearchResults): any[][] {
  const data: any[][] = [
    ['🎯 Sales Centri'],
    ['AI-Powered Sales Automation Platform'],
    ['Goals, ICP, and Leads on Autopilot'],
    [''],
    ['Lead Generation Data'],
    [''],
    [
      'Company Name',
      'Website',
      'Industry',
      'Sub-Industry',
      'Product Line',
      'Use Case',
      'Employees',
      'Revenue',
      'Location',
      'Key Decision Maker',
      'Designation',
      'Pain Points',
      'Approach Strategy'
    ]
  ];

  // Extract sales opportunities from all results
  Object.entries(results).forEach(([modelName, result]) => {
    if (result) {
      const opportunities = extractTabularDataFromText(result, modelName);
      data.push(...opportunities);
    }
  });

  return data;
}

function extractTabularDataFromText(text: string, modelName: string): any[][] {
  const opportunities: any[][] = [];
  
  // Look for markdown tables in the text
  const lines = text.split('\n');
  let inTable = false;
  let tableHeaders: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect table start (line with pipes |)
    if (line.includes('|') && line.split('|').length > 3) {
      if (!inTable) {
        // This might be a header row
        const possibleHeaders = line.split('|').map(h => h.trim()).filter(h => h);
        
        // Check if next line is separator (contains dashes)
        const nextLine = lines[i + 1]?.trim() || '';
        if (nextLine.includes('-') && nextLine.includes('|')) {
          // This is a markdown table
          tableHeaders = possibleHeaders;
          inTable = true;
          i++; // Skip the separator line
          continue;
        }
      }
      
      if (inTable && tableHeaders.length > 0) {
        // Parse data row, preserving inner empty cells to keep alignment
        let parts = line.split('|').map(v => v.trim());
        if (parts[0] === '') parts = parts.slice(1);
        if (parts[parts.length - 1] === '') parts = parts.slice(0, -1);
        const values = parts;
        
        // Skip strict separator rows (all cells are dashes/align markers)
        const isSeparatorRow = values.length > 0 && values.every(cell => /^:?-{3,}:?$/.test(cell));
        if (!isSeparatorRow && values.length > 0) {
          // Clean up the values and ensure we have all columns
          const cleanValues = values.map(val => 
            val.replace(/\*\*/g, '').replace(/\*/g, '').trim()
          );
          
          // Pad with empty values if needed to ensure we have all 13 columns
          while (cleanValues.length < 13) {
            cleanValues.push('');
          }
          
          // Ensure we have exactly 13 columns for the 13-column format
          if (cleanValues.length > 13) {
            cleanValues.splice(13);
          }
          
          // Only add if we have meaningful data (not just template placeholders)
          if (cleanValues[0] && !cleanValues[0].includes('[') && !cleanValues[0].includes('Company ')) {
            opportunities.push(cleanValues);
          }
        }
      }
    } else if (inTable && line === '') {
      // Skip blank lines inside tables; do NOT end the table on a single blank line
      continue;
    }
  }
  
  // If no tabular data found, try to extract from structured text
  if (opportunities.length === 0) {
    const extractedOps = extractOpportunitiesFromStructuredText(text, modelName);
    opportunities.push(...extractedOps);
  }

  return opportunities;
}

function extractOpportunitiesFromStructuredText(text: string, modelName: string): any[][] {
  const opportunities: any[][] = [];
  
  // Look for company entries in various formats
  const companyBlocks = text.split(/(?=\*\*Company Name\*\*|\*\*[0-9]+\.|Company Name:|[0-9]+\.)/);
  
  companyBlocks.forEach(block => {
    const lines = block.split('\n').filter(line => line.trim());
    if (lines.length < 3) return;
    
    const opportunity = ['', '', '', '', '', '', '', '', '', '', '', '', modelName.toUpperCase()];
    
    lines.forEach(line => {
      const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').trim();
      
      if (cleanLine.includes('Company Name:') || cleanLine.includes('Company:')) {
        opportunity[0] = cleanLine.replace(/^[^:]+:\s*/, '').replace(/\*\*\[|\]?\*\*/g, '').trim();
      } else if (cleanLine.includes('Website:') || cleanLine.includes('URL:')) {
        opportunity[1] = cleanLine.replace(/^[^:]+:\s*/, '').trim();
      } else if (cleanLine.includes('Industry:')) {
        opportunity[2] = cleanLine.replace(/^[^:]+:\s*/, '').trim();
      } else if (cleanLine.includes('Employee') || cleanLine.includes('Size:')) {
        opportunity[3] = cleanLine.replace(/^[^:]+:\s*/, '').trim();
      } else if (cleanLine.includes('Revenue:')) {
        opportunity[4] = cleanLine.replace(/^[^:]+:\s*/, '').trim();
      } else if (cleanLine.includes('Decision Maker:')) {
        opportunity[5] = cleanLine.replace(/^[^:]+:\s*/, '').trim();
      } else if (cleanLine.includes('Title:')) {
        opportunity[6] = cleanLine.replace(/^[^:]+:\s*/, '').trim();
      } else if (cleanLine.includes('Email:') || cleanLine.includes('Contact:')) {
        opportunity[7] = cleanLine.replace(/^[^:]+:\s*/, '').trim();
      } else if (cleanLine.includes('LinkedIn:')) {
        opportunity[8] = cleanLine.replace(/^[^:]+:\s*/, '').trim();
      } else if (cleanLine.includes('Pain Points:')) {
        opportunity[9] = cleanLine.replace(/^[^:]+:\s*/, '').trim();
      } else if (cleanLine.includes('Qualification:') || cleanLine.includes('Score:')) {
        opportunity[10] = cleanLine.replace(/^[^:]+:\s*/, '').trim();
      }
    });
    
    // Only add if we have a company name
    if (opportunity[0] && !opportunity[0].includes('[') && opportunity[0].length > 1) {
      opportunities.push(opportunity);
    }
  });

  return opportunities;
}

function extractSizeSegmentedTables(results: ResearchResults): { [key: string]: any[][] } {
  const segments: { [key: string]: any[][] } = {};
  const headers = [
    'Company Name', 'Website', 'Industry', 'Employees', 'Revenue Range',
    'Decision Maker', 'Title', 'Contact Info', 'LinkedIn', 'Pain Points',
    'Qualification Score', 'Priority', 'Source Model'
  ];

  // Define size segments
  const sizeSegmentNames = [
    'Startup Prospects',
    'Small Business',
    'Mid-Market',
    'Enterprise'
  ];

  Object.entries(results).forEach(([modelName, result]) => {
    if (result) {
      sizeSegmentNames.forEach(segmentName => {
        const segmentData = extractTableBySegment(result, segmentName, modelName);
        if (segmentData.length > 0) {
          const segmentKey = segmentName.replace(/\s+/g, '_');
          if (!segments[segmentKey]) {
            segments[segmentKey] = [headers];
          }
          segments[segmentKey].push(...segmentData);
        }
      });
    }
  });

  return segments;
}

function extractIndustrySegmentedTables(results: ResearchResults): { [key: string]: any[][] } {
  const segments: { [key: string]: any[][] } = {};
  const headers = [
    'Company Name', 'Website', 'Industry', 'Employees', 'Revenue Range',
    'Decision Maker', 'Title', 'Contact Info', 'LinkedIn', 'Pain Points',
    'Qualification Score', 'Priority', 'Source Model'
  ];

  // Define industry segments
  const industrySegmentNames = [
    'Software/SaaS',
    'E-commerce/Retail',
    'Professional Services',
    'Manufacturing',
    'Healthcare/Medical',
    'Financial Services'
  ];

  Object.entries(results).forEach(([modelName, result]) => {
    if (result) {
      industrySegmentNames.forEach(segmentName => {
        const segmentData = extractTableBySegment(result, segmentName, modelName);
        if (segmentData.length > 0) {
          const segmentKey = segmentName.replace(/[\/\s]+/g, '_');
          if (!segments[segmentKey]) {
            segments[segmentKey] = [headers];
          }
          segments[segmentKey].push(...segmentData);
        }
      });
    }
  });

  return segments;
}

function extractTableBySegment(text: string, segmentName: string, modelName: string): any[][] {
  const opportunities: any[][] = [];
  const lines = text.split('\n');
  
  // Find the segment section
  let segmentStartIndex = -1;
  let segmentEndIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().includes(segmentName.toLowerCase()) && 
        (line.includes('**') || line.includes('#'))) {
      segmentStartIndex = i;
      break;
    }
  }
  
  if (segmentStartIndex === -1) return opportunities;
  
  // Find the end of this segment (next major heading or end of text)
  for (let i = segmentStartIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if ((line.includes('**') && line.includes('TABLE')) || 
        (line.includes('#') && line.length > 5) ||
        (line.includes('**') && (line.includes('PROSPECTS') || line.includes('COMPANIES')))) {
      segmentEndIndex = i;
      break;
    }
  }
  
  if (segmentEndIndex === -1) segmentEndIndex = lines.length;
  
  // Extract table data from this segment
  const segmentText = lines.slice(segmentStartIndex, segmentEndIndex).join('\n');
  const tableData = extractTabularDataFromText(segmentText, modelName);
  
  return tableData;
}

// Export bulk research results to Excel
export function exportBulkResearchToExcel(
  query: string,
  bulkResults: { [website: string]: { companyName: string; results?: ResearchResults; error?: string; processedAt?: string; processingIndex?: number } },
  fileName?: string
) {
  const workbook = XLSX.utils.book_new();

  // Get sorted companies by processing index
  const sortedCompanies = Object.entries(bulkResults)
    .map(([website, data]) => ({ website, ...data }))
    .sort((a, b) => (a.processingIndex ?? 0) - (b.processingIndex ?? 0));

  // Summary sheet
  const summaryData = [
    ['🎯 Sales Centri'],
    ['AI-Powered Sales Automation Platform'],
    ['Goals, ICP, and Leads on Autopilot'],
    [''],
    ['Bulk Research Summary'],
    ['Query:', query],
    ['Date:', new Date().toLocaleDateString()],
    ['Total Companies Processed:', sortedCompanies.length],
    [''],
    ['Processing Statistics:'],
    ['Successful:', sortedCompanies.filter(c => !c.error && c.results).length],
    ['Errors:', sortedCompanies.filter(c => c.error).length],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }
  ];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Create separate GPT-4O sheet
  const gpt4oData: any[][] = [
    ['🎯 Sales Centri'],
    ['AI-Powered Sales Automation Platform'],
    ['Goals, ICP, and Leads on Autopilot'],
    [''],
    ['GPT-4O Bulk Research Results'],
    [''],
    ['Company Name', 'Website', 'Status', 'Processed At', 'Result']
  ];

  sortedCompanies.forEach(company => {
    const gpt4oResult = company.results?.gpt4o;
    
    if (gpt4oResult && !gpt4oResult.includes('Error:') && !gpt4oResult.includes('No response')) {
      // Parse the result to extract table data if it exists
      const parsedData = parseGPT4OResultForBulk(gpt4oResult, company.companyName || '', company.website || '');
      
      if (parsedData.length > 0) {
        // Add each row from parsed data
        parsedData.forEach(row => gpt4oData.push(row));
      } else {
        // If no table found, add as text
        gpt4oData.push([
          company.companyName || '',
          company.website || '',
          company.error ? 'Error' : 'Success',
          company.processedAt ? new Date(company.processedAt).toLocaleString() : '',
          gpt4oResult
        ]);
      }
    } else {
      gpt4oData.push([
        company.companyName || '',
        company.website || '',
        'Error',
        company.processedAt ? new Date(company.processedAt).toLocaleString() : '',
        company.error || 'No result'
      ]);
    }
    
    // Add a separator row between companies
    gpt4oData.push(['', '', '', '', '']);
  });

  const gpt4oSheet = XLSX.utils.aoa_to_sheet(gpt4oData);
  gpt4oSheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 4 } }
  ];
  gpt4oSheet['!cols'] = [
    { wch: 25 }, // Company Name
    { wch: 30 }, // Website
    { wch: 12 }, // Status
    { wch: 20 }, // Processed At
    { wch: 80 }  // Result (wider for content)
  ];
  XLSX.utils.book_append_sheet(workbook, gpt4oSheet, 'GPT-4O Results');

  // Create separate Gemini sheet with proper segmentation
  const geminiData: any[][] = [
    ['🎯 Sales Centri'],
    ['AI-Powered Sales Automation Platform'],
    ['Goals, ICP, and Leads on Autopilot'],
    [''],
    ['Gemini Bulk Research Results'],
    ['']
  ];

  sortedCompanies.forEach((company, index) => {
    const geminiResult = company.results?.gemini;
    
    // Add company header
    geminiData.push([`Company #${index + 1}: ${company.companyName || 'Unknown'}`]);
    geminiData.push([`Website: ${company.website || 'N/A'}`]);
    geminiData.push([`Status: ${company.error ? 'Error' : 'Success'}`]);
    geminiData.push([`Processed At: ${company.processedAt ? new Date(company.processedAt).toLocaleString() : 'N/A'}`]);
    geminiData.push(['']);
    
    if (geminiResult && !geminiResult.includes('Error:') && !geminiResult.includes('No response')) {
      // Parse the result to extract table data
      const parsedTable = parseGeminiResultTableForBulk(geminiResult);
      
      if (parsedTable.length > 0) {
        // Add table header and data
        parsedTable.forEach(row => geminiData.push(row));
      } else {
        // If no table found, add the text content
        const lines = geminiResult.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          geminiData.push([line]);
        });
      }
    } else {
      geminiData.push([company.error || 'No result available']);
    }
    
    // Add separator between companies
    geminiData.push(['']);
    geminiData.push(['═══════════════════════════════════════════════════════════════']);
    geminiData.push(['']);
  });

  const geminiSheet = XLSX.utils.aoa_to_sheet(geminiData);
  geminiSheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 4 } }
  ];
  geminiSheet['!cols'] = [
    { wch: 35 }, // Main column
    { wch: 35 }, // Column 2
    { wch: 35 }, // Column 3
    { wch: 35 }, // Column 4
    { wch: 35 }  // Column 5
  ];
  XLSX.utils.book_append_sheet(workbook, geminiSheet, 'Gemini Results');

  // Generate and download file
  const defaultFileName = fileName || `Sales_Centri_bulk_research_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, defaultFileName);
}

// Helper function to parse GPT-4O results for bulk export
function parseGPT4OResultForBulk(result: string, companyName: string, website: string): any[][] {
  const data: any[][] = [];
  const lines = result.split('\n');
  
  // Try to detect and parse tables
  let inTable = false;
  let tableHeaders: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect markdown table
    if (line.includes('|') && !inTable) {
      inTable = true;
      // Extract headers
      const headers = line.split('|').map(h => h.trim()).filter(h => h);
      tableHeaders = ['Company', 'Website', ...headers];
      continue;
    }
    
    // Skip separator line in markdown tables
    if (inTable && line.match(/^\|[\s\-:|]+\|$/)) {
      continue;
    }
    
    // Parse table row
    if (inTable && line.includes('|')) {
      const cells = line.split('|').map(c => stripMarkdownFormatting(c.trim())).filter(c => c);
      if (cells.length > 0) {
        data.push([companyName, website, ...cells]);
      }
    } else if (inTable) {
      inTable = false;
    }
  }
  
  return data;
}

// Helper function to parse Gemini results table for bulk export
function parseGeminiResultTableForBulk(result: string): any[][] {
  const data: any[][] = [];
  const lines = result.split('\n');
  
  let inTable = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect markdown table
    if (line.includes('|') && !inTable) {
      inTable = true;
      // Extract headers
      const headers = line.split('|').map(h => h.trim()).filter(h => h);
      if (headers.length > 0) {
        data.push(headers);
      }
      continue;
    }
    
    // Skip separator line in markdown tables
    if (inTable && line.match(/^\|[\s\-:|]+\|$/)) {
      continue;
    }
    
    // Parse table row
    if (inTable && line.includes('|')) {
      const cells = line.split('|').map(c => stripMarkdownFormatting(c.trim())).filter(c => c);
      if (cells.length > 0) {
        data.push(cells);
      }
    } else if (inTable && line === '') {
      // Empty line might indicate end of table
      continue;
    } else if (inTable && !line.includes('|')) {
      inTable = false;
    }
  }
  
  return data;
}

export function exportSingleModelToExcel(
  query: string,
  result: string,
  modelName: string,
  fileName?: string
) {
  const results = {
    gpt4o: modelName === 'GPT-4o' ? result : null,
    gemini: modelName === 'Gemini' ? result : null,
    perplexity: modelName === 'Perplexity' ? result : null
  };

  exportResearchToExcel(query, results, {
    fileName: fileName || `${modelName.toLowerCase()}_research_${query.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
  });
}
