// Document requirements based on Region + Business Type + Company Type

export type Region = 'United States' | 'India';
export type BusinessType = 'Startup' | 'Buyer' | 'Supplier';
export type CompanyTypeIndia = 
  | 'Private Limited Company (Pvt Ltd)'
  | 'Public Limited Company'
  | 'Limited Liability Partnership (LLP)'
  | 'Partnership Firm'
  | 'Sole Proprietorship'
  | 'One Person Company (OPC)'
  | 'MSME Registered Entity'
  | 'Trust / Society / NGO';

export type CompanyTypeUS = 
  | 'Limited Liability Company (LLC)'
  | 'C Corporation (C-Corp)'
  | 'S Corporation (S-Corp)'
  | 'Sole Proprietorship'
  | 'Partnership (General/LP/LLP)'
  | 'Nonprofit Corporation'
  | 'DBA/Fictitious Business Name';

export type CompanyType = CompanyTypeIndia | CompanyTypeUS;

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'incorporation' | 'tax' | 'address' | 'identity' | 'business' | 'compliance';
}

export interface DocumentRequirementsConfig {
  region: Region;
  businessType: BusinessType;
  companyType: CompanyType;
  documents: DocumentRequirement[];
  requiredFields: {
    companyLegalName: boolean;
    website: boolean;
    registeredAddress: boolean;
    contactPersonName: boolean;
    contactPersonId: boolean;
    businessPhone: boolean;
    businessEmail: boolean;
    taxId: boolean;
    bankVerification: boolean;
  };
}

// Base required fields for all
const baseRequiredFields = {
  companyLegalName: true,
  registeredAddress: true,
  contactPersonName: true,
  contactPersonId: true,
  businessPhone: true,
  businessEmail: true,
  taxId: true,
  bankVerification: false,
};

// INDIA - Document Requirements
const indiaDocuments: Record<CompanyTypeIndia, DocumentRequirement[]> = {
  'Private Limited Company (Pvt Ltd)': [
    {
      id: 'incorp-cert',
      name: 'Certificate of Incorporation (MCA)',
      description: 'Official certificate from Ministry of Corporate Affairs',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Permanent Account Number issued by Income Tax Department',
      required: true,
      category: 'tax',
    },
    {
      id: 'gst',
      name: 'GST Certificate',
      description: 'Goods and Services Tax registration certificate',
      required: true,
      category: 'tax',
    },
    {
      id: 'moa-aoa',
      name: 'MOA & AOA',
      description: 'Memorandum of Association and Articles of Association',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'din',
      name: 'Director ID (DIN)',
      description: 'Director Identification Number of authorized signatory',
      required: true,
      category: 'identity',
    },
    {
      id: 'address-proof',
      name: 'Registered Office Address Proof',
      description: 'Utility bill, rent agreement, or property documents',
      required: true,
      category: 'address',
    },
  ],
  'Public Limited Company': [
    {
      id: 'incorp-cert',
      name: 'Certificate of Incorporation (MCA)',
      description: 'Official certificate from Ministry of Corporate Affairs',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Permanent Account Number issued by Income Tax Department',
      required: true,
      category: 'tax',
    },
    {
      id: 'gst',
      name: 'GST Certificate',
      description: 'Goods and Services Tax registration certificate',
      required: true,
      category: 'tax',
    },
    {
      id: 'moa-aoa',
      name: 'MOA & AOA',
      description: 'Memorandum of Association and Articles of Association',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'din',
      name: 'Director ID (DIN)',
      description: 'Director Identification Number of authorized signatory',
      required: true,
      category: 'identity',
    },
    {
      id: 'address-proof',
      name: 'Registered Office Address Proof',
      description: 'Utility bill, rent agreement, or property documents',
      required: true,
      category: 'address',
    },
  ],
  'Limited Liability Partnership (LLP)': [
    {
      id: 'llp-cert',
      name: 'LLP Incorporation Certificate',
      description: 'Certificate of incorporation from MCA',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'llp-agreement',
      name: 'LLP Agreement',
      description: 'Limited Liability Partnership agreement document',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Permanent Account Number issued by Income Tax Department',
      required: true,
      category: 'tax',
    },
    {
      id: 'gst',
      name: 'GST Certificate',
      description: 'Goods and Services Tax registration certificate',
      required: true,
      category: 'tax',
    },
    {
      id: 'address-proof',
      name: 'Address Proof',
      description: 'Utility bill, rent agreement, or property documents',
      required: true,
      category: 'address',
    },
  ],
  'Partnership Firm': [
    {
      id: 'gst',
      name: 'GST Certificate',
      description: 'Goods and Services Tax registration certificate',
      required: true,
      category: 'tax',
    },
    {
      id: 'shop-establishment',
      name: 'Shop & Establishment Certificate / Trade License',
      description: 'License from local municipal authority',
      required: true,
      category: 'compliance',
    },
    {
      id: 'pan-proprietor',
      name: 'PAN of Proprietor/Partners',
      description: 'PAN card of all partners',
      required: true,
      category: 'tax',
    },
    {
      id: 'address-proof',
      name: 'Rent Agreement/Utility Bill',
      description: 'Address proof for business premises',
      required: true,
      category: 'address',
    },
  ],
  'Sole Proprietorship': [
    {
      id: 'gst',
      name: 'GST Certificate',
      description: 'Goods and Services Tax registration certificate',
      required: true,
      category: 'tax',
    },
    {
      id: 'shop-establishment',
      name: 'Shop & Establishment Certificate / Trade License',
      description: 'License from local municipal authority',
      required: true,
      category: 'compliance',
    },
    {
      id: 'pan-proprietor',
      name: 'PAN of Proprietor',
      description: 'PAN card of the proprietor',
      required: true,
      category: 'tax',
    },
    {
      id: 'address-proof',
      name: 'Rent Agreement/Utility Bill',
      description: 'Address proof for business premises',
      required: true,
      category: 'address',
    },
  ],
  'One Person Company (OPC)': [
    {
      id: 'incorp-cert',
      name: 'Certificate of Incorporation (MCA)',
      description: 'Official certificate from Ministry of Corporate Affairs',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Permanent Account Number issued by Income Tax Department',
      required: true,
      category: 'tax',
    },
    {
      id: 'gst',
      name: 'GST Certificate',
      description: 'Goods and Services Tax registration certificate',
      required: true,
      category: 'tax',
    },
    {
      id: 'moa-aoa',
      name: 'MOA & AOA',
      description: 'Memorandum of Association and Articles of Association',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'din',
      name: 'Director ID (DIN)',
      description: 'Director Identification Number',
      required: true,
      category: 'identity',
    },
    {
      id: 'address-proof',
      name: 'Registered Office Address Proof',
      description: 'Utility bill, rent agreement, or property documents',
      required: true,
      category: 'address',
    },
  ],
  'MSME Registered Entity': [
    {
      id: 'msme-cert',
      name: 'MSME Registration Certificate',
      description: 'Udyam Registration Certificate',
      required: true,
      category: 'compliance',
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Permanent Account Number',
      required: true,
      category: 'tax',
    },
    {
      id: 'gst',
      name: 'GST Certificate',
      description: 'GST registration certificate (if applicable)',
      required: false,
      category: 'tax',
    },
    {
      id: 'address-proof',
      name: 'Address Proof',
      description: 'Business address verification',
      required: true,
      category: 'address',
    },
  ],
  'Trust / Society / NGO': [
    {
      id: 'registration-cert',
      name: 'Registration Certificate',
      description: 'Certificate of registration from Registrar of Societies/Trusts',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Permanent Account Number',
      required: true,
      category: 'tax',
    },
    {
      id: 'gst',
      name: 'GST Certificate',
      description: 'GST registration (if applicable)',
      required: false,
      category: 'tax',
    },
    {
      id: 'address-proof',
      name: 'Address Proof',
      description: 'Registered office address verification',
      required: true,
      category: 'address',
    },
  ],
};

// UNITED STATES - Document Requirements
const usDocuments: Record<CompanyTypeUS, DocumentRequirement[]> = {
  'Limited Liability Company (LLC)': [
    {
      id: 'articles-organization',
      name: 'Articles of Organization',
      description: 'State-filed articles of organization',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'ein-letter',
      name: 'EIN Letter (SS-4)',
      description: 'Employer Identification Number confirmation letter from IRS',
      required: true,
      category: 'tax',
    },
    {
      id: 'operating-agreement',
      name: 'Operating Agreement',
      description: 'LLC operating agreement document',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'address-proof',
      name: 'Business Address Proof',
      description: 'Utility bill, lease agreement, or business license',
      required: true,
      category: 'address',
    },
  ],
  'C Corporation (C-Corp)': [
    {
      id: 'articles-incorporation',
      name: 'Articles of Incorporation',
      description: 'State-filed articles of incorporation',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'ein-letter',
      name: 'EIN Letter (SS-4)',
      description: 'Employer Identification Number confirmation letter from IRS',
      required: true,
      category: 'tax',
    },
    {
      id: 'corporate-bylaws',
      name: 'Corporate Bylaws / Shareholder Agreement',
      description: 'Corporate bylaws or shareholder agreement',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'state-registration',
      name: 'State Registration Certificate',
      description: 'Certificate of good standing from state',
      required: true,
      category: 'compliance',
    },
  ],
  'S Corporation (S-Corp)': [
    {
      id: 'articles-incorporation',
      name: 'Articles of Incorporation',
      description: 'State-filed articles of incorporation',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'ein-letter',
      name: 'EIN Letter (SS-4)',
      description: 'Employer Identification Number confirmation letter from IRS',
      required: true,
      category: 'tax',
    },
    {
      id: 'corporate-bylaws',
      name: 'Corporate Bylaws / Shareholder Agreement',
      description: 'Corporate bylaws or shareholder agreement',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'state-registration',
      name: 'State Registration Certificate',
      description: 'Certificate of good standing from state',
      required: true,
      category: 'compliance',
    },
    {
      id: 's-election',
      name: 'S-Corp Election (Form 2553)',
      description: 'IRS S-Corporation election form',
      required: true,
      category: 'tax',
    },
  ],
  'Sole Proprietorship': [
    {
      id: 'business-license',
      name: 'Business License or State Registration',
      description: 'Local or state business license',
      required: true,
      category: 'compliance',
    },
    {
      id: 'ein',
      name: 'EIN (if applicable)',
      description: 'Employer Identification Number if you have employees',
      required: false,
      category: 'tax',
    },
    {
      id: 'owner-id',
      name: 'Owner ID + Address Proof',
      description: 'Government-issued ID and proof of address',
      required: true,
      category: 'identity',
    },
  ],
  'Partnership (General/LP/LLP)': [
    {
      id: 'business-license',
      name: 'Business License or State Registration',
      description: 'Local or state business license',
      required: true,
      category: 'compliance',
    },
    {
      id: 'ein',
      name: 'EIN (if applicable)',
      description: 'Employer Identification Number',
      required: false,
      category: 'tax',
    },
    {
      id: 'partnership-agreement',
      name: 'Partnership Agreement',
      description: 'Partnership agreement document',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'owner-id',
      name: 'Partner ID + Address Proof',
      description: 'Government-issued ID for all partners',
      required: true,
      category: 'identity',
    },
  ],
  'Nonprofit Corporation': [
    {
      id: 'articles-incorporation',
      name: 'Articles of Incorporation',
      description: 'State-filed articles of incorporation (nonprofit)',
      required: true,
      category: 'incorporation',
    },
    {
      id: 'ein-letter',
      name: 'EIN Letter (SS-4)',
      description: 'Employer Identification Number confirmation letter',
      required: true,
      category: 'tax',
    },
    {
      id: 'irs-501c',
      name: 'IRS 501(c) Determination Letter',
      description: 'Tax-exempt status determination letter (if applicable)',
      required: false,
      category: 'tax',
    },
    {
      id: 'bylaws',
      name: 'Corporate Bylaws',
      description: 'Nonprofit corporate bylaws',
      required: true,
      category: 'incorporation',
    },
  ],
  'DBA/Fictitious Business Name': [
    {
      id: 'dba-filing',
      name: 'DBA Filing Certificate',
      description: 'Fictitious business name filing certificate',
      required: true,
      category: 'compliance',
    },
    {
      id: 'business-license',
      name: 'Business License',
      description: 'Local or state business license',
      required: true,
      category: 'compliance',
    },
    {
      id: 'owner-id',
      name: 'Owner ID + Address Proof',
      description: 'Government-issued ID and proof of address',
      required: true,
      category: 'identity',
    },
  ],
};

// Supplier-specific additional documents
const supplierDocuments: DocumentRequirement[] = [
  {
    id: 'product-catalog',
    name: 'Product/Service Catalog PDF',
    description: 'Detailed catalog of products or services offered',
    required: true,
    category: 'business',
  },
  {
    id: 'iso-cert',
    name: 'ISO Certifications (if applicable)',
    description: 'ISO quality management or other relevant certifications',
    required: false,
    category: 'compliance',
  },
];

// India-specific supplier documents
const indiaSupplierDocuments: DocumentRequirement[] = [
  ...supplierDocuments,
  {
    id: 'msme-cert',
    name: 'MSME Certificate (optional)',
    description: 'MSME registration certificate if applicable',
    required: false,
    category: 'compliance',
  },
];

// US-specific supplier documents
const usSupplierDocuments: DocumentRequirement[] = [
  ...supplierDocuments,
  {
    id: 'w9-form',
    name: 'W-9 Form',
    description: 'IRS W-9 form for tax reporting',
    required: true,
    category: 'tax',
  },
  {
    id: 'compliance-certs',
    name: 'Compliance Certifications (ISO/SOC II)',
    description: 'Industry compliance certifications if applicable',
    required: false,
    category: 'compliance',
  },
];

export function getDocumentRequirements(
  region: Region,
  businessType: BusinessType,
  companyType: CompanyType
): DocumentRequirementsConfig {
  let documents: DocumentRequirement[] = [];

  // Get base documents based on region and company type
  if (region === 'India') {
    documents = [...(indiaDocuments[companyType as CompanyTypeIndia] || [])];
    
    // Add supplier-specific documents for India
    if (businessType === 'Supplier') {
      documents = [...documents, ...indiaSupplierDocuments];
    }
  } else {
    documents = [...(usDocuments[companyType as CompanyTypeUS] || [])];
    
    // Add supplier-specific documents for US
    if (businessType === 'Supplier') {
      documents = [...documents, ...usSupplierDocuments];
    }
  }

  // Adjust required fields based on business type
  const requiredFields = {
    ...baseRequiredFields,
    website: businessType !== 'Startup', // Optional for startups
    bankVerification: businessType !== 'Startup', // Optional for startups
  };

  return {
    region,
    businessType,
    companyType,
    documents,
    requiredFields,
  };
}

// Get company types for a region
export function getCompanyTypes(region: Region): CompanyType[] {
  if (region === 'India') {
    return [
      'Private Limited Company (Pvt Ltd)',
      'Public Limited Company',
      'Limited Liability Partnership (LLP)',
      'Partnership Firm',
      'Sole Proprietorship',
      'One Person Company (OPC)',
      'MSME Registered Entity',
      'Trust / Society / NGO',
    ];
  } else {
    return [
      'Limited Liability Company (LLC)',
      'C Corporation (C-Corp)',
      'S Corporation (S-Corp)',
      'Sole Proprietorship',
      'Partnership (General/LP/LLP)',
      'Nonprofit Corporation',
      'DBA/Fictitious Business Name',
    ];
  }
}

