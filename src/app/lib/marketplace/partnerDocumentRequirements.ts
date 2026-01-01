// Partner document requirements based on Country + Partnership Type

export type PartnerCountry = 'India' | 'United States';

export type PartnershipType = 
  | 'Connect CRM & DIY Partners'
  | 'Data Partners'
  | 'Lead Partners'
  | 'Sales Partners'
  | 'Compliance Partners'
  | 'Bank Partners'
  | 'Affiliates'
  | 'Custom Partners';

export interface PartnerDocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'business' | 'tax' | 'identity' | 'legal' | 'technical' | 'compliance' | 'banking';
}

export interface PartnerDocumentRequirementsConfig {
  country: PartnerCountry;
  partnershipType: PartnershipType;
  documents: PartnerDocumentRequirement[];
  requiredFields: {
    companyLegalName: boolean;
    companyName: boolean;
    website: boolean;
    registeredAddress: boolean;
    contactPersonName: boolean;
    contactPersonEmail: boolean;
    contactPersonPhone: boolean;
    taxId: boolean;
    bankAccount: boolean;
  };
}

// India-specific documents for Connect CRM & DIY Partners
const getConnectCRMIndiaDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'company_pan',
    name: 'Company PAN',
    description: 'Permanent Account Number for the company',
    required: true,
    category: 'tax',
  },
  {
    id: 'gst_certificate',
    name: 'GST Registration Certificate',
    description: 'Goods and Services Tax registration certificate',
    required: true,
    category: 'tax',
  },
  {
    id: 'cin',
    name: 'CIN from MCA',
    description: 'Corporate Identification Number from Ministry of Corporate Affairs (if company)',
    required: true,
    category: 'business',
  },
  {
    id: 'authorized_signatory_id',
    name: 'Authorized Signatory ID',
    description: 'Aadhaar or PAN card of authorized signatory',
    required: true,
    category: 'identity',
  },
  {
    id: 'api_documentation',
    name: 'API Documentation Access',
    description: 'API documentation and integration guides',
    required: true,
    category: 'technical',
  },
  {
    id: 'data_schema',
    name: 'Data Schema',
    description: 'Database schema and data structure documentation',
    required: true,
    category: 'technical',
  },
  {
    id: 'api_keys',
    name: 'Sandbox & Production API Keys',
    description: 'API credentials for sandbox and production environments',
    required: true,
    category: 'technical',
  },
  {
    id: 'ip_whitelist',
    name: 'IP Whitelist Details',
    description: 'List of IP addresses to whitelist for API access',
    required: true,
    category: 'technical',
  },
  {
    id: 'dpa_dpdp',
    name: 'Data Processing Agreement (DPA)',
    description: 'DPA as per DPDP Act 2023 compliance',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// US-specific documents for Connect CRM & DIY Partners
const getConnectCRMUSDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'ein',
    name: 'EIN (Employer Identification Number)',
    description: 'Federal Employer Identification Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'state_business_registration',
    name: 'State Business Registration Document',
    description: 'State-level business registration certificate',
    required: true,
    category: 'business',
  },
  {
    id: 'w9_form',
    name: 'W-9 Form',
    description: 'IRS Form W-9 for tax reporting (if needed)',
    required: false,
    category: 'tax',
  },
  {
    id: 'authorized_signatory_id',
    name: 'Authorized Signatory ID',
    description: "Driver's License or Passport of authorized signatory",
    required: true,
    category: 'identity',
  },
  {
    id: 'api_documentation',
    name: 'API Documentation Access',
    description: 'API documentation and integration guides',
    required: true,
    category: 'technical',
  },
  {
    id: 'data_schema',
    name: 'Data Schema',
    description: 'Database schema and data structure documentation',
    required: true,
    category: 'technical',
  },
  {
    id: 'oauth_credentials',
    name: 'OAuth / API Credentials',
    description: 'OAuth tokens or API credentials for integration',
    required: true,
    category: 'technical',
  },
  {
    id: 'soc2_summary',
    name: 'SOC 2 Summary',
    description: 'System & Organization Controls (SOC 2) summary (if available)',
    required: false,
    category: 'compliance',
  },
  {
    id: 'dpa_gdpr_ccpa',
    name: 'Data Processing Agreement',
    description: 'DPA compliant with GDPR/CCPA regulations',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// India-specific documents for Data Partners
const getDataPartnersIndiaDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'pan',
    name: 'PAN',
    description: 'Permanent Account Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'gst',
    name: 'GST',
    description: 'GST Registration Certificate',
    required: true,
    category: 'tax',
  },
  {
    id: 'cin',
    name: 'CIN',
    description: 'Corporate Identification Number',
    required: true,
    category: 'business',
  },
  {
    id: 'data_ownership_declaration',
    name: 'Data Ownership Declaration',
    description: 'Declaration of data ownership rights',
    required: true,
    category: 'legal',
  },
  {
    id: 'data_license',
    name: 'Data License or Sharing Permission',
    description: 'License or permission document for data sharing',
    required: true,
    category: 'legal',
  },
  {
    id: 'sample_dataset',
    name: 'Sample Dataset',
    description: 'Representative sample of the dataset to be shared',
    required: true,
    category: 'technical',
  },
  {
    id: 'data_dictionary',
    name: 'Data Dictionary',
    description: 'Data dictionary with field definitions and descriptions',
    required: true,
    category: 'technical',
  },
  {
    id: 'data_update_frequency',
    name: 'Data Update Frequency Doc',
    description: 'Documentation of how frequently data will be updated',
    required: true,
    category: 'technical',
  },
  {
    id: 'transfer_method',
    name: 'Transfer Method (SFTP/API)',
    description: 'Documentation of data transfer method and protocols',
    required: true,
    category: 'technical',
  },
  {
    id: 'dsa_dpdp_rbi',
    name: 'Data Sharing Agreement',
    description: 'DSA compliant with DPDP, RBI data storage norms',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// US-specific documents for Data Partners
const getDataPartnersUSDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'ein',
    name: 'EIN',
    description: 'Employer Identification Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'state_registration',
    name: 'State Registration Document',
    description: 'State business registration document',
    required: true,
    category: 'business',
  },
  {
    id: 'data_ownership_certificate',
    name: 'Data Ownership Certificate / License',
    description: 'Certificate or license proving data ownership',
    required: true,
    category: 'legal',
  },
  {
    id: 'sample_dataset',
    name: 'Sample Dataset',
    description: 'Representative sample of the dataset',
    required: true,
    category: 'technical',
  },
  {
    id: 'data_schema_dictionary',
    name: 'Data Schema / Dictionary',
    description: 'Complete data schema and dictionary',
    required: true,
    category: 'technical',
  },
  {
    id: 'transfer_method',
    name: 'Data Transfer Method Documentation',
    description: 'Documentation of data transfer protocols',
    required: true,
    category: 'technical',
  },
  {
    id: 'compliance_declaration',
    name: 'CCPA/GLBA/GDPR Compliance Declaration',
    description: 'Compliance declaration (depending on industry)',
    required: true,
    category: 'compliance',
  },
  {
    id: 'dsa',
    name: 'DSA (Data Sharing Agreement)',
    description: 'Data Sharing Agreement with compliance terms',
    required: true,
    category: 'legal',
  },
  {
    id: 'soc2_hipaa',
    name: 'SOC 2 / HIPAA',
    description: 'SOC 2 or HIPAA compliance documentation (if applicable)',
    required: false,
    category: 'compliance',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// India-specific documents for Lead Partners
const getLeadPartnersIndiaDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'pan',
    name: 'PAN',
    description: 'Permanent Account Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'gst',
    name: 'GST',
    description: 'GST registration (if registered business)',
    required: false,
    category: 'tax',
  },
  {
    id: 'aadhaar_pan_individual',
    name: 'Aadhaar/PAN for Individual',
    description: 'Aadhaar or PAN for individual affiliates',
    required: true,
    category: 'identity',
  },
  {
    id: 'lead_gen_process',
    name: 'Lead Generation Process Document',
    description: 'Documentation of lead generation methodology',
    required: true,
    category: 'business',
  },
  {
    id: 'sample_lead_format',
    name: 'Sample Lead Format',
    description: 'Sample format of leads to be provided',
    required: true,
    category: 'business',
  },
  {
    id: 'commission_agreement',
    name: 'Commission Agreement',
    description: 'Agreement outlining commission structure',
    required: true,
    category: 'legal',
  },
  {
    id: 'bank_details',
    name: 'Bank Account Details (Cancelled Cheque)',
    description: 'Bank account details with cancelled cheque',
    required: true,
    category: 'banking',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// US-specific documents for Lead Partners
const getLeadPartnersUSDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'ein',
    name: 'EIN',
    description: 'Employer Identification Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'w9_form',
    name: 'W-9 Form',
    description: 'IRS Form W-9 for payouts',
    required: true,
    category: 'tax',
  },
  {
    id: 'lead_gen_methodology',
    name: 'Lead Generation Methodology',
    description: 'Documentation of lead generation process',
    required: true,
    category: 'business',
  },
  {
    id: 'lead_quality_standards',
    name: 'Lead Quality Standards',
    description: 'Standards and criteria for lead quality',
    required: true,
    category: 'business',
  },
  {
    id: 'sample_lead_format',
    name: 'Sample Lead File Format',
    description: 'Sample format of lead files',
    required: true,
    category: 'business',
  },
  {
    id: 'commission_agreement',
    name: 'Commission Agreement',
    description: 'Commission structure and payment terms',
    required: true,
    category: 'legal',
  },
  {
    id: 'bank_routing_account',
    name: 'Bank Routing + Account Number',
    description: 'Bank routing and account number for payouts',
    required: true,
    category: 'banking',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// India-specific documents for Sales Partners
const getSalesPartnersIndiaDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'pan',
    name: 'PAN',
    description: 'Permanent Account Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'gst_cin',
    name: 'GST / CIN',
    description: 'GST Certificate or Corporate Identification Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'sales_team_profile',
    name: 'Sales Team Profile',
    description: 'Profile and credentials of sales team members',
    required: true,
    category: 'business',
  },
  {
    id: 'service_capability',
    name: 'Service Capability Document',
    description: 'Documentation of service capabilities and offerings',
    required: true,
    category: 'business',
  },
  {
    id: 'region_industry_focus',
    name: 'Region & Industry Focus Document',
    description: 'Target regions and industry verticals',
    required: true,
    category: 'business',
  },
  {
    id: 'sales_process',
    name: 'Sales Process Breakdown',
    description: 'Detailed sales process and methodology',
    required: true,
    category: 'business',
  },
  {
    id: 'compliance_declaration',
    name: 'Compliance Declaration',
    description: 'Compliance declaration (if handling customer financial data)',
    required: false,
    category: 'compliance',
  },
  {
    id: 'revenue_share_agreement',
    name: 'Revenue Share Agreement',
    description: 'Agreement on revenue sharing structure',
    required: true,
    category: 'legal',
  },
  {
    id: 'kyc_pan_aadhaar',
    name: 'KYC (PAN + Aadhaar)',
    description: 'KYC documents including PAN and Aadhaar',
    required: true,
    category: 'identity',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// US-specific documents for Sales Partners
const getSalesPartnersUSDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'ein',
    name: 'EIN',
    description: 'Employer Identification Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'business_license',
    name: 'Business License',
    description: 'State-wise business license (if required)',
    required: false,
    category: 'business',
  },
  {
    id: 'sales_capability_deck',
    name: 'Sales Capability Deck',
    description: 'Presentation of sales capabilities and track record',
    required: true,
    category: 'business',
  },
  {
    id: 'sales_team_profiles',
    name: 'Sales Team Profiles',
    description: 'Profiles and credentials of sales team',
    required: true,
    category: 'business',
  },
  {
    id: 'sales_process_sheets',
    name: 'Sales Process Sheets',
    description: 'Documentation of sales processes',
    required: true,
    category: 'business',
  },
  {
    id: 'industry_focus_data',
    name: 'Industry Focus Data',
    description: 'Target industries and market focus',
    required: true,
    category: 'business',
  },
  {
    id: 'ccpa_gdpr_compliance',
    name: 'CCPA/GDPR Compliance',
    description: 'Compliance documentation if handling sensitive data',
    required: false,
    category: 'compliance',
  },
  {
    id: 'revenue_share_agreement',
    name: 'Revenue Share Agreement',
    description: 'Revenue sharing terms and conditions',
    required: true,
    category: 'legal',
  },
  {
    id: 'w9_form',
    name: 'W-9 (for payouts)',
    description: 'IRS Form W-9 for commission payouts',
    required: true,
    category: 'tax',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// India-specific documents for Compliance Partners
const getCompliancePartnersIndiaDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'cin_gst_pan',
    name: 'CIN / GST / PAN',
    description: 'Corporate identity and tax documents',
    required: true,
    category: 'tax',
  },
  {
    id: 'compliance_license',
    name: 'Compliance License/Certification',
    description: 'ISO, PCI DSS, SOC 2 or similar certifications (if applicable)',
    required: true,
    category: 'compliance',
  },
  {
    id: 'regulatory_authorization',
    name: 'SEBI/IRDA/RBI Authorization',
    description: 'Authorization from regulatory bodies (if in regulated domain)',
    required: false,
    category: 'compliance',
  },
  {
    id: 'scope_of_services',
    name: 'Scope of Compliance Services Document',
    description: 'Documentation of compliance services offered',
    required: true,
    category: 'business',
  },
  {
    id: 'kyc_aml_framework',
    name: 'KYC/AML Framework Documentation',
    description: 'KYC and AML compliance framework documentation',
    required: true,
    category: 'compliance',
  },
  {
    id: 'sla',
    name: 'Service-Level Agreement (SLA)',
    description: 'SLA for compliance services',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// US-specific documents for Compliance Partners
const getCompliancePartnersUSDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'ein',
    name: 'EIN',
    description: 'Employer Identification Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'state_license',
    name: 'State License to Practice',
    description: 'State license for law, audit, or compliance practice',
    required: true,
    category: 'compliance',
  },
  {
    id: 'soc2_iso_pci',
    name: 'SOC 2 / ISO 27001 / PCI DSS',
    description: 'Compliance certifications and documentation',
    required: true,
    category: 'compliance',
  },
  {
    id: 'kyc_aml_program',
    name: 'KYC/AML Program Documentation',
    description: 'KYC/AML program based on FinCEN guidelines',
    required: true,
    category: 'compliance',
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    description: 'HIPAA compliance documentation (if healthcare)',
    required: false,
    category: 'compliance',
  },
  {
    id: 'scope_of_compliance',
    name: 'Scope of Compliance Support',
    description: 'Documentation of compliance support services',
    required: true,
    category: 'business',
  },
  {
    id: 'liability_insurance',
    name: 'Liability Insurance Certificate',
    description: 'Professional liability insurance certificate',
    required: true,
    category: 'business',
  },
  {
    id: 'sla',
    name: 'SLA',
    description: 'Service-Level Agreement',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// India-specific documents for Bank Partners
const getBankPartnersIndiaDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'rbi_license',
    name: 'RBI License Details',
    description: 'Reserve Bank of India license details (public info)',
    required: true,
    category: 'compliance',
  },
  {
    id: 'nodal_account_agreement',
    name: 'Nodal Account Agreement',
    description: 'Agreement for nodal account management',
    required: true,
    category: 'legal',
  },
  {
    id: 'kyc_aml_rbi',
    name: 'KYC/AML Requirements',
    description: 'KYC/AML requirements as per RBI guidelines',
    required: true,
    category: 'compliance',
  },
  {
    id: 'settlement_cycle',
    name: 'Settlement Cycle Documentation',
    description: 'Documentation of settlement cycles and processes',
    required: true,
    category: 'banking',
  },
  {
    id: 'banking_api',
    name: 'Banking API Documentation',
    description: 'API documentation (if providing banking APIs)',
    required: false,
    category: 'technical',
  },
  {
    id: 'chargeback_policy',
    name: 'Chargeback Policy',
    description: 'Policy for handling chargebacks',
    required: true,
    category: 'banking',
  },
  {
    id: 'mou',
    name: 'MoU',
    description: 'Memorandum of Understanding',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// US-specific documents for Bank Partners
const getBankPartnersUSDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'banking_license',
    name: 'Federal/State Banking License',
    description: 'Federal or state banking license documentation',
    required: true,
    category: 'compliance',
  },
  {
    id: 'ach_settlement',
    name: 'ACH Settlement Guidelines',
    description: 'ACH settlement guidelines and documentation',
    required: true,
    category: 'banking',
  },
  {
    id: 'kyc_aml_fincen',
    name: 'KYC/AML Compliance Documentation',
    description: 'KYC/AML compliance per FinCEN, OFAC requirements',
    required: true,
    category: 'compliance',
  },
  {
    id: 'banking_api',
    name: 'Banking API Docs',
    description: 'Banking API documentation (if applicable)',
    required: false,
    category: 'technical',
  },
  {
    id: 'risk_fraud_policy',
    name: 'Risk & Fraud Policy',
    description: 'Risk management and fraud prevention policy',
    required: true,
    category: 'banking',
  },
  {
    id: 'mou',
    name: 'MoU',
    description: 'Memorandum of Understanding',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// India-specific documents for Affiliates
const getAffiliatesIndiaDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'aadhaar_pan',
    name: 'Aadhaar / PAN',
    description: 'Aadhaar or PAN card for identification',
    required: true,
    category: 'identity',
  },
  {
    id: 'gst',
    name: 'GST',
    description: 'GST registration (if earning above ₹20L)',
    required: false,
    category: 'tax',
  },
  {
    id: 'social_media_stats',
    name: 'Social Media Stats',
    description: 'Social media follower counts and engagement statistics',
    required: true,
    category: 'business',
  },
  {
    id: 'audience_demographics',
    name: 'Audience Demographics',
    description: 'Demographics and profile of your audience',
    required: true,
    category: 'business',
  },
  {
    id: 'content_usage_rights',
    name: 'Content Usage Rights Document',
    description: 'Rights for content usage and distribution',
    required: true,
    category: 'legal',
  },
  {
    id: 'bank_details',
    name: 'Bank Details for Payouts',
    description: 'Bank account details for commission payouts',
    required: true,
    category: 'banking',
  },
  {
    id: 'affiliate_agreement',
    name: 'Affiliate Agreement',
    description: 'Affiliate partnership agreement',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// US-specific documents for Affiliates
const getAffiliatesUSDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'w9_form',
    name: 'W-9 Form',
    description: 'IRS Form W-9 for tax reporting',
    required: true,
    category: 'tax',
  },
  {
    id: 'ein_ssn',
    name: 'EIN or SSN',
    description: 'EIN or SSN for payouts',
    required: true,
    category: 'tax',
  },
  {
    id: 'social_media_analytics',
    name: 'Social Media Analytics',
    description: 'Social media analytics and engagement metrics',
    required: true,
    category: 'business',
  },
  {
    id: 'audience_demographics',
    name: 'Audience Demographics',
    description: 'Audience demographics and targeting information',
    required: true,
    category: 'business',
  },
  {
    id: 'content_usage_agreement',
    name: 'Content Usage Agreement',
    description: 'Agreement for content usage and distribution',
    required: true,
    category: 'legal',
  },
  {
    id: 'bank_routing_account',
    name: 'Bank Routing + Account Number',
    description: 'Bank routing and account number for payouts',
    required: true,
    category: 'banking',
  },
  {
    id: 'affiliate_agreement',
    name: 'Affiliate Agreement',
    description: 'Affiliate partnership agreement',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
];

// India-specific documents for Custom Partners
const getCustomPartnersIndiaDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'pan',
    name: 'PAN',
    description: 'Permanent Account Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'gst_cin',
    name: 'GST/CIN',
    description: 'GST Certificate or Corporate Identification Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'custom_proposal',
    name: 'Custom Partnership Proposal',
    description: 'Detailed proposal outlining partnership objectives',
    required: true,
    category: 'business',
  },
  {
    id: 'kyc_documents',
    name: 'KYC Documents',
    description: 'Know Your Customer documentation',
    required: true,
    category: 'identity',
  },
  {
    id: 'mou',
    name: 'MoU',
    description: 'Memorandum of Understanding',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
  {
    id: 'technical_operational_docs',
    name: 'Technical/Operational Docs',
    description: 'Technical or operational documents (based on partnership type)',
    required: false,
    category: 'business',
  },
];

// US-specific documents for Custom Partners
const getCustomPartnersUSDocuments = (): PartnerDocumentRequirement[] => [
  {
    id: 'ein',
    name: 'EIN',
    description: 'Employer Identification Number',
    required: true,
    category: 'tax',
  },
  {
    id: 'business_license',
    name: 'Business License',
    description: 'State or federal business license',
    required: true,
    category: 'business',
  },
  {
    id: 'custom_proposal',
    name: 'Custom Partnership Proposal',
    description: 'Detailed proposal outlining partnership objectives',
    required: true,
    category: 'business',
  },
  {
    id: 'kyc_identity_documents',
    name: 'KYC/Identity Documents',
    description: 'KYC and identity verification documents',
    required: true,
    category: 'identity',
  },
  {
    id: 'mou',
    name: 'MoU',
    description: 'Memorandum of Understanding',
    required: true,
    category: 'legal',
  },
  {
    id: 'nda',
    name: 'NDA',
    description: 'Non-Disclosure Agreement',
    required: true,
    category: 'legal',
  },
  {
    id: 'regulatory_docs',
    name: 'Regulatory Docs',
    description: 'Any regulatory docs relevant to industry',
    required: false,
    category: 'compliance',
  },
];

// Main function to get document requirements
export function getPartnerDocumentRequirements(
  country: PartnerCountry,
  partnershipType: PartnershipType
): PartnerDocumentRequirementsConfig {
  let documents: PartnerDocumentRequirement[] = [];
  let requiredFields = {
    companyLegalName: true,
    companyName: true,
    website: true,
    registeredAddress: true,
    contactPersonName: true,
    contactPersonEmail: true,
    contactPersonPhone: true,
    taxId: true,
    bankAccount: false,
  };

  // Get documents based on country and partnership type
  if (country === 'India') {
    switch (partnershipType) {
      case 'Connect CRM & DIY Partners':
        documents = getConnectCRMIndiaDocuments();
        requiredFields.bankAccount = false;
        break;
      case 'Data Partners':
        documents = getDataPartnersIndiaDocuments();
        requiredFields.bankAccount = false;
        break;
      case 'Lead Partners':
        documents = getLeadPartnersIndiaDocuments();
        requiredFields.bankAccount = true;
        break;
      case 'Sales Partners':
        documents = getSalesPartnersIndiaDocuments();
        requiredFields.bankAccount = false;
        break;
      case 'Compliance Partners':
        documents = getCompliancePartnersIndiaDocuments();
        requiredFields.bankAccount = false;
        break;
      case 'Bank Partners':
        documents = getBankPartnersIndiaDocuments();
        requiredFields.bankAccount = true;
        break;
      case 'Affiliates':
        documents = getAffiliatesIndiaDocuments();
        requiredFields.bankAccount = true;
        requiredFields.companyLegalName = false;
        requiredFields.companyName = false;
        break;
      case 'Custom Partners':
        documents = getCustomPartnersIndiaDocuments();
        requiredFields.bankAccount = false;
        break;
    }
  } else if (country === 'United States') {
    switch (partnershipType) {
      case 'Connect CRM & DIY Partners':
        documents = getConnectCRMUSDocuments();
        requiredFields.bankAccount = false;
        break;
      case 'Data Partners':
        documents = getDataPartnersUSDocuments();
        requiredFields.bankAccount = false;
        break;
      case 'Lead Partners':
        documents = getLeadPartnersUSDocuments();
        requiredFields.bankAccount = true;
        break;
      case 'Sales Partners':
        documents = getSalesPartnersUSDocuments();
        requiredFields.bankAccount = false;
        break;
      case 'Compliance Partners':
        documents = getCompliancePartnersUSDocuments();
        requiredFields.bankAccount = false;
        break;
      case 'Bank Partners':
        documents = getBankPartnersUSDocuments();
        requiredFields.bankAccount = true;
        break;
      case 'Affiliates':
        documents = getAffiliatesUSDocuments();
        requiredFields.bankAccount = true;
        requiredFields.companyLegalName = false;
        requiredFields.companyName = false;
        break;
      case 'Custom Partners':
        documents = getCustomPartnersUSDocuments();
        requiredFields.bankAccount = false;
        break;
    }
  }

  return {
    country,
    partnershipType,
    documents,
    requiredFields,
  };
}

// Helper function to get all partnership types
export function getPartnershipTypes(): PartnershipType[] {
  return [
    'Connect CRM & DIY Partners',
    'Data Partners',
    'Lead Partners',
    'Sales Partners',
    'Compliance Partners',
    'Bank Partners',
    'Affiliates',
    'Custom Partners',
  ];
}

// Helper function to get partnership type descriptions
export function getPartnershipTypeDescription(type: PartnershipType): string {
  const descriptions: Record<PartnershipType, string> = {
    'Connect CRM & DIY Partners': 'Salesforce, HubSpot, Zoho integrations - Build and manage CRM integrations',
    'Data Partners': 'Provide raw CSV/JSON/unstructured datasets for platform enrichment',
    'Lead Partners': 'Generate qualified leads for the platform',
    'Sales Partners': 'Handle end-to-end sales closures and revenue generation',
    'Compliance Partners': 'Legal, KYC/AML, audit, and regulatory consulting services',
    'Bank Partners': 'Co-branded banking, settlement, payments, and credit products',
    'Affiliates': 'Influencers, public speakers, and brand promoters',
    'Custom Partners': 'Any form of collaboration not fitting the above categories',
  };
  return descriptions[type] || '';
}
