// Utility to check for corporate emails vs free email providers
export const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'me.com', 'mac.com', 'live.com', 'msn.com', 'ymail.com', 'rocketmail.com',
  'protonmail.com', 'tutanota.com', 'zoho.com', 'gmx.com', 'mail.com', 'hushmail.com',
  'inbox.com', 'mail.ru', 'yandex.com', 'fastmail.com', '126.com', '163.com', 'qq.com',
]);

export function getDomainFromEmail(email: string) {
  const parts = email.split('@');
  if (parts.length !== 2) return undefined;
  return parts[1].toLowerCase().trim();
}

export function isFreeEmailProvider(email: string) {
  const domain = getDomainFromEmail(email);
  if (!domain) return false;
  // basic exact match check
  if (FREE_EMAIL_DOMAINS.has(domain)) return true;

  // check subdomains such as user@mail.example.com? Not typical for free providers,
  // but we should guard against domains like gmail.co.uk etc. Check domain suffix.
  return Array.from(FREE_EMAIL_DOMAINS).some((freeDomain) => domain.endsWith(`.${freeDomain}`) || domain === freeDomain);
}

export function isCorporateEmail(email: string) {
  // Simple syntax check (RFC approximation) + domain should not be a free provider
  if (!email || typeof email !== 'string') return false;
  // basic email regex for validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;
  // Disallow obvious free providers
  if (isFreeEmailProvider(email)) return false;
  return true;
}

export function getFreeProviderWarning(email: string) {
  const domain = getDomainFromEmail(email);
  if (!domain) return undefined;
  return FREE_EMAIL_DOMAINS.has(domain) || Array.from(FREE_EMAIL_DOMAINS).some((d) => domain.endsWith(`.${d}`))
    ? 'Please use your business email address. Personal email addresses (e.g., Gmail, Yahoo) are not accepted.'
    : undefined;
}
