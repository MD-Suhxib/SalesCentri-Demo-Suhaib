"use server";

/**
 * Utility to analyze a website URL and extract company information
 * that can be used to enhance research queries.
 */

type WebsiteAnalysisResult = {
  domain: string;
  companyName?: string;
  keywords?: string[];
  description?: string;
  error?: string;
};

/**
 * Analyzes a website URL to extract company information
 * 
 * @param url The website URL to analyze
 * @returns Website analysis results
 */
export async function analyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
  if (!url) {
    return { domain: '', error: 'No URL provided' };
  }
  
  try {
    // Extract domain from URL
    const domain = new URL(url).hostname;
    
    try {
      // Fetch website content
      const response = await fetch(url, { 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        return { 
          domain,
          error: `Failed to fetch website: ${response.status} ${response.statusText}` 
        };
      }
      
      const html = await response.text();
      
      // Extract meta information
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["'][^>]*>/i) || 
                        html.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["'][^>]*>/i);
      const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["'](.*?)["'][^>]*>/i) || 
                            html.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']keywords["'][^>]*>/i);
      
      // Try to extract company name from title
      let companyName = '';
      if (titleMatch && titleMatch[1]) {
        // Clean up title and use as company name
        companyName = titleMatch[1].split('|')[0].split('-')[0].trim();
      }
      
      // Extract keywords if available
      const keywords = keywordsMatch && keywordsMatch[1] ? 
        keywordsMatch[1].split(',').map(k => k.trim()) : [];
      
      // Extract description if available
      const description = descMatch && descMatch[1] ? descMatch[1] : '';
      
      return {
        domain,
        companyName,
        keywords,
        description
      };
      
    } catch (error) {
      console.error('Error fetching website:', error);
      return { 
        domain,
        error: `Error analyzing website: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  } catch (error) {
    console.error('Invalid URL:', error);
    return { 
      domain: '',
      error: 'Invalid URL format' 
    };
  }
}

/**
 * Enhances a research prompt with website analysis data
 * 
 * @param prompt The original research prompt
 * @param websiteData The website analysis results
 * @returns Enhanced research prompt
 */
export function enhancePromptWithWebsiteData(prompt: string, websiteData: WebsiteAnalysisResult): string {
  if (websiteData.error) {
    return prompt;
  }
  
  let enhancedPrompt = prompt;
  
  // Add company context to the prompt
  if (websiteData.companyName) {
    enhancedPrompt += `\n\nCompany name: ${websiteData.companyName}`;
  }
  
  if (websiteData.domain) {
    enhancedPrompt += `\nWebsite domain: ${websiteData.domain}`;
  }
  
  if (websiteData.description) {
    enhancedPrompt += `\nCompany description: ${websiteData.description}`;
  }
  
  if (websiteData.keywords && websiteData.keywords.length > 0) {
    enhancedPrompt += `\nKeywords: ${websiteData.keywords.join(', ')}`;
  }
  
  enhancedPrompt += `\n\nPlease provide detailed information about this company, including:\n
1. Company background and history
2. Founder information and key executives
3. Main products/services and their unique selling points
4. Market position and competitive landscape
5. Recent news or developments
6. Potential sales opportunities and best approaches for selling to this company
7. Any challenges or pain points the company might be facing that could be addressed with new solutions`;

  return enhancedPrompt;
}
