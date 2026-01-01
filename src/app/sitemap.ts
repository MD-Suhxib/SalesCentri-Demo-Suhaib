import type { MetadataRoute } from 'next';

const BASE_URL = 'https://salescentri.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const lastmod = now.toISOString();

  const urls: MetadataRoute.Sitemap = [
    // Main pages
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/company/about-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/company/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/get-started`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/get-started/free-trial`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/get-started/book-demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/pricing/plans-overview`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/pricing/enterprise-custom`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    
    // Platforms
    { url: `${BASE_URL}/platforms/contact-intelligence`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/platforms/lead-management`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/platforms/lead-management/features`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/platforms/lead-management/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/platforms/cloud-telephony`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/platforms/chat-ai`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    
    // Solutions
    { url: `${BASE_URL}/solutions/psa-suite-one-stop-solution`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/solutions/by-industry`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/solutions/by-use-case`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    
    // Services
    { url: `${BASE_URL}/services/ai-digital-marketing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/services/ai-website-designing`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/sales-outsourcing`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/data-enrichment`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/lead-research-as-a-service`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/sdr-as-a-service`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/email-campaign-management`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/linkedin-outreach`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/custom-workflow-automation`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services/voice-chat-ai-custom-deployment`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    
    // Resources
    { url: `${BASE_URL}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/resources/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/resources/performance-benchmarks`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/resources/case-studies`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/resources/tutorials-webinars`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/resources/whitepapers-ebooks`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    
    // Marketplace
    { url: `${BASE_URL}/market-place`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/market-place/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/market-place/dashboard`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    
    // Tools
    { url: `${BASE_URL}/roi-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    
    // Legal & Trust
    { url: `${BASE_URL}/legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/trust-compliance`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/trust-compliance/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/trust-compliance/security-privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/trust-compliance/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/trust-compliance/compliance-certifications`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    
    // Login
    { url: `${BASE_URL}/login-portal`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Ensure required fields are present for each entry
  return urls.map((entry) => ({
    ...entry,
    lastModified: entry.lastModified ?? lastmod,
  }));
}


