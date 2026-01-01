// Mock response generators for fallback scenarios

import { ResearchCategory } from './types';

export function generateCategorySpecificMockResponse(
  query: string, 
  category: ResearchCategory, 
  provider: string, 
  errorMessage: string
): string {
  const categoryName = category.replace(/_/g, " ");
  
  switch(category) {
    case 'market_analysis':
      return `# Market Analysis: ${query}

## Executive Summary
This is a mock market analysis for ${query}. In production, this would provide real market size data, growth rates, and competitive landscape analysis.

## Market Opportunities

| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |
|--------------|---------|----------|--------------|--------------|----------|-----------|---------|----------|-------------------|-------------|-------------|-------------------|
| Market Leader 1 | https://example1.com | Technology | Software | CRM Solutions | Customer Management | 1000+ | $100M+ | USA | John S***** | CEO | Market expansion | Enterprise focus |
| Market Leader 2 | https://example2.com | Manufacturing | Industrial | Automation Tools | Process Optimization | 500-1000 | $50M-100M | USA | Sarah M***** | VP Sales | Operational efficiency | Mid-market approach |

## Market Overview
- **Market Size**: Would provide actual TAM, SAM, SOM data
- **Growth Rate**: Would include CAGR and market drivers
- **Key Players**: Would list actual competitors and market leaders
- **Market Segments**: Would detail specific customer segments

## Key Trends
- Trend 1: Detailed analysis would be provided by ${provider}
- Trend 2: Real-time market intelligence would be included
- Trend 3: Consumer behavior insights would be analyzed

## Opportunities & Recommendations
- Strategic recommendations would be provided based on real data
- Market entry strategies would be detailed
- Competitive positioning advice would be included

## Error Details
${errorMessage}

**Note**: This is a development fallback. Real ${provider} analysis would provide comprehensive market intelligence.`;

    case 'competitive_intelligence':
      return `# Competitive Intelligence: ${query}

## Executive Summary
This is a mock competitive analysis for ${query}. In production, this would provide detailed competitor profiles and strategic analysis.

## Competitive Landscape

| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |
|--------------|---------|----------|--------------|--------------|----------|-----------|---------|----------|-------------------|-------------|-------------|-------------------|
| Competitor 1 | https://competitor1.com | Technology | Software | CRM Solutions | Customer Management | 1000+ | $100M+ | USA | John S***** | CEO | Market competition | Direct competition |
| Competitor 2 | https://competitor2.com | Manufacturing | Industrial | Automation Tools | Process Optimization | 500-1000 | $50M-100M | USA | Sarah M***** | VP Sales | Market share | Indirect competition |

## Competitor Landscape
- **Direct Competitors**: Would list actual companies with detailed profiles
- **Indirect Competitors**: Would identify alternative solutions and substitutes
- **Market Position**: Would analyze competitive strengths and weaknesses

## Competitive Analysis
- **SWOT Analysis**: Detailed strengths, weaknesses, opportunities, threats
- **Pricing Strategy**: Competitor pricing models and positioning
- **Product Comparison**: Feature-by-feature competitive analysis

## Strategic Insights
- **Market Gaps**: Opportunities for differentiation
- **Competitive Threats**: Emerging challenges and disruptions

## Error Details
${errorMessage}

**Note**: This is a development fallback. Real ${provider} analysis would provide comprehensive competitive intelligence.`;

    case 'technology_trends':
      return `# Technology Trends: ${query}

## Executive Summary
This is a mock technology trends analysis for ${query}. In production, this would provide real-time insights into emerging technologies and adoption patterns.

## Current Technology Landscape
- **Emerging Technologies**: Would detail cutting-edge innovations
- **Adoption Rates**: Would provide actual adoption statistics and curves
- **Key Players**: Would identify technology leaders and disruptors

## Trend Analysis
- **Short-term Trends** (1-2 years): Immediate technology developments
- **Medium-term Trends** (3-5 years): Technology maturation cycles
- **Long-term Trends** (5+ years): Transformational technology shifts

## Impact Assessment
- **Business Impact**: How technologies will affect business models
- **Market Disruption**: Potential for industry transformation
- **Investment Implications**: Technology investment opportunities

## Error Details
${errorMessage}

**Note**: This is a development fallback. Real ${provider} analysis would provide comprehensive technology intelligence.`;

    case 'industry_insights':
      return `# Industry Insights: ${query}

## Executive Summary
This is a mock industry analysis for ${query}. In production, this would provide comprehensive industry intelligence and insights.

## Industry Opportunities

| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |
|--------------|---------|----------|--------------|--------------|----------|-----------|---------|----------|-------------------|-------------|-------------|-------------------|
| Industry Leader 1 | https://industry1.com | Technology | Software | Industry Solutions | Digital Transformation | 1000+ | $100M+ | USA | John S***** | CEO | Industry disruption | Market leadership |
| Industry Leader 2 | https://industry2.com | Manufacturing | Industrial | Automation Tools | Process Optimization | 500-1000 | $50M-100M | USA | Sarah M***** | VP Sales | Operational efficiency | Industry focus |

## Industry Overview
- **Industry Size & Growth**: Would provide actual market metrics
- **Key Players**: Would identify industry leaders and influencers
- **Value Chain**: Would map industry structure and relationships

## Industry Dynamics
- **Supply Chain Analysis**: Key suppliers, distributors, and partners
- **Regulatory Environment**: Compliance requirements and policy impacts
- **Economic Factors**: Market drivers and economic influences

## Strategic Insights
- **Growth Opportunities**: Emerging sectors and expansion areas
- **Industry Challenges**: Key obstacles and risk factors
- **Future Outlook**: Industry evolution and predictions

## Error Details
${errorMessage}

**Note**: This is a development fallback. Real ${provider} analysis would provide comprehensive industry intelligence.`;

    case 'general_research':
      return `# General Research: ${query}

## Executive Summary
This is a comprehensive general research analysis for ${query}. In production, this would provide detailed, verified information across multiple domains with website validation.

## Research Opportunities

| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |
|--------------|---------|----------|--------------|--------------|----------|-----------|---------|----------|-------------------|-------------|-------------|-------------------|
| Research Target 1 | https://research1.com | Technology | Software | Research Tools | Data Analysis | 100-500 | $10M-50M | USA | John S***** | Research Director | Data challenges | Research focus |
| Research Target 2 | https://research2.com | Manufacturing | Industrial | Research Equipment | Process Analysis | 500-1000 | $50M-100M | USA | Sarah M***** | VP Research | Innovation gaps | Industry research |

## Research Overview
- **Topic Analysis**: Comprehensive examination of the research query
- **Multi-domain Insights**: Cross-disciplinary analysis and findings
- **Verified Sources**: All information sourced from accessible, legitimate websites
- **Data Validation**: Website verification ensures no fake or placeholder data

## Key Findings
- Finding 1: Detailed analysis with verified sources by ${provider}
- Finding 2: Cross-referenced information from multiple legitimate websites
- Finding 3: Actionable insights based on real, accessible data

## Analysis
Comprehensive research analysis of ${query} would be provided here, including:
- Verified research findings from legitimate sources
- Cross-domain insights and connections
- Data-driven conclusions with source validation
- Strategic implications based on real information

## Source Verification
- All websites mentioned are verified as accessible and legitimate
- No placeholder or fake data included in the analysis
- Information sourced from established, authoritative domains
- Cross-referenced data for accuracy and reliability

## Recommendations
Specific, actionable recommendations would be provided based on verified research and analysis.

## Error Details
${errorMessage}

**Note**: This is a development fallback. Real ${provider} analysis would provide comprehensive, website-verified research results.`;

    default:
      return `# ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}: ${query}

## Executive Summary
This is a mock ${categoryName} analysis for ${query}. In production, this would provide comprehensive research and insights specific to your query.

## Key Findings
- Finding 1: Detailed analysis would be provided by ${provider}
- Finding 2: Real data and insights would be included
- Finding 3: Actionable recommendations would be generated

## Analysis
Comprehensive analysis of ${query} would be provided here, including:
- Detailed research findings
- Data-driven insights
- Strategic implications
- Actionable recommendations

## Recommendations
Specific, actionable recommendations would be provided based on real research and analysis.

## Error Details
${errorMessage}

**Note**: This is a development fallback. Real ${provider} analysis would provide comprehensive research results.`;
  }
}

