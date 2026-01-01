"use client";

import React from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
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
  useCase: string;
  painPoints: string;
  priority: string;
  contactInfo: string;
}

interface ExcelExportProps {
  data: string;
  filename?: string;
  className?: string;
  title?: string;
}

// Helper function to clean and format website URLs
const cleanWebsiteURL = (url: string): string => {
  if (!url) return '';
  
  // Remove markdown formatting first
  let cleanUrl = url.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Extract text from [text](url) format - FIXED: was $2
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
  
  return cleanUrl;
};

// Enhanced table detection and column mapping for PSAGPT format
interface ColumnMapping {
  company: number;
  website: number;
  industry: number;
  employees: number;
  revenue: number;
  location: number;
  decisionMaker: number;
  title: number;
  painPoints: number;
  solutionFit: number;
  verificationStatus: number;
  [key: string]: number;
}

const detectColumnMapping = (headerCells: string[]): ColumnMapping => {
  const mapping: ColumnMapping = {
    company: -1,
    website: -1,
    industry: -1,
    employees: -1,
    revenue: -1,
    location: -1,
    decisionMaker: -1,
    title: -1,
    painPoints: -1,
    solutionFit: -1,
    verificationStatus: -1
  };

  headerCells.forEach((cell, index) => {
    const lowerCell = cell.toLowerCase();
    
    // Company name detection
    if (lowerCell.includes('company') && !lowerCell.includes('website')) {
      mapping.company = index;
    }
    
    // Website detection
    if (lowerCell.includes('website') || lowerCell.includes('url')) {
      mapping.website = index;
    }
    
    // Industry detection
    if (lowerCell.includes('industry') || lowerCell.includes('sector')) {
      mapping.industry = index;
    }
    
    // Employee count detection
    if (lowerCell.includes('employee') || lowerCell.includes('staff') || lowerCell.includes('size')) {
      mapping.employees = index;
    }
    
    // Revenue detection
    if (lowerCell.includes('revenue') || lowerCell.includes('sales') || lowerCell.includes('income')) {
      mapping.revenue = index;
    }
    
    // Location detection
    if (lowerCell.includes('location') || lowerCell.includes('city') || lowerCell.includes('address')) {
      mapping.location = index;
    }
    
    // Decision maker detection
    if (lowerCell.includes('decision') || lowerCell.includes('contact') || lowerCell.includes('manager')) {
      mapping.decisionMaker = index;
    }
    
    // Title detection
    if (lowerCell.includes('title') || lowerCell.includes('position') || lowerCell.includes('role')) {
      mapping.title = index;
    }
    
    // Pain points detection
    if (lowerCell.includes('pain') || lowerCell.includes('challenge') || lowerCell.includes('need')) {
      mapping.painPoints = index;
    }
    
    // Solution fit detection
    if (lowerCell.includes('solution') || lowerCell.includes('fit') || lowerCell.includes('match') || lowerCell.includes('perfect')) {
      mapping.solutionFit = index;
    }
    
    // Verification status detection
    if (lowerCell.includes('verification') || lowerCell.includes('status') || lowerCell.includes('verified')) {
      mapping.verificationStatus = index;
    }
  });

  return mapping;
};

// Enhanced table data extraction with dynamic column mapping
const extractTableDataEnhanced = (text: string): Lead[] => {
  const leads: Lead[] = [];
  
  try {
    if (!text || typeof text !== 'string') {
      console.warn('Invalid text input for table extraction');
      return leads;
    }
    
    const rows = text.split('\n');
    let inTable = false;
    let headerProcessed = false;
    let columnMapping: ColumnMapping | null = null;
    let tableCount = 0;
    
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
        if (cells.length >= 3 && 
            cells.some(cell => cell.toLowerCase().includes('company')) &&
            cells.some(cell => cell.toLowerCase().includes('website'))) {
          inTable = true;
          headerProcessed = true;
          tableCount++;
          columnMapping = detectColumnMapping(cells);
          
          // Validate column mapping
          if (columnMapping.company === -1) {
            console.warn(`Table ${tableCount}: No company column found, skipping table`);
            inTable = false;
            headerProcessed = false;
            columnMapping = null;
            continue;
          }
          
          console.log(`Table ${tableCount} detected with ${cells.length} columns`);
          continue;
        }
        
        // Process data rows
        if (inTable && headerProcessed && columnMapping && cells.length >= 3) {
          try {
            const lead: Lead = {
              company: getCellValue(cells, columnMapping.company),
              website: cleanWebsiteURL(getCellValue(cells, columnMapping.website)),
              industry: getCellValue(cells, columnMapping.industry),
              employeeCount: getCellValue(cells, columnMapping.employees),
              revenue: getCellValue(cells, columnMapping.revenue),
              location: getCellValue(cells, columnMapping.location),
              decisionMaker: getCellValue(cells, columnMapping.decisionMaker),
              title: getCellValue(cells, columnMapping.title),
              painPoints: getCellValue(cells, columnMapping.painPoints),
              useCase: getCellValue(cells, columnMapping.solutionFit),
              email: '',
              linkedinUrl: '',
              priority: '',
              contactInfo: ''
            };
            
            // Validate lead data
            if (isValidLead(lead)) {
              leads.push(lead);
            } else {
              console.warn(`Invalid lead data skipped: ${lead.company || 'Unknown'}`);
            }
          } catch (error) {
            console.error(`Error processing lead data at row ${i}:`, error);
          }
        }
      } else {
        // Not a table row, reset table processing
        inTable = false;
        headerProcessed = false;
        columnMapping = null;
      }
    }
    
    console.log(`Enhanced extraction found ${leads.length} valid leads from ${tableCount} tables`);
  } catch (error) {
    console.error('Error in enhanced table extraction:', error);
  }
  
  return leads;
};

// Validation function for lead data
const isValidLead = (lead: Lead): boolean => {
  // Must have company name
  if (!lead.company || lead.company.trim() === '') {
    return false;
  }
  
  // Company name should not be a header
  if (lead.company.toLowerCase().includes('company name') || 
      lead.company.toLowerCase().includes('company')) {
    return false;
  }
  
  // Company name should not be empty or just whitespace
  if (lead.company.trim().length < 2) {
    return false;
  }
  
  return true;
};

// Helper function to safely get cell value
const getCellValue = (cells: string[], index: number): string => {
  if (index === -1 || index >= cells.length) return '';
  return cells[index]?.replace(/\*\*/g, '').replace(/\*/g, '').trim() || '';
};

// Helper function to extract tabular data from markdown text
const extractTableData = (text: string): Lead[] => {
  const leads: Lead[] = [];
  
  // Look for markdown tables with the new clean format: | Company Name | Website | Industry | Employees | Why Perfect Fit |
  const rows = text.split('\n');
  
  let inTable = false;
  let headerProcessed = false;
  
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
      
      // Check if this is a header row for our new format
      if (cells.length >= 5 && 
          cells.some(cell => cell.toLowerCase().includes('company')) &&
          cells.some(cell => cell.toLowerCase().includes('website')) &&
          cells.some(cell => cell.toLowerCase().includes('industry'))) {
        inTable = true;
        headerProcessed = true;
        continue;
      }
      
      // Process data rows
      if (inTable && headerProcessed && cells.length >= 5) {
        const lead: Lead = {
          company: cells[0]?.replace(/\*\*\[|\]?\*\*/g, '').replace(/\*/g, '').trim() || '',
          website: cleanWebsiteURL(cells[1] || ''),
          industry: cells[2]?.replace(/\*\*/g, '').replace(/\*/g, '').trim() || '',
          employeeCount: cells[3]?.replace(/\*\*/g, '').replace(/\*/g, '').trim() || '',
          useCase: cells[4]?.replace(/\*\*/g, '').replace(/\*/g, '').trim() || '', // "Why Perfect Fit" goes to useCase
          decisionMaker: '',
          title: '',
          email: '',
          linkedinUrl: '',
          revenue: '',
          location: '',
          painPoints: '',
          priority: '',
          contactInfo: ''
        };
        
        // Only add if we have essential data
        if (lead.company && lead.company !== '' && !lead.company.toLowerCase().includes('company name')) {
          leads.push(lead);
        }
      }
    } else {
      // Not a table row, reset table processing
      inTable = false;
      headerProcessed = false;
    }
  }
  
  return leads;
};

// Single model export component
export const SingleModelExcelExportButton: React.FC<ExcelExportProps> = ({
  data,
  filename = 'leads_export',
  className = '',
  title = 'Export to Excel'
}) => {
  const handleExport = () => {
    try {
      // Try enhanced extraction first, fallback to original if needed
      let leads = extractTableDataEnhanced(data);
      
      // If enhanced extraction found no leads, try original method
      if (leads.length === 0) {
        leads = extractTableData(data);
      }
      
      if (leads.length === 0) {
        alert('No lead data found in the results to export.');
        return;
      }
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      
      // Convert leads to array format for Excel - enhanced to include all available fields with branding at the top
      const worksheetData = [
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
          lead.location,
          lead.decisionMaker,
          lead.title, // Designation
          lead.painPoints,
          lead.approachStrategy || '' // Approach Strategy
        ])
      ];
      
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Auto-size columns
      const colWidths = worksheetData[0].map((_, colIndex) => {
        const maxLength = Math.max(
          ...worksheetData.map(row => String(row[colIndex] || '').length)
        );
        return { wch: Math.min(Math.max(maxLength, 10), 50) };
      });
      ws['!cols'] = colWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Leads');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
      const finalFilename = `${filename}_${timestamp}.xlsx`;
      
      // Save file
      XLSX.writeFile(wb, finalFilename);
      
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
      <span>Excel</span>
    </button>
  );
};

// Single model export component
export const SingleModelExcelExportButton: React.FC<ExcelExportProps> = ({
  data,
  filename = 'leads_export',
  className = '',
  title = 'Export to Excel'
}) => {
  const handleExport = () => {
    try {
      // Try enhanced extraction first, fallback to original if needed
      let leads = extractTableDataEnhanced(data);
      
      // If enhanced extraction found no leads, try original method
      if (leads.length === 0) {
        leads = extractTableData(data);
      }
      
      if (leads.length === 0) {
        alert('No lead data found in the results to export.');
        return;
      }
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      
      // Convert leads to array format for Excel - enhanced with all fields
      const worksheetData = [
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
          lead.location,
          lead.decisionMaker,
          lead.title, // Designation
          lead.painPoints,
          lead.approachStrategy || '' // Approach Strategy
        ])
      ];
      
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Auto-size columns
      const colWidths = worksheetData[0].map((_, colIndex) => {
        const maxLength = Math.max(
          ...worksheetData.map(row => String(row[colIndex] || '').length)
        );
        return { wch: Math.min(Math.max(maxLength, 10), 50) };
      });
      ws['!cols'] = colWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Leads');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
      const finalFilename = `${filename}_${timestamp}.xlsx`;
      
      // Save file
      XLSX.writeFile(wb, finalFilename);
      
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
      <span>Excel</span>
    </button>
  );
};

// Multi-model research export component
interface ResearchExcelExportProps {
  results: {
    gpt4o: string | null;
    gemini: string | null;
    perplexity: string | null;
  };
  filename?: string;
  className?: string;
}

export const ResearchExcelExportButton: React.FC<ResearchExcelExportProps> = ({
  results,
  filename = 'research_leads_export',
  className = ''
}) => {
  const handleExport = () => {
    try {
      const wb = XLSX.utils.book_new();
      let hasData = false;
      
      // Process each model's results
      Object.entries(results).forEach(([model, data]) => {
        if (data) {
          // Try enhanced extraction first, fallback to original if needed
          let leads = extractTableDataEnhanced(data);
          
          // If enhanced extraction found no leads, try original method
          if (leads.length === 0) {
            leads = extractTableData(data);
          }
          
          if (leads.length > 0) {
            hasData = true;
            
            // Convert leads to array format for Excel - enhanced with all fields and branding at the top
            const worksheetData = [
              ['🎯 Sales Centri'],
              ['AI-Powered Sales Automation Platform'],
              ['Goals, ICP, and Leads on Autopilot'],
              [''],
              [`${model.toUpperCase()} Research Results`],
              [''],
              [
                'Company',
                'Website', 
                'Decision Maker',
                'Title',
                'Email',
                'LinkedIn URL',
                'Employee Count',
                'Revenue',
                'Location',
                'Industry',
                'Use Case',
                'Pain Points',
                'Priority',
                'Contact Info'
              ],
              ...leads.map(lead => [
                lead.company,
                lead.website,
                lead.decisionMaker,
                lead.title,
                lead.email,
                lead.linkedinUrl,
                lead.employeeCount,
                lead.revenue,
                lead.location,
                lead.industry,
                lead.useCase,
                lead.painPoints,
                lead.priority,
                lead.contactInfo
              ])
            ];
            
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);
            
            // Auto-size columns
            const colWidths = worksheetData[0].map((_, colIndex) => {
              const maxLength = Math.max(
                ...worksheetData.map(row => String(row[colIndex] || '').length)
              );
              return { wch: Math.min(Math.max(maxLength, 10), 50) };
            });
            ws['!cols'] = colWidths;
            
            // Add worksheet to workbook
            const sheetName = model.toUpperCase();
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
          }
        }
      });
      
      if (!hasData) {
        alert('No lead data found in any of the results to export.');
        return;
      }
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
      const finalFilename = `${filename}_${timestamp}.xlsx`;
      
      // Save file
      XLSX.writeFile(wb, finalFilename);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 ${className}`}
      title="Export All Results to Excel"
    >
      <Download size={16} />
      <span>Export Excel</span>
    </button>
  );
};
