// Website verification utilities

export async function verifyWebsite(url: string): Promise<{isValid: boolean, status: number, error?: string}> {
  try {
    // Basic URL validation
    if (!url || !url.startsWith('http')) {
      return { isValid: false, status: 0, error: 'Invalid URL format' };
    }

    // Check for known invalid domains and patterns
    const invalidPatterns = [
      'godaddy.com',
      'example.com',
      'test.com',
      'placeholder.com',
      'domain.com',
      'website.com',
      'company.com',
      'business.com',
      'firm.com',
      'corp.com',
      'inc.com',
      'llc.com',
      'ltd.com',
      'co.com',
      'net.com',
      'org.com'
    ];

    const domain = new URL(url).hostname.toLowerCase();
    const isInvalidDomain = invalidPatterns.some(pattern => 
      domain.includes(pattern) || domain.endsWith('.' + pattern)
    );

    if (isInvalidDomain) {
      return { isValid: false, status: 0, error: 'Invalid domain pattern detected' };
    }

    // Check if URL is accessible
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    clearTimeout(timeoutId);

    // Additional check for GoDaddy parked pages and similar
    if (response.ok) {
      // Try to get a small portion of the page to check for parked domain indicators
      try {
        const contentResponse = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (contentResponse.ok) {
          const content = await contentResponse.text();
          const parkedDomainIndicators = [
            'godaddy',
            'parked domain',
            'domain for sale',
            'this domain is for sale',
            'domain parking',
            'coming soon',
            'under construction',
            'placeholder page'
          ];
          
          const isParkedDomain = parkedDomainIndicators.some(indicator => 
            content.toLowerCase().includes(indicator)
          );
          
          if (isParkedDomain) {
            return { isValid: false, status: 200, error: 'Parked domain detected' };
          }
        }
      } catch (contentError) {
        // If we can't check content, still allow the URL if it's accessible
        console.warn('Could not check page content for parked domain detection:', contentError);
      }
    }

    return {
      isValid: response.ok,
      status: response.status,
      error: response.ok ? undefined : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      isValid: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

export async function verifyWebsitesInText(text: string): Promise<{verifiedUrls: string[], invalidUrls: string[]}> {
  const urlRegex = /https?:\/\/[^\s<>"']+/g;
  const urls = text.match(urlRegex) || [];

  const verifiedUrls: string[] = [];
  const invalidUrls: string[] = [];

  for (const url of urls.slice(0, 10)) { // Increased limit to 10 URLs for better verification
    const verification = await verifyWebsite(url);
    if (verification.isValid) {
      verifiedUrls.push(url);
      console.log(`✅ Website verified: ${url}`);
    } else {
      invalidUrls.push(`${url} (${verification.error})`);
      console.warn(`⚠️ Invalid website detected: ${url} - ${verification.error}`);
    }
  }

  return { verifiedUrls, invalidUrls };
}

export async function verifyWebsiteEnhanced(url: string): Promise<{
  isValid: boolean; 
  status: number; 
  error?: string;
  companyName?: string;
  industry?: string;
  lastVerified?: string;
}> {
  try {
    // Basic URL validation
    if (!url || !url.startsWith('http')) {
      return { isValid: false, status: 0, error: 'Invalid URL format' };
    }

    // Check if URL is accessible
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      // Extract domain for company name
      const domain = new URL(url).hostname.replace('www.', '');
      const companyName = domain.split('.')[0];
      
      return {
        isValid: true,
        status: response.status,
        companyName: companyName.charAt(0).toUpperCase() + companyName.slice(1),
        lastVerified: new Date().toISOString()
      };
    } else {
      return {
        isValid: false,
        status: response.status,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    return {
      isValid: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

