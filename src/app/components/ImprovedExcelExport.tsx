"use client";

import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Lead {
  company: string;
  website: string;
  decisionMaker: string;
  title: string;
  email: string;
  linkedinUrl: string;
  employeeCount: string | number;
  revenue: string;
  location: string;
  industry: string;
  subIndustry?: string;
  productLine?: string;
  useCase: string;
  painPoints: string;
  priority: string;
  contactInfo: string;
  approachStrategy?: string;
}

interface ExcelExportProps {
  data: string;
  filename?: string;
  className?: string;
  title?: string;
}

// Enhanced helper function to clean and format website URLs
const cleanWebsiteURL = (url: string): string => {
  if (!url) return '';
  
  // Remove markdown formatting first
  let cleanUrl = url.replace(/\[([^\]]+)\]\([^)]+\)/g, '$2'); // Extract URL from [text](url) format
  cleanUrl = cleanUrl.replace(/\*\*/g, '').replace(/\*/g, '').trim(); // Remove bold/italic
  
  // Aggressively remove quotes, parentheses, and brackets from start and end
  cleanUrl = cleanUrl.replace(/^["'`()\[\]<>{}]+|["'`()\[\]<>{}]+$/g, '');
  
  // Remove quotes and parentheses from anywhere in the URL (common AI formatting issues)
  cleanUrl = cleanUrl.replace(/["'`()]/g, '');
  
  // Remove any whitespace
  cleanUrl = cleanUrl.trim();
  
  // Handle markdown link format where URL might be in parentheses
  const urlMatch = cleanUrl.match(/https?:\/\/[^\s)]+/);
  if (urlMatch) {
    cleanUrl = urlMatch[0];
  }
  
  // Ensure URL has protocol
  if (cleanUrl && !cleanUrl.startsWith('http')) {
    // Check if it looks like a domain
    if (cleanUrl.includes('.') && !cleanUrl.includes(' ') && cleanUrl.length > 4) {
      cleanUrl = 'https://' + cleanUrl;
    }
  }
  
  // Remove any trailing punctuation that might interfere
  cleanUrl = cleanUrl.replace(/[,;)\]}>\.]+$/, '');
  
  // Final cleanup - ensure no quotes or parentheses remain
  cleanUrl = cleanUrl.replace(/["'`()]/g, '');
  
  // Validate URL format
  try {
    if (cleanUrl.startsWith('http')) {
      new URL(cleanUrl); // This will throw if invalid
      return cleanUrl;
    }
  } catch (e) {
    // If URL is invalid, try to extract just the domain part
    const domainMatch = cleanUrl.match(/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/);
    if (domainMatch) {
      cleanUrl = 'https://' + domainMatch[0];
      try {
        new URL(cleanUrl);
        return cleanUrl;
      } catch (e2) {
        console.warn('Could not create valid URL from:', url);
      }
    }
  }
  
  return cleanUrl;
};

// Enhanced helper function to extract tabular data from markdown text
const extractTableData = (text: string): Lead[] => {
  const leads: Lead[] = [];
  
  // Look for markdown tables with the sales opportunities format
  const rows = text.split('\n');
  
  let inTable = false;
  let headerProcessed = false;
  let columnMapping: { [key: string]: number } = {};
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trim();
    
    // Skip empty rows
    if (!row) continue;
    
    // Check if this is a table row
    if (row.startsWith('|') && row.endsWith('|')) {
      const cells = row.split('|').map(c => c.trim()).filter(c => c);
      
      // Skip separator rows (contains dashes)
      if (cells.some(cell => cell.includes('---'))) {
        continue;
      }
      
      // Check if this is a header row
      if (!headerProcessed && cells.length >= 3 && 
          cells.some(cell => cell.toLowerCase().includes('company')) &&
          cells.some(cell => cell.toLowerCase().includes('website'))) {
        
        // Map column headers to indices
        cells.forEach((header, index) => {
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('company')) columnMapping.company = index;
          else if (lowerHeader.includes('website')) columnMapping.website = index;
          else if (lowerHeader.includes('industry') && !lowerHeader.includes('sub')) columnMapping.industry = index;
          else if (lowerHeader.includes('sub-industry') || lowerHeader.includes('sub industry')) columnMapping.subIndustry = index;
          else if (lowerHeader.includes('product line') || lowerHeader.includes('productline')) columnMapping.productLine = index;
          else if (lowerHeader.includes('employee')) columnMapping.employees = index;
          else if (lowerHeader.includes('revenue')) columnMapping.revenue = index;
          else if (lowerHeader.includes('location')) columnMapping.location = index;
          else if (lowerHeader.includes('decision') || lowerHeader.includes('contact')) columnMapping.decisionMaker = index;
          else if (lowerHeader.includes('title') || lowerHeader.includes('designation')) columnMapping.title = index;
          else if (lowerHeader.includes('email')) columnMapping.email = index;
          else if (lowerHeader.includes('linkedin')) columnMapping.linkedin = index;
          else if (lowerHeader.includes('pain')) columnMapping.painPoints = index;
          else if (lowerHeader.includes('priority')) columnMapping.priority = index;
          else if (lowerHeader.includes('approach') || lowerHeader.includes('strategy')) columnMapping.approachStrategy = index;
          else if (lowerHeader.includes('fit') || lowerHeader.includes('use') || lowerHeader.includes('why')) columnMapping.useCase = index;
        });
        
        inTable = true;
        headerProcessed = true;
        continue;
      }
      
      // Process data rows
      if (inTable && headerProcessed && cells.length >= 3) {
        const lead: Lead = {
          company: (cells[columnMapping.company] || '')?.replace(/\*\*\[|\]?\*\*/g, '').replace(/\*/g, '').trim(),
          website: cleanWebsiteURL(cells[columnMapping.website] || ''),
          industry: (cells[columnMapping.industry] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          subIndustry: (cells[columnMapping.subIndustry] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          productLine: (cells[columnMapping.productLine] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          employeeCount: (cells[columnMapping.employees] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          revenue: (cells[columnMapping.revenue] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          location: (cells[columnMapping.location] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          useCase: (cells[columnMapping.useCase] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          decisionMaker: (cells[columnMapping.decisionMaker] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          title: (cells[columnMapping.title] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          email: (cells[columnMapping.email] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          linkedinUrl: cleanWebsiteURL(cells[columnMapping.linkedin] || ''),
          painPoints: (cells[columnMapping.painPoints] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          priority: (cells[columnMapping.priority] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          approachStrategy: (cells[columnMapping.approachStrategy] || '')?.replace(/\*\*/g, '').replace(/\*/g, '').trim(),
          contactInfo: ''
        };
        
        // Only add if we have essential data and it's not a template row
        if (lead.company && 
            lead.company !== '' && 
            !lead.company.toLowerCase().includes('company name') &&
            !lead.company.toLowerCase().includes('[company]') &&
            lead.company.length > 2) {
          leads.push(lead);
        }
      }
    } else if (inTable) {
      // End of table - look for next table
      inTable = false;
      headerProcessed = false;
      columnMapping = {};
    }
  }
  
  return leads;
};

// Enhanced Excel export with improved website formatting
export const ImprovedSalesOpportunitiesExcelExport: React.FC<ExcelExportProps> = ({
  data,
  filename = 'sales_opportunities',
  className = '',
  title = 'Export to Excel'
}) => {
  const handleExport = async () => {
    // Check authentication before exporting
    const { checkAuthQuick } = await import('../lib/auth');
    const { getLoginUrl } = await import('../lib/loginUtils');
    
    if (!checkAuthQuick()) {
      console.log('🔐 Sales Opportunities Excel Export: Authentication required');
      // Redirect to login with current page preserved
      window.location.href = getLoginUrl(true);
      return;
    }
    
    try {
      console.log('🔍 Starting improved Excel export for sales opportunities...');
      const leads = extractTableData(data);
      
      if (leads.length === 0) {
        alert('No sales opportunity data found in the results to export. Please ensure the AI response contains properly formatted tables with company information.');
        return;
      }
      
      console.log(`✅ Extracted ${leads.length} leads for export`);
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      
      // Convert leads to array format for Excel with improved headers and branding at the top
      const worksheetData = [
        ['🎯 Sales Centri'],
        ['AI-Powered Sales Automation Platform'],
        ['Goals, ICP, and Leads on Autopilot'],
        [''],
        ['Sales Opportunities Data'],
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
        ],
        ...leads.map(lead => [
          lead.company,
          lead.website,
          lead.industry,
          lead.subIndustry || '', // Sub-Industry
          lead.productLine || '', // Product Line
          lead.useCase,
          lead.employeeCount,
          lead.revenue,
          lead.location || '', // Location
          lead.decisionMaker,
          lead.title, // Designation
          lead.painPoints,
          lead.approachStrategy || '' // Approach Strategy
        ])
      ];
      
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Enhanced column widths with special handling for URLs
      const colWidths = worksheetData[0].map((header, colIndex) => {
        const maxLength = Math.max(
          ...worksheetData.map(row => String(row[colIndex] || '').length)
        );
        
        // Special handling for different column types
        const headerStr = String(header);
        if (headerStr.includes('Website') || headerStr.includes('LinkedIn')) {
          return { wch: Math.min(Math.max(maxLength, 35), 70) }; // Extra wide for URLs
        } else if (headerStr.includes('Company')) {
          return { wch: Math.min(Math.max(maxLength, 25), 50) }; // Wide for company names
        } else if (headerStr.includes('Why Perfect Fit') || headerStr.includes('Pain Points')) {
          return { wch: Math.min(Math.max(maxLength, 30), 60) }; // Wide for descriptions
        } else if (headerStr.includes('Email')) {
          return { wch: Math.min(Math.max(maxLength, 25), 45) }; // Medium-wide for emails
        }
        
        return { wch: Math.min(Math.max(maxLength, 12), 40) };
      });
      ws['!cols'] = colWidths;
      
      // Make URLs clickable hyperlinks
      worksheetData.forEach((row, rowIndex) => {
        if (rowIndex > 0) { // Skip header row
          // Handle Website URLs
          const websiteColIndex = worksheetData[0].indexOf('Website URL');
          if (websiteColIndex !== -1 && row[websiteColIndex]) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: websiteColIndex });
            const url = row[websiteColIndex];
            
            if (url && (String(url).startsWith('http://') || String(url).startsWith('https://'))) {
              ws[cellAddress] = {
                t: 's',
                v: url,
                l: { Target: url, Tooltip: `Visit ${url}` }
              };
            }
          }
          
          // Handle LinkedIn URLs
          const linkedinColIndex = worksheetData[0].indexOf('LinkedIn URL');
          if (linkedinColIndex !== -1 && row[linkedinColIndex]) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: linkedinColIndex });
            const url = row[linkedinColIndex];
            
            if (url && (String(url).startsWith('http://') || String(url).startsWith('https://'))) {
              ws[cellAddress] = {
                t: 's',
                v: url,
                l: { Target: url, Tooltip: `Visit ${url}` }
              };
            }
          }
          
          // Handle Email addresses
          const emailColIndex = worksheetData[0].indexOf('Email');
          if (emailColIndex !== -1 && row[emailColIndex]) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: emailColIndex });
            const email = row[emailColIndex];
            
            if (email && String(email).includes('@')) {
              ws[cellAddress] = {
                t: 's',
                v: email,
                l: { Target: `mailto:${email}`, Tooltip: `Send email to ${email}` }
              };
            }
          }
        }
      });
      
      // Add freeze panes to keep headers visible
      ws['!freeze'] = { xSplit: 0, ySplit: 1 };
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sales Opportunities');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
      const finalFilename = `${filename}_${timestamp}.xlsx`;
      
      // Save file
      XLSX.writeFile(wb, finalFilename);
      
      console.log(`✅ Excel file exported successfully: ${finalFilename}`);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 ${className}`}
      title={title}
    >
      <FileSpreadsheet size={16} />
      <span>Excel (Enhanced)</span>
    </button>
  );
};

export default ImprovedSalesOpportunitiesExcelExport;
