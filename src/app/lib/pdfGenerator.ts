import jsPDF from 'jspdf';

interface BenchmarkData {
  category: string;
  industry: string;
  metrics: {
    name: string;
    average: string;
    top10: string;
    salesCentri: string;
    improvement: string;
  }[];
}

interface CompanyBenchmark {
  size: string;
  industry: string;
  metrics: {
    emailOpen: string;
    responseRate: string;
    leadConversion: string;
    salesCycle: string;
    monthlyRevenue: string;
  };
  improvement: {
    emailOpen: string;
    responseRate: string;
    leadConversion: string;
    salesCycle: string;
    monthlyRevenue: string;
  };
}

export class SalesCentriPDFGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageHeight: number = 280;
  private margin: number = 20;
  private logoDataUrl: string | null = null;

  constructor() {
    this.doc = new jsPDF();
    this.setupDocument();
  }

  private setupDocument() {
    // Set up the document with proper margins and font
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    
    // Add Sales Centri branding
    this.addHeader();
  }

  private addHeader() {
    // Add Sales Centri logo if available
    if (this.logoDataUrl) {
      try {
        const logoWidth = 40;
        const logoHeight = 15;
        this.doc.addImage(this.logoDataUrl, 'PNG', this.margin, this.currentY, logoWidth, logoHeight);
        
        // Add company name next to logo
        this.doc.setTextColor(59, 130, 246);
        this.doc.setFontSize(18);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Sales Centri', this.margin + logoWidth + 8, this.currentY + 10);
        
        this.currentY += 20;
      } catch (error) {
        console.warn('Could not add logo to PDF:', error);
        this.addTextHeader();
      }
    } else {
      this.addTextHeader();
    }
    
    // Title
    this.doc.setFontSize(22);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(45, 55, 72); // Dark gray for better readability
    this.doc.text('Sales Automation Performance Benchmarks', this.margin, this.currentY);
    this.currentY += 12;
    
    // Subtitle
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(74, 85, 104); // Medium gray
    this.doc.text('Industry Benchmark Data & Performance Analysis', this.margin, this.currentY);
    this.currentY += 15;
    
    // Date
    this.doc.setFontSize(10);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, this.margin, this.currentY);
    this.currentY += 20;
  }

  private addTextHeader() {
    // Fallback text-only header
    this.doc.setFillColor(59, 130, 246); // Blue color
    this.doc.rect(this.margin, this.currentY, 170, 18, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Sales Centri', this.margin + 8, this.currentY + 12);
    
    this.currentY += 25;
  }

  private addNewPageIfNeeded(requiredSpace: number = 20) {
    if (this.currentY + requiredSpace > this.pageHeight) {
      this.doc.addPage();
      this.currentY = 20;
      // Add header to new page if logo is available
      if (this.logoDataUrl) {
        this.addHeaderToNewPage();
      }
    }
  }

  private addHeaderToNewPage() {
    // Add logo to new page
    try {
      const logoWidth = 40;
      const logoHeight = 15;
      this.doc.addImage(this.logoDataUrl!, 'PNG', this.margin, this.currentY, logoWidth, logoHeight);
      
      // Add company name next to logo
      this.doc.setTextColor(59, 130, 246);
      this.doc.setFontSize(18);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Sales Centri', this.margin + logoWidth + 8, this.currentY + 10);
      
      this.currentY += 20;
    } catch (error) {
      console.warn('Could not add logo to new page:', error);
    }
  }

  private addSectionTitle(title: string) {
    this.addNewPageIfNeeded(15);
    
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(59, 130, 246); // Blue color
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 8;
    
    // Add underline
    this.doc.setDrawColor(59, 130, 246);
    this.doc.line(this.margin, this.currentY, this.margin + 100, this.currentY);
    this.currentY += 10;
  }

  private addTable(data: BenchmarkData) {
    this.addNewPageIfNeeded(30);
    
    // Category title
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(data.category, this.margin, this.currentY);
    this.currentY += 8;
    
    // Table headers
    const headers = ['Metric', 'Industry Average', 'Top 10%', 'Sales Centri Users', 'Improvement'];
    const colWidths = [40, 35, 35, 35, 25];
    let xPos = this.margin;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    
    // Draw table border and headers
    this.doc.setDrawColor(222, 226, 230); // Light gray border
    this.doc.setLineWidth(0.5);
    
    headers.forEach((header, index) => {
      // Set light gray background for each header cell individually
      this.doc.setFillColor(248, 249, 250); // Light gray background
      this.doc.rect(xPos, this.currentY, colWidths[index], 8, 'FD'); // Fill and draw
      this.doc.setTextColor(0, 0, 0); // Black text on light background
      this.doc.text(header, xPos + 2, this.currentY + 5);
      xPos += colWidths[index];
    });
    
    this.currentY += 8;
    
    // Table data
    this.doc.setFont('helvetica', 'normal');
    data.metrics.forEach((metric) => {
      this.addNewPageIfNeeded(8);
      xPos = this.margin;
      
      const rowData = [metric.name, metric.average, metric.top10, metric.salesCentri, metric.improvement];
      
      rowData.forEach((cell, index) => {
        // Set white background for each cell individually
        this.doc.setFillColor(255, 255, 255); // White background
        this.doc.rect(xPos, this.currentY, colWidths[index], 8, 'FD'); // Fill and draw
        this.doc.setTextColor(0, 0, 0); // Black text
        this.doc.text(cell, xPos + 2, this.currentY + 5);
        xPos += colWidths[index];
      });
      
      this.currentY += 8;
    });
    
    this.currentY += 10;
  }

  private addCompanySizeBenchmark(company: CompanyBenchmark) {
    this.addNewPageIfNeeded(25);
    
    // Company size header
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(45, 55, 72); // Dark gray
    this.doc.text(`${company.size} - ${company.industry}`, this.margin, this.currentY);
    this.currentY += 6;
    
    // Improvement badge
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(this.margin, this.currentY, 60, 6, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.text('Average +65% Improvement', this.margin + 2, this.currentY + 4);
    this.currentY += 10;
    
    this.doc.setTextColor(0, 0, 0);
    
    // Metrics grid
    const metrics = [
      { label: 'Email Open Rate', value: company.metrics.emailOpen, improvement: company.improvement.emailOpen },
      { label: 'Response Rate', value: company.metrics.responseRate, improvement: company.improvement.responseRate },
      { label: 'Lead Conversion', value: company.metrics.leadConversion, improvement: company.improvement.leadConversion },
      { label: 'Sales Cycle', value: company.metrics.salesCycle, improvement: company.improvement.salesCycle },
      { label: 'Revenue/Rep', value: company.metrics.monthlyRevenue, improvement: company.improvement.monthlyRevenue }
    ];
    
    const boxWidth = 32;
    const boxHeight = 22;
    const spacing = 4;
    let xPos = this.margin;
    let yPos = this.currentY;
    
    metrics.forEach((metric, index) => {
      if (index > 0 && index % 3 === 0) {
        xPos = this.margin;
        yPos += boxHeight + spacing;
        this.addNewPageIfNeeded(boxHeight + spacing);
      }
      
      // Draw metric box with better styling
      this.doc.setFillColor(248, 250, 252); // Light gray background
      this.doc.setDrawColor(222, 226, 230); // Light gray border
      this.doc.setLineWidth(0.5);
      this.doc.rect(xPos, yPos, boxWidth, boxHeight, 'FD');
      
      // Add metric data
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(45, 55, 72);
      this.doc.text(metric.value, xPos + 3, yPos + 8);
      
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(74, 85, 104);
      this.doc.text(metric.label, xPos + 3, yPos + 12);
      
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(59, 130, 246);
      this.doc.text(metric.improvement, xPos + 3, yPos + 16);
      
      this.doc.setTextColor(0, 0, 0);
      xPos += boxWidth + spacing;
    });
    
    this.currentY = yPos + boxHeight + 15;
  }

  private addKeyInsights() {
    this.addNewPageIfNeeded(30);
    
    this.addSectionTitle('Key Performance Insights');
    
    const insights = [
      { metric: '67%', label: 'Average Improvement', description: 'across all automation metrics when using Sales Centri' },
      { metric: '90 days', label: 'Time to Results', description: 'typical timeframe to see significant performance improvements' },
      { metric: '3.2x', label: 'ROI Multiplier', description: 'average return on investment from automation implementation' }
    ];
    
    insights.forEach((insight) => {
      this.addNewPageIfNeeded(15);
      
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(59, 130, 246);
      this.doc.text(insight.metric, this.margin, this.currentY);
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(insight.label, this.margin + 30, this.currentY);
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(insight.description, this.margin + 30, this.currentY + 5);
      
      this.currentY += 15;
    });
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Footer line
      this.doc.setDrawColor(222, 226, 230);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, 280, 190, 280);
      
      // Footer text
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('Sales Centri - Sales Automation Performance Benchmarks', this.margin, 285);
      this.doc.text(`Page ${i} of ${pageCount}`, 160, 285);
      
      // Add Sales Centri branding in footer
      this.doc.setFontSize(7);
      this.doc.setTextColor(59, 130, 246);
      this.doc.text('salescentri.com', 190 - this.doc.getTextWidth('salescentri.com'), 285);
    }
  }

  private async loadLogo(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              this.logoDataUrl = canvas.toDataURL('image/png');
            }
          } catch (error) {
            console.warn('Could not convert logo to data URL:', error);
          }
          resolve();
        };
        img.onerror = () => {
          console.warn('Could not load logo image');
          resolve();
        };
        img.src = '/saleslogo.png';
      } catch (error) {
        console.warn('Error loading logo:', error);
        resolve();
      }
    });
  }

  public async generateBenchmarkReport(
    benchmarkData: BenchmarkData[],
    companyBenchmarks: CompanyBenchmark[]
  ): Promise<void> {
    // Load logo first
    await this.loadLogo();
    
    // Add introduction
    this.addSectionTitle('Industry Benchmark Data');
    this.addNewPageIfNeeded(20);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Compare your performance with industry averages, top 10% performers, and Sales Centri users.', this.margin, this.currentY);
    this.currentY += 15;
    
    // Add benchmark tables
    benchmarkData.forEach((data) => {
      this.addTable(data);
    });
    
    // Add company size benchmarks
    this.addSectionTitle('Performance by Company Size');
    this.addNewPageIfNeeded(10);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('See how automation performance varies by company size and industry', this.margin, this.currentY);
    this.currentY += 15;
    
    companyBenchmarks.forEach((company) => {
      this.addCompanySizeBenchmark(company);
    });
    
    // Add key insights
    this.addKeyInsights();
    
    // Add footer
    this.addFooter();
  }

  public download(filename: string = 'Sales_Centri_benchmarks.pdf'): void {
    this.doc.save(filename);
  }
}

export async function generateBenchmarkPDF(
  benchmarkData: BenchmarkData[],
  companyBenchmarks: CompanyBenchmark[]
): Promise<void> {
  const generator = new SalesCentriPDFGenerator();
  await generator.generateBenchmarkReport(benchmarkData, companyBenchmarks);
  generator.download();
}
