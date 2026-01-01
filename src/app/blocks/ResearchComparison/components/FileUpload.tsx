// File upload component for ResearchComparison

import React from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

// Dynamic import for PDF.js to avoid SSR issues
let pdfjsLib: typeof import('pdfjs-dist') | null = null;

// Initialize PDF.js only on client side
if (typeof window !== 'undefined') {
  import('pdfjs-dist').then((pdf) => {
    pdfjsLib = pdf;
    if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
  }).catch((error) => {
    console.warn('Failed to load PDF.js:', error);
  });
}

interface FileUploadProps {
  uploadedFile: File | null;
  displayedFileName: string | null;
  excelData: string[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSetWebsiteUrl2: (url: string) => void;
  onSetExcelData: (data: string[]) => void;
  onSetError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  uploadedFile,
  displayedFileName,
  excelData,
  onFileUpload,
  onSetWebsiteUrl2,
  onSetExcelData,
  onSetError
}) => {
  // Handler for file upload (Excel, CSV, and PDF)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (typeof window === 'undefined') return;
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          let websites: string[] = [];

          if (file.name.toLowerCase().endsWith('.csv')) {
            // Parse CSV file
            const csvText = result as string;
            const lines = csvText.split('\n');
            
            websites = lines
              .slice(1) // Skip header row
              .map(line => {
                // Handle CSV with quotes and commas
                const columns = line.split(',').map(col => col.trim().replace(/^["']|["']$/g, ''));
                const website = columns[0];
                const companyName = columns[1] || '';
                
                // Return both website and company name if available
                if (website && (website.includes('.') || website.startsWith('http'))) {
                  return companyName ? `${website} (${companyName})` : website;
                }
                return null;
              })
              .filter(Boolean); // Load ALL companies, no limit
              
            console.log(`📊 Loaded ${websites.length} companies from CSV file`);
            
            // If we found websites, use the first one as website_url_2
            if (websites.length > 0) {
              const firstWebsite = websites[0].split(' (')[0]; // Extract just the URL part
              onSetWebsiteUrl2(firstWebsite);
            }
          } else if (file.name.toLowerCase().endsWith('.pdf')) {
            // Parse PDF file
            try {
              if (!pdfjsLib) {
                // Dynamically import PDF.js if not already loaded
                const pdfModule = await import('pdfjs-dist');
                pdfjsLib = pdfModule;
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
              }
              
              const arrayBuffer = result as ArrayBuffer;
              const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
              let fullText = '';
              
              // Extract text from all pages
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                  .map((item) => ('str' in item ? (item as { str: string }).str : ''))
                  .join(' ');
                fullText += pageText + ' ';
              }
              
              // Extract URLs from the text using regex
              const urlRegex = /https?:\/\/[^\s]+/g;
              const extractedUrls = fullText.match(urlRegex) || [];
              
              websites = extractedUrls
                .filter((url: string) => {
                  // Clean up URLs and validate
                  const cleanUrl = url.replace(/[^\w:\/\.\-]/g, ''); // Remove non-URL characters
                  return cleanUrl.length > 10 && (cleanUrl.includes('.com') || cleanUrl.includes('.org') || cleanUrl.includes('.net') || cleanUrl.includes('.io'));
                }); // Load ALL websites, no limit
                
              console.log(`📊 Loaded ${websites.length} websites from PDF file`);
              
              // If we found websites, use the first one as website_url_2
              if (websites.length > 0) {
                onSetWebsiteUrl2(websites[0]);
              }
            } catch (pdfError) {
              console.error('Error parsing PDF:', pdfError);
              onSetError('Failed to parse PDF file. Please ensure it contains valid website URLs.');
              return;
            }
          } else {
            // Parse Excel file
            if (typeof window === 'undefined') return;
            
            const data = new Uint8Array(result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get first worksheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // Extract company data from the file (websites and company names)
            const companyData = jsonData
              .slice(1) // Skip header row
              .map((row: unknown[]) => {
                // Handle multiple columns - website, company name, etc.
                const website = (row[0] as string)?.toString().trim();
                const companyName = (row[1] as string)?.toString().trim() || '';
                
                // Return both website and company name if available
                if (website && (website.includes('.') || website.startsWith('http'))) {
                  return companyName ? `${website} (${companyName})` : website;
                }
                return null;
              })
              .filter(Boolean); // Load ALL companies, no limit
            
            websites = companyData;
            console.log(`📊 Loaded ${websites.length} companies from Excel file`);
            
            // If we found websites, use the first one as website_url_2
            if (websites.length > 0) {
              const firstWebsite = websites[0].split(' (')[0]; // Extract just the URL part
              onSetWebsiteUrl2(firstWebsite);
            }
          }
          
          onSetExcelData(websites);
          console.log('Parsed file data:', websites);
        } catch (error) {
          console.error('Error parsing file:', error);
          onSetError('Failed to parse file. Please ensure it contains website URLs.');
        }
      };
      
      // Read file based on type
      if (file.name.toLowerCase().endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
  };

  return (
    <div className="p-3 rounded-lg border transition-all duration-200 hover:border-opacity-80"
         style={{
           background: 'var(--research-surface)',
           borderColor: 'var(--research-border)'
         }}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold mb-1"
            style={{ color: 'var(--research-text)' }}>
          Bulk Upload (Optional)
        </h3>
        <p className="text-xs"
           style={{ color: 'var(--research-text-muted)' }}>
          Upload Excel, CSV, or PDF files with multiple websites for batch processing.
        </p>
      </div>
      
      <div className="space-y-2">
        <label className="block text-xs font-medium"
               style={{ color: 'var(--research-text)' }}>
          File Upload (.xlsx, .xls, .csv, .pdf)
        </label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv,.pdf"
          title="Upload Excel, CSV, or PDF file with client websites"
          onChange={handleFileUpload}
          className="w-full px-3 py-2 rounded-lg border transition-all duration-200 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:font-medium cursor-pointer"
          style={{
            background: 'var(--research-surface)',
            borderColor: 'var(--research-border)',
            color: 'var(--research-text)',
            height: '36px',
            minHeight: '36px',
            fontSize: 'clamp(13px, 2.2vw, 15px)',
            lineHeight: '1.4'
          }}
        />
        {(uploadedFile || displayedFileName) && (
          <div className="flex items-center gap-2 p-2 rounded-lg border"
               style={{
                 background: 'var(--research-muted)',
                 borderColor: 'var(--research-border)'
               }}>
            <span className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: 'var(--research-text)' }}>
              {(uploadedFile?.name || displayedFileName)?.toLowerCase().endsWith('.csv') ?
                <FileText size={14} style={{ color: 'var(--research-primary)' }} /> :
                (uploadedFile?.name || displayedFileName)?.toLowerCase().endsWith('.pdf') ?
                <FileText size={14} style={{ color: 'var(--research-primary)' }} /> :
                <FileSpreadsheet size={14} style={{ color: 'var(--research-primary)' }} />
              }
              {uploadedFile?.name || displayedFileName}
            </span>
            {uploadedFile && (
              <span className="text-xs"
                    style={{ color: 'var(--research-text-muted)' }}>
                ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </span>
            )}
            {excelData.length > 0 && (
              <span className="text-xs font-medium"
                    style={{ color: 'var(--research-success)' }}>
                • {excelData.length} websites found
              </span>
            )}
          </div>
        )}
        
        <div className="mt-2">
          <p className="text-xs"
             style={{ color: 'var(--research-text-muted)' }}>
            <strong>Format:</strong> First column should contain website URLs.
          </p>
        </div>
      </div>
    </div>
  );
};
