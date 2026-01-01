// Email validation utilities (simplified without Firebase)
const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com'
];

export const isBusinessEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return !PERSONAL_EMAIL_DOMAINS.includes(domain);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getDomainFromEmail = (email: string): string => {
  return email.split('@')[1] || '';
};

export const getEmailType = (email: string): 'business' | 'personal' => {
  return isBusinessEmail(email) ? 'business' : 'personal';
};
