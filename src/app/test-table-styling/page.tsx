'use client';

import React from 'react';
import MarkdownRenderer from '../blocks/ResearchComparison/MarkdownRenderer';

const TestTableStyling: React.FC = () => {
  const testMarkdown = `
# Table Styling Test

This page tests the improved table styling to ensure words don't break awkwardly.

## Test Table 1: Company Information

| Company Name | Industry | Website | Decision Maker | Role | Contact Information |
|--------------|----------|---------|----------------|------|-------------------|
| Acme Manufacturing Corporation | Manufacturing & Industrial Equipment | https://www.acmemanufacturing.com | John Smith | CEO | john.smith@acmemanufacturing.com |
| TechStart Solutions LLC | Software Development & Technology Services | https://www.techstartsolutions.com | Sarah Johnson | Chief Technology Officer | sarah.johnson@techstartsolutions.com |
| Global Business Enterprises Inc. | International Trade & Commerce | https://www.globalbusinessenterprises.com | Michael Rodriguez | Vice President of Sales | michael.rodriguez@globalbusinessenterprises.com |
| Innovation Labs | Research & Development | https://www.innovationlabs.com | Dr. Emily Chen | Director of Research | emily.chen@innovationlabs.com |

## Test Table 2: Sales Opportunities

| Company | Website | Industry | Decision Maker | Role | Opportunity Fit | Score | Next Step | Status | Priority | Est. Value | Follow Up | Source | Notes |
|---------|---------|----------|----------------|------|-----------------|-------|-----------|--------|----------|------------|-----------|--------|-------|
| Advanced Manufacturing Systems | https://www.advancedmanufacturingsystems.com | Manufacturing | Robert Thompson | Chief Executive Officer | High - Expanding operations | 9 | Schedule demo | Qualified | High | $500K | 2024-02-15 | LinkedIn | Very interested in our solution |
| Digital Transformation Partners | https://www.digitaltransformationpartners.com | Technology | Lisa Wang | Chief Technology Officer | Medium - Evaluating options | 7 | Send case study | Nurturing | Medium | $250K | 2024-02-20 | Website | Requested more information |
| Global Supply Chain Solutions | https://www.globalsupplychainsolutions.com | Logistics | David Martinez | Vice President of Operations | High - Urgent need | 8 | Proposal meeting | Proposal | High | $750K | 2024-02-10 | Referral | Recommended by existing client |

## Test Table 3: Long Text Content

| Description | Technical Specifications | Implementation Details | Expected Outcomes |
|-------------|-------------------------|----------------------|------------------|
| Comprehensive enterprise software solution designed to streamline business operations and improve efficiency across all departments | Advanced cloud-based architecture with microservices, real-time data synchronization, machine learning capabilities, and comprehensive API integration | Phased implementation approach with pilot program, user training, data migration, and ongoing support and maintenance | Significant reduction in operational costs, improved data accuracy, enhanced user productivity, and scalable growth platform |

## Test Table 4: Mixed Content Types

| Company | URL | Email | Phone | Description | Tags |
|---------|-----|-------|-------|-------------|------|
| Example Corp | https://www.example-corporation.com/very-long-url-path | contact@example-corporation.com | +1-555-123-4567 | A leading provider of innovative solutions for modern businesses | #technology #innovation #growth |
| Test Industries | https://www.testindustries.com | info@testindustries.com | +1-555-987-6543 | Specializing in manufacturing and distribution services | #manufacturing #distribution #B2B |
| Demo Enterprises | https://www.demoenterprises.com | hello@demoenterprises.com | +1-555-456-7890 | Cutting-edge technology solutions for enterprise clients | #enterprise #technology #solutions |

## Test Table 5: Very Long Words

| Company | Very Long Industry Category | Decision Maker Full Name | Very Long Job Title | Contact |
|---------|---------------------------|-------------------------|-------------------|---------|
| Supercalifragilisticexpialidocious Corporation | Manufacturing and Industrial Equipment and Machinery | Christopher Alexander Thompson-Rodriguez | Senior Vice President of Strategic Business Development and International Operations | c.thompson-rodriguez@supercalifragilisticexpialidocious.com |
| Pneumonoultramicroscopicsilicovolcanoconiosis Industries | Medical and Scientific Research Equipment | Dr. Elizabeth Margaret Fitzwilliam-Darcy | Chief Scientific Officer and Director of Advanced Research and Development | e.fitzwilliam-darcy@pneumonoultramicroscopicsilicovolcanoconiosis.com |

This test should show:
1. ✅ Words stay intact (no "Manufac-turing" breaks)
2. ✅ Text wraps naturally to next line
3. ✅ Table remains responsive
4. ✅ Columns adjust gracefully without overflowing
`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Table Styling Test</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <MarkdownRenderer markdown={testMarkdown} />
        </div>
      </div>
    </div>
  );
};

export default TestTableStyling;
