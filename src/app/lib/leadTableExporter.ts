'use client';

// Lead Table Exporter - dedicated formatter for HTML tables with class="lead-table"

import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

/**
 * Convert image file to data URL for use in PDF
 */
export async function imageToDataUrl(imagePath: string): Promise<string> {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert image to data URL:', error);
    return '';
  }
}

/**
 * Get the default SalesCentri logo data URL
 */
export async function getDefaultLogoDataUrl(): Promise<string> {
  return await imageToDataUrl('/saleslogodark.png');
}

export type LeadTable = {
  headers: string[];
  rows: string[][];
};

export type LeadPdfOptions = {
  fileName?: string;
  title?: string;
  subtitle?: string;
  logoDataUrl?: string;
  margin?: { left: number; right: number; top: number; bottom: number };
};

/**
 * Parse the first HTML table with class "lead-table" into headers and rows
 */
export function parseLeadTable(html: string): LeadTable | null {
  try {
    if (!html || typeof html !== 'string') return null;
    const container = document.createElement('div');
    container.innerHTML = html;
    const table = container.querySelector('table.lead-table');
    if (!table) return null;

    // Headers
    let headers: string[] = [];
    const thead = table.querySelector('thead');
    if (thead) {
      const headerRow = thead.querySelector('tr');
      if (headerRow) {
        headers = Array.from(headerRow.querySelectorAll('th')).map((th) =>
          (th.textContent || '').replace(/\s+/g, ' ').trim()
        );
      }
    }
    if (headers.length === 0) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        headers = Array.from(firstRow.querySelectorAll('th,td')).map((c) =>
          (c.textContent || '').replace(/\s+/g, ' ').trim()
        );
      }
    }

    // Rows
    const bodyRows = Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
    const trList = bodyRows.length > 0 ? bodyRows : Array.from(table.querySelectorAll('tr')).slice(1);
    const rows: string[][] = trList
      .map((tr) =>
        Array.from(tr.querySelectorAll('td')).map((td) => (td.textContent || '').replace(/\s+/g, ' ').trim())
      )
      .filter((r) => r.length > 0);

    return { headers, rows };
  } catch (e) {
    console.error('parseLeadTable failed:', e);
    return null;
  }
}

/**
 * Export lead table HTML to Excel (XLSX) with branding
 */
export function exportLeadTableToExcel(html: string, fileName?: string): void {
  const parsed = parseLeadTable(html);
  if (!parsed) return;
  const { headers, rows } = parsed;

  // Create data array with branding at top
  const brandingRows = [
    ['🎯 Sales Centri'], // Row 1: Logo emoji + company name
    ['AI-Powered Sales Automation Platform'], // Row 2: Tagline
    ['Goals, ICP, and Leads on Autopilot'], // Row 3: Sub-tagline
    [''], // Row 4: Empty spacing
    headers, // Row 5: Headers
    ...rows // Row 6+: Data
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(brandingRows);

  // Style the branding rows
  // Row 1: Company name with logo emoji
  const companyCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
  ws[companyCell].s = { 
    font: { bold: true, sz: 20, color: { rgb: '0000FF' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  };

  // Row 2: Tagline
  const taglineCell = XLSX.utils.encode_cell({ r: 1, c: 0 });
  ws[taglineCell].s = { 
    font: { bold: true, sz: 16, color: { rgb: '666666' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  };

  // Row 3: Sub-tagline
  const subtaglineCell = XLSX.utils.encode_cell({ r: 2, c: 0 });
  ws[subtaglineCell].s = { 
    font: { bold: true, sz: 14, color: { rgb: '888888' } },
    alignment: { horizontal: 'center', vertical: 'center' }
  };

  // Style headers (row 5, index 4)
  headers.forEach((header, i) => {
    const cellRef = XLSX.utils.encode_cell({ r: 4, c: i });
    if (ws[cellRef]) {
      ws[cellRef].s = { 
        font: { bold: true, sz: 11 },
        fill: { fgColor: { rgb: 'E2ECF8' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }
  });

  // Style data rows (starting from row 6, index 5)
  rows.forEach((row, rowIndex) => {
    const dataRowIndex = 5 + rowIndex;
    row.forEach((cell, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: dataRowIndex, c: colIndex });
      if (ws[cellRef]) {
        ws[cellRef].s = { 
          font: { sz: 10 },
          alignment: { vertical: 'center' },
          fill: { fgColor: { rgb: rowIndex % 2 === 0 ? 'F8FAFF' : 'FFFFFF' } }
        };
      }
    });
  });

  // Set column widths
  const allData = [headers, ...rows];
  ws['!cols'] = (allData[0] || []).map((_v, i) => {
    const maxLen = Math.max(
      ...allData.map((row) => String(row[i] ?? '').length),
      10
    );
    return { wch: Math.min(Math.max(maxLen, 14), 42) };
  });

  // Merge cells for branding area (A1:E3)
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // A1:E1 for company name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // A2:E2 for tagline
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }  // A3:E3 for sub-tagline
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Prospects');
  const fname = fileName || `salescentri_prospects_${new Date().toISOString().slice(0, 19).replace(/[:]/g, '-')}.xlsx`;
  XLSX.writeFile(wb, fname);
}

/**
 * Export lead table HTML to branded PDF
 */
export async function exportLeadTableToPdf(html: string, options: LeadPdfOptions = {}): Promise<void> {
  const parsed = parseLeadTable(html);
  if (!parsed) return;
  const { headers, rows } = parsed;

  const margin = options.margin || { left: 12, right: 12, top: 15, bottom: 10 };
  // Portrait orientation to fit more content vertically
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const usableW = pageW - margin.left - margin.right;

  // Centered header with logo
  let y = margin.top;
  const logoDataUrl = options.logoDataUrl || await getDefaultLogoDataUrl();
  
  // Center the logo at the top
  if (logoDataUrl) {
    try {
      const logoWidth = 70; // 5x bigger logo (25 * 5)
      const logoHeight = 28; // 5x bigger logo (10 * 5)
      const logoX = (pageW - logoWidth) / 2; // center horizontally
      doc.addImage(logoDataUrl, 'PNG', logoX, y, logoWidth, logoHeight);
      y += logoHeight + 10; // more space after bigger logo
    } catch {}
  }
  
  // Center the title below the logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const title = options.title || 'Prospects Report';
  const titleWidth = doc.getTextWidth(title);
  const titleX = (pageW - titleWidth) / 2; // center horizontally
  doc.text(title, titleX, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  if (options.subtitle) {
    y += 5;
    const subtitleWidth = doc.getTextWidth(options.subtitle);
    const subtitleX = (pageW - subtitleWidth) / 2; // center subtitle too
    doc.text(options.subtitle, subtitleX, y);
  }
  y += 10; // more space before table

  // Compute column widths based on header + sample cells
  const colCount = Math.max(headers.length, ...rows.map((r) => r.length), 1);
  const maxCharPerCol: number[] = new Array(colCount).fill(0);
  const sampleRows = rows.slice(0, 25);
  for (let c = 0; c < colCount; c++) {
    maxCharPerCol[c] = Math.max(
      headers[c]?.length || 0,
      ...sampleRows.map((r) => (r[c] ? String(r[c]).length : 0))
    );
  }
  const totalChars = maxCharPerCol.reduce((a, b) => a + b, 0) || 1;
  const minW = 12; // smaller minimum width per column for portrait
  let colW: number[] = maxCharPerCol.map((len) => Math.max((len / totalChars) * usableW, minW));
  // Normalize to fit exactly within usable width
  const sumW = colW.reduce((a, b) => a + b, 0);
  colW = colW.map((w) => (w / sumW) * usableW);

  const cellPadX = 1.5; // reduced horizontal padding
  const cellPadY = 1.2; // reduced vertical padding
  const baseLineH = 4.5; // smaller line-height to fit more content

  const drawHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const headerHeight = 25; // Much larger header height for better visibility
    // Header band background
    doc.setFillColor(226, 235, 248);
    doc.rect(margin.left, y, usableW, headerHeight, 'F');
    let x = margin.left;
    for (let i = 0; i < colCount; i++) {
      const txt = String(headers[i] || '');
      const wrapped = doc.splitTextToSize(txt, colW[i] - 2 * cellPadX);
      // Draw header text - start from a visible position with proper padding
      // Position text to be vertically centered in the larger header cell
      let ty = y + 6; // Start at 6mm from top for better centering in 12mm header
      wrapped.forEach((line) => {
        doc.text(String(line || ''), x + cellPadX, ty);
        ty += 4; // spacing between lines
      });
      // Column divider lines
      doc.setDrawColor(200, 200, 200);
      doc.line(x, y, x, y + headerHeight);
      x += colW[i];
    }
    // Right edge
    doc.line(margin.left + usableW, y, margin.left + usableW, y + headerHeight);
    // Bottom line
    doc.line(margin.left, y + headerHeight, margin.left + usableW, y + headerHeight);
    y += headerHeight;
  };

  // Draw header initially
  drawHeader();

  // Draw body rows with zebra stripes, compact layout for single page
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  rows.forEach((r, rowIdx) => {
    // Normalize row cells length
    const row = new Array(colCount).fill('').map((_, i) => String(r[i] ?? ''));
    // Compute max lines across columns for this row
    const linesPerCol = row.map((cell, i) => doc.splitTextToSize(cell, colW[i] - 2 * cellPadX));
    const maxLines = Math.max(...linesPerCol.map((arr) => arr.length || 1));
    const rowH = Math.max(baseLineH + 2, maxLines * baseLineH + 2); // reduced vertical padding

    // Background zebra
    if (rowIdx % 2 === 0) {
      doc.setFillColor(248, 250, 255);
      doc.rect(margin.left, y, usableW, rowH, 'F');
    }

    // Cell borders and text
    let x = margin.left;
    for (let i = 0; i < colCount; i++) {
      // Borders
      doc.setDrawColor(210, 210, 210);
      doc.rect(x, y, colW[i], rowH);
      // Text
      const lines = linesPerCol[i];
      let ty = y + cellPadY + baseLineH - 0.5; // baseline for first line with top padding
      lines.forEach((ln) => {
        doc.text(String(ln || ''), x + cellPadX, ty);
        ty += baseLineH;
      });
      x += colW[i];
    }
    y += rowH;
  });

  doc.save(options.fileName || 'salescentri_prospects.pdf');
}


