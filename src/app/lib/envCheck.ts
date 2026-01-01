// Environment variables check utility
export interface EnvCheckResult {
  openai: boolean;
  gemini: boolean;
  perplexity: boolean;
  tavily: boolean;
  groq: boolean;
  missing: string[];
  available: string[];
}

export function checkEnvironmentVariables(): EnvCheckResult {
  const checks = {
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GOOGLE_API_KEY,
    perplexity: !!process.env.PERPLEXITY_API_KEY,
    tavily: !!process.env.TAVILY_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
  };

  const missing: string[] = [];
  const available: string[] = [];

  if (!checks.openai) missing.push('OPENAI_API_KEY');
  else available.push('OPENAI_API_KEY');

  if (!checks.gemini) missing.push('GOOGLE_API_KEY');
  else available.push('GOOGLE_API_KEY');

  if (!checks.perplexity) missing.push('PERPLEXITY_API_KEY');
  else available.push('PERPLEXITY_API_KEY');

  if (!checks.tavily) missing.push('TAVILY_API_KEY');
  else available.push('TAVILY_API_KEY');

  if (!checks.groq) missing.push('GROQ_API_KEY');
  else available.push('GROQ_API_KEY');

  return {
    ...checks,
    missing,
    available
  };
}

export function logEnvironmentStatus(): void {
  const envCheck = checkEnvironmentVariables();
  
  console.log('🔧 ENVIRONMENT CHECK:');
  console.log('Available API keys:', envCheck.available);
  console.log('Missing API keys:', envCheck.missing);
  
  if (envCheck.missing.length > 0) {
    console.warn('⚠️ Missing API keys will result in mock responses');
  }
  
  if (envCheck.available.length === 0) {
    console.error('❌ No API keys found! All responses will be mock data.');
  }
}
