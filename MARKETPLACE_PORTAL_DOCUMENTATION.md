# Marketplace Portal Onboarding System - Complete Documentation

## Overview

The Marketplace Portal is a comprehensive onboarding system for SalesCentri that allows businesses to register as Startups, Buyers, or Suppliers. The system includes a multi-step registration wizard with dynamic document requirements based on region, business type, and company type.

---

## Routing Structure

### Primary Routes

1. **`/market-place/login`** - Login/Signup page
   - Users can sign in or sign up
   - Sign up redirects to `/market-place/register`
   - Sign in redirects to `/market-place/dashboard` (after authentication)

2. **`/market-place/register`** - Multi-step registration wizard
   - Step 1: Region Selection
   - Step 2: Business Type Selection
   - Step 3: Company Type Selection (dynamic based on region)
   - Step 4: Company Details & Document Uploads
   - Step 5: Review & Submit

3. **`/market-place/dashboard`** - Application dashboard
   - Status tracking
   - Document management
   - Timeline view
   - Company details summary

### Navigation Integration

- **Main Navigation**: Added "Marketplace Portal" link in Navigation.tsx
- **Login Portal Page**: Added Marketplace Portal as a 4th portal option

---

## Step-by-Step Flow

### STEP 1: Region Selection

**Prompt**: "Select your region"

**Allowed Regions**:
- United States 🇺🇸
- India 🇮🇳

**UI**: Card-based selection with flag icons, matching SalesCentri dark theme

**User Action**: Click on region card → Auto-advance to Step 2

---

### STEP 2: Business Type

**Prompt**: "Select Your Business Type"

**Business Categories**:
- **Startup** - Early-stage companies looking to grow
- **Buyer** - Companies looking to purchase products/services
- **Supplier** - Companies offering products/services

**UI**: Three card layout with icons and descriptions

**User Action**: Select business type → Auto-advance to Step 3

---

### STEP 3: Company Type (Auto-Generated Per Region)

#### INDIA - Company Types:
1. Private Limited Company (Pvt Ltd)
2. Public Limited Company
3. Limited Liability Partnership (LLP)
4. Partnership Firm
5. Sole Proprietorship
6. One Person Company (OPC)
7. MSME Registered Entity
8. Trust / Society / NGO

#### UNITED STATES - Company Types:
1. Limited Liability Company (LLC)
2. C Corporation (C-Corp)
3. S Corporation (S-Corp)
4. Sole Proprietorship
5. Partnership (General/LP/LLP)
6. Nonprofit Corporation
7. DBA/Fictitious Business Name

**UI**: Grid of selectable cards matching SalesCentri theme

**User Action**: Select company type → Auto-advance to Step 4

---

### STEP 4: Required Documents & Company Details

This step dynamically generates required fields and documents based on:
- **Region** (India/US)
- **Business Type** (Startup/Buyer/Supplier)
- **Company Type** (selected in Step 3)

#### Base Required Fields (All):
- Company legal name *
- Company type (pre-filled from Step 3)
- Website (optional for startups)
- Registered business address *
- Contact person name *
- Contact person ID *
- Business phone *
- Business email *
- Tax ID (PAN/GST for India, EIN for US) *
- Bank verification document (optional for Startup)

#### Document Requirements by Region + Company Type

**INDIA - Document Requirements:**

**For Pvt Ltd / Public Ltd / OPC:**
- Certificate of Incorporation (MCA) *
- PAN *
- GST *
- MOA & AOA *
- Director ID (DIN) *
- Registered office address proof *

**For LLP:**
- LLP Incorporation Certificate *
- LLP Agreement *
- PAN *
- GST *
- Address proof *

**For Sole Proprietorship / Partnership:**
- GST *
- Shop & Establishment Certificate / Trade License *
- PAN of proprietor *
- Rent agreement/utility bill (address proof) *

**For Suppliers (all company types):**
- Product/service catalog PDF *
- ISO certifications (optional)
- MSME certificate (optional, India only)

**UNITED STATES - Document Requirements:**

**For LLC:**
- Articles of Organization *
- EIN Letter (SS-4) *
- Operating Agreement *
- Business address proof *

**For C-Corp / S-Corp:**
- Articles of Incorporation *
- EIN Letter *
- Corporate Bylaws / Shareholder Agreement *
- State Registration Certificate *
- S-Corp Election (Form 2553) * (S-Corp only)

**For Sole Prop / Partnership:**
- Business License or State Registration *
- EIN (if applicable)
- Owner ID + address proof *

**For Suppliers (all company types):**
- Product/service catalog *
- W-9 form *
- Compliance certifications (ISO/SOC II) (optional)

**UI Features:**
- Auto-generated document upload cards
- Tooltip explaining each document (on hover)
- File upload with preview
- Required vs Optional indicators
- Save as Draft functionality

**User Actions:**
- Fill in company details form
- Upload required documents
- Click "Save as Draft" to save progress
- Click "Continue" to proceed to review

---

### STEP 5: Review & Submit

**Summary Display:**
- Region
- Business Type
- Company Type
- Company details (all fields)
- Uploaded documents list with status

**Actions:**
- **Save as Draft** - Save without submitting
- **Submit Application** - Final submission → Redirects to `/market-place/dashboard`

---

## Marketplace Application Dashboard

### Dashboard Modules

#### 1. Application Status Card
- **Progress Bar**: Visual progress indicator (0-100%)
- **Current Status Badge**: Draft / Submitted / Under Review / Approved / Live
- **Current Stage Display**: Descriptive text about current status

#### 2. Application Timeline
Shows chronological events:
- Draft (completed)
- Submitted (completed)
- Under Review (current)
- Approved (pending)
- Live (pending)

Each event shows:
- Status name
- Date (if completed)
- Description

#### 3. Company Details Summary
Displays:
- Company Name
- Company Type
- Business Type
- Region
- Contact Person
- Email
- Phone

**Action**: "Edit Details" button

#### 4. Documents List
Shows all uploaded documents with:
- Document name
- Upload status (Uploaded / Pending / Rejected)
- Upload date (if uploaded)
- Rejection reason (if rejected)
- Actions:
  - View (for uploaded documents)
  - Re-upload (for rejected documents)
  - Upload (for pending documents)

**Action**: "Replace Document" button

#### 5. Support/Help Section
- Contact Support button
- View FAQ button
- Helpful messaging

---

## Application Status Stages

### Status Flow:
1. **Draft** → User saved but did not submit
2. **Submitted** → User submitted application
3. **Under Review** → Admin started verification
4. **Approved** → All docs verified
5. **Live** → Seller/buyer/startup profile is activated

### Status Logic:
- **Draft**: Application saved but not submitted
- **Submitted**: Application submitted, awaiting admin review
- **Under Review**: Admin team is verifying documents and details
- **Approved**: All verification complete, profile ready to activate
- **Live**: Profile is active on marketplace

---

## Document Requirements Configuration

The document requirements are dynamically generated using the `documentRequirements.ts` file located at:
`src/app/lib/marketplace/documentRequirements.ts`

### Key Functions:

1. **`getDocumentRequirements(region, businessType, companyType)`**
   - Returns complete document requirements configuration
   - Includes required fields flags
   - Includes all documents with descriptions

2. **`getCompanyTypes(region)`**
   - Returns array of company types for a given region

### Document Categories:
- `incorporation` - Company formation documents
- `tax` - Tax-related documents (PAN, GST, EIN)
- `address` - Address verification documents
- `identity` - Identity verification (DIN, ID cards)
- `business` - Business-specific documents (catalogs)
- `compliance` - Compliance certificates (ISO, MSME)

---

## UI/UX Design Patterns

### Design System Alignment:
- **Dark Theme**: Black background with gray-900/800 cards
- **Card Layout**: Rounded cards with backdrop blur
- **Icon Style**: Lucide React icons with gradient backgrounds
- **Interaction Model**: Hover effects, smooth transitions, card-based selections
- **Color Scheme**: Blue/Purple gradients matching SalesCentri brand

### Component Patterns:
- **Progress Bar**: Visual step indicator at top of registration
- **Card Selection**: Clickable cards with hover states
- **Form Inputs**: Dark theme inputs with blue focus rings
- **File Upload**: Drag-and-drop style upload buttons
- **Status Badges**: Color-coded status indicators
- **Timeline**: Vertical timeline with completion indicators

---

## File Structure

```
src/app/
├── market-place/
│   ├── login/
│   │   └── page.tsx          # Login/Signup page
│   ├── register/
│   │   └── page.tsx          # Multi-step registration wizard
│   └── dashboard/
│       └── page.tsx          # Application dashboard
├── lib/
│   └── marketplace/
│       └── documentRequirements.ts  # Document requirements logic
└── components/
    └── Navigation.tsx         # Updated with Marketplace Portal link

src/app/pages/
└── login-portal/
    └── index.tsx             # Updated with Marketplace Portal option
```

---

## UI Copy Reference

### Login Page:
- **Heading**: "Marketplace Portal"
- **Subheading**: "Create your account to get started" / "Welcome back! Sign in to continue"
- **CTA**: "Create Account" / "Sign In"

### Registration Steps:

**Step 1:**
- **Heading**: "Select Your Region"
- **Subheading**: "Choose the region where your business is registered"

**Step 2:**
- **Heading**: "Select Your Business Type"
- **Subheading**: "Choose the category that best describes your business"

**Step 3:**
- **Heading**: "Select Your Company Type"
- **Subheading**: "Choose the legal structure of your business in [Region]"

**Step 4:**
- **Heading**: "Company Details & Documents"
- **Subheading**: "Provide your company information and upload required documents"

**Step 5:**
- **Heading**: "Review Your Application"
- **Subheading**: "Please review all information before submitting"

### Dashboard:
- **Heading**: "Marketplace Application Dashboard"
- **Subheading**: "Track your application status and manage your marketplace profile"
- **Status Messages**: Contextual messages based on current status

---

## Next Steps for Production

1. **Backend Integration**:
   - API endpoints for saving/loading registration data
   - File upload handling for documents
   - Authentication integration
   - Status update webhooks

2. **Data Persistence**:
   - Save draft functionality (localStorage or backend)
   - Resume registration from saved draft
   - Document storage (S3 or similar)

3. **Admin Panel**:
   - Review applications
   - Update status
   - Reject documents with reasons
   - Approve applications

4. **Email Notifications**:
   - Welcome email after signup
   - Status update emails
   - Document rejection notifications

5. **Validation**:
   - Form validation
   - Document type/size validation
   - Tax ID format validation per region

---

## Technical Notes

- All components use Framer Motion for animations
- Dark theme with glassmorphism effects
- Responsive design (mobile-first)
- TypeScript for type safety
- Dynamic document generation based on selections
- State management using React hooks

---

## Summary

The Marketplace Portal onboarding system provides a complete, user-friendly registration flow that:
- Guides users through region → business type → company type selection
- Dynamically generates document requirements
- Provides a comprehensive dashboard for tracking application status
- Maintains consistency with SalesCentri's existing design system
- Supports both India and United States business registrations

All components follow the existing dark theme, card layout, icon style, and interaction model of the Customer Portal and Partner Portal UI.

