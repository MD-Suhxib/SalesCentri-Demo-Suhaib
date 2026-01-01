# Checkout Page - Detailed Flow and Structure Analysis

## 📋 Overview

The checkout page (`src/app/checkout/page.tsx`) is a multi-step checkout process for subscription plans. It implements a 4-step wizard with authentication gating, billing information collection, payment method selection, and final review before PayPal payment processing.

---

## 🏗️ Architecture & Structure

### **Component Hierarchy**
```
CheckoutPage (Main Component)
├── LeftSidebar (Navigation & Progress Tracker)
├── Main Content Area (Vertical Stack)
│   ├── AuthSection (Step 1)
│   ├── BillingSection (Step 2)
│   ├── PaymentSection (Step 3)
│   └── ReviewSection (Step 4)
└── SummaryPanel (Right Sidebar - Order Summary)
```

### **Layout Structure**
- **3-Column Grid Layout** (on large screens):
  - **Column 1 (Left)**: Navigation sidebar with progress steps
  - **Column 2 (Middle)**: Main checkout sections (vertically stacked)
  - **Column 3 (Right)**: Order summary panel with pricing details

---

## 🔄 Step-by-Step Flow

### **Step 1: Authentication** 
**State:** `step === 1`

**Purpose:** User must be authenticated before proceeding to billing

**Flow:**
1. Component loads → Checks authentication status via `validateAuthenticationAsync()`
2. If **NOT authenticated**:
   - Shows Sign In / Create Account tabs
   - User clicks either button → Redirects to external login (`https://dashboard.salescentri.com/login`)
   - Login page preserves current checkout URL via `getLoginUrl(true)`
   - After login, user is redirected back with token params in URL
   - Component detects token params → Polls `localStorage` for saved tokens
   - Once tokens are detected → Validates authentication again
3. If **authenticated**:
   - Shows "You are signed in" message
   - Provides "Continue to Billing" button
   - User can proceed to Step 2

**Key Features:**
- Authentication check runs on mount and when token params detected
- Automatic redirect to login if attempting to access Steps 2-4 without auth
- Token polling mechanism (max 20 attempts, 100ms intervals) to handle async token saving

---

### **Step 2: Billing Information**
**State:** `step === 2`, **Requires:** Authentication

**Purpose:** Collect user billing details

**Flow:**
1. Only accessible if `authChecked && isAuthenticated === true`
2. User fills in:
   - Country/Region (dropdown)
   - Company (optional text input)
   - First Name (text input)
   - Last Name (text input)
   - "Save this information for future billing" checkbox
3. Data stored in `billing` state object
4. User clicks "Continue to Payment" → Moves to Step 3

**State Management:**
```typescript
const [billing, setBilling] = useState<BillingInfo>({
  country: 'United States',
  company: '',
  firstName: '',
  lastName: '',
  saveAddress: true,
});
```

---

### **Step 3: Payment Method**
**State:** `step === 3`, **Requires:** Authentication

**Purpose:** Select payment method (currently only PayPal)

**Flow:**
1. Shows payment method options (currently only PayPal radio button)
2. User selects payment method (defaults to 'paypal')
3. User clicks "Review & Confirm" → Moves to Step 4

**State Management:**
```typescript
const [paymentMethod, setPaymentMethod] = useState<'paypal'>('paypal');
```

---

### **Step 4: Review & Confirm**
**State:** `step === 4`, **Requires:** Authentication

**Purpose:** Final review before payment processing

**Flow:**
1. Displays order summary:
   - Plan name and billing cycle
   - Total amount
2. User must check "I agree to the Terms & Privacy Policy"
3. User clicks "Pay with PayPal" button → Triggers payment flow
4. Payment processing (see Payment Flow section below)

**Validation:**
- Button disabled until:
  - Terms checkbox is checked (`agreeTerms === true`)
  - Valid plan is selected
  - Plan has numeric price
  - Not already processing

---

## 💳 Payment Processing Flow

### **PayPal Payment Flow**

1. **User Clicks "Pay with PayPal"** → `handlePayPalPayment()` function called

2. **Create Success URL** (with payment metadata):
   ```typescript
   const successUrl = new URL('/api/paypal/success', window.location.origin);
   successUrl.searchParams.set('orderId', `order_${Date.now()}`);
   successUrl.searchParams.set('amount', total.toString());
   successUrl.searchParams.set('currency', 'USD');
   successUrl.searchParams.set('segment', segment);
   successUrl.searchParams.set('billingCycle', billingCycle);
   successUrl.searchParams.set('planName', selectedPlan.planName);
   ```

3. **Fetch User Email** (optional):
   - Attempts to fetch user profile from `https://app.demandintellect.com/app/api/profile.php`
   - Adds email to success URL if available

4. **Create PayPal Order** → POST to `/api/paypal/create-order`:
   ```json
   {
     "segment": "Personal" | "Business",
     "billingCycle": "Monthly" | "Yearly",
     "planName": "Plan Name",
     "currency": "USD",
     "amount": 99.99,
     "returnUrl": "https://.../api/paypal/success?...",
     "cancelUrl": "https://.../checkout?cancelled=true"
   }
   ```

5. **Backend Processing** (`/api/paypal/create-order/route.ts`):
   - Validates PayPal credentials (environment variables)
   - Gets price from Firestore (or fallback to client SDK)
   - Creates PayPal order using PayPal SDK:
     - Intent: `AUTHORIZE`
     - Custom ID: `${segment}|${billingCycle}|${planName}`
     - Brand name: "Sales Centri"
   - Returns PayPal order ID (token)

6. **Redirect to PayPal**:
   - Development: `https://www.sandbox.paypal.com/checkoutnow?token={orderId}`
   - Production: `https://www.paypal.com/checkoutnow?token={orderId}`
   - User completes payment on PayPal

7. **PayPal Redirect Back** → `/api/paypal/success`:
   - Extracts parameters: `token`, `PayerID`, and custom params
   - Creates payment record (in-memory storage)
   - Redirects to home page with success parameters:
     ```
     /?payment_success=true&amount=99.99&currency=USD&plan=PlanName&payment_id=pay_xxx
     ```

---

## 📊 Data Flow & State Management

### **Pricing Data Flow**

1. **Initial Load**:
   ```
   Component Mount
   → useEffect fetches from /api/get-pricing
   → API calls getAllPricing() from Firestore
   → Sets pricingData state
   ```

2. **Plan Selection**:
   ```
   User selects Segment + Billing Cycle
   → availablePlans computed (filtered by segment & cycle)
   → planName auto-selected if not set or invalid
   → selectedPlan computed (finds matching plan)
   ```

3. **Query Parameters** (Optional):
   ```
   URL: /checkout?segment=Business&cycle=Yearly&plan=Premium
   → Initializes segment, billingCycle, planName from URL
   ```

### **State Variables Summary**

| State Variable | Type | Purpose |
|---------------|------|---------|
| `step` | `1 \| 2 \| 3 \| 4` | Current checkout step |
| `completedSteps` | `Set<number>` | Tracks completed steps for UI |
| `authChecked` | `boolean` | Whether auth validation has completed |
| `isAuthenticated` | `boolean` | Current authentication status |
| `authTab` | `'signin' \| 'signup'` | Active auth tab (Step 1) |
| `pricingData` | `PlanRow[]` | All pricing plans from API |
| `segment` | `'Personal' \| 'Business'` | Selected segment |
| `billingCycle` | `'Monthly' \| 'Yearly'` | Selected billing cycle |
| `planName` | `string` | Selected plan name |
| `billing` | `BillingInfo` | User billing information |
| `paymentMethod` | `'paypal'` | Selected payment method |
| `agreeTerms` | `boolean` | Terms acceptance flag |
| `orderId` | `string \| null` | PayPal order ID (if any) |
| `paymentSuccess` | `boolean` | Payment completion status |
| `processing` | `boolean` | Payment processing flag |
| `coupon` | `string` | Coupon code (UI only, not implemented) |

### **Computed Values (useMemo)**

1. **availablePlans**: Filters pricing data by current segment and billing cycle
2. **selectedPlan**: Finds plan matching current `planName` in `availablePlans`
3. **subtotal**: Numeric price from `selectedPlan.price`
4. **taxes**: Currently hardcoded to 0 (placeholder)
5. **total**: `subtotal + taxes`

---

## 🔐 Authentication Flow

### **Authentication Checking**

**Method:** `validateAuthenticationAsync()` from `src/app/lib/auth.ts`

**Process:**
1. Checks if token exists in `localStorage` (`salescentri_token`)
2. Validates token expiration (using `expiresAt`)
3. Makes request to profile API: `https://app.demandintellect.com/app/api/profile.php`
4. Returns `{ isAuthenticated: boolean, profile?: UserProfile }`

**Integration Points:**
- **On Mount**: Checks authentication status
- **Token Params Detection**: When URL contains `token`, `refreshToken`, `expiresAt`
  - `LoginRedirectHandler` component (in root layout) detects and saves tokens
  - Checkout page polls localStorage for saved tokens
  - Validates once tokens are found
- **Step Navigation**: Prevents access to Steps 2-4 if not authenticated

### **Login Redirect Handler**

**Component:** `LoginRedirectHandler` (`src/app/components/LoginRedirectHandler.tsx`)

**Purpose:** Handles token saving after login redirect from external dashboard

**Flow:**
1. Component mounts on every page (included in root layout)
2. Detects token parameters in URL: `token`, `refreshToken`, `expiresAt`
3. Saves tokens to localStorage using `saveTokens()`:
   - `salescentri_token`
   - `salescentri_refreshToken`
   - `salescentri_expiresAt`
4. Cleans URL by removing token parameters
5. Resets query count for authenticated users
6. Sets onboarding/focus mode flags based on preserved chat

**Integration with Checkout:**
- Checkout page detects token params → Polls for saved tokens
- Once tokens are saved by LoginRedirectHandler → Validates authentication
- Allows user to proceed with checkout

### **Login Redirect**

**Method:** `getLoginUrl(true)` from `src/app/lib/loginUtils.ts`

**URL Format:**
```
https://dashboard.salescentri.com/login?source=onboarding-gpt&url={currentUrl}
```

**Features:**
- Preserves current checkout URL for redirect back
- Adds source tracking (`onboarding-gpt`)
- Optionally includes `anonId` from localStorage
- Supports localhost redirect flag

---

## 🔌 API Endpoints

### **1. GET `/api/get-pricing`**
- **Purpose:** Fetch all pricing plans
- **Auth:** Public (no authentication required)
- **Response:**
  ```json
  {
    "data": PlanRow[],
    "updatedAt": string | null
  }
  ```
- **Implementation:** `src/app/api/get-pricing/route.ts`
- **Backend:** Fetches from Firestore `pricing` collection

### **2. POST `/api/paypal/create-order`**
- **Purpose:** Create PayPal checkout order
- **Auth:** Not explicitly protected (but requires valid request)
- **Request Body:**
  ```json
  {
    "segment": "Personal" | "Business",
    "billingCycle": "Monthly" | "Yearly",
    "planName": "string",
    "currency": "USD",
    "amount": number,
    "returnUrl": "string",
    "cancelUrl": "string"
  }
  ```
- **Response:**
  ```json
  {
    "id": "string" // PayPal order token
  }
  ```
- **Implementation:** `src/app/api/paypal/create-order/route.ts`
- **Backend Process:**
  1. Validates PayPal credentials (env vars)
  2. Gets price from Firestore or fallback
  3. Creates PayPal order via SDK
  4. Returns order token

### **3. GET `/api/paypal/success`**
- **Purpose:** Handle PayPal success redirect
- **Query Parameters:**
  - `token`: PayPal order token
  - `PayerID`: PayPal payer ID
  - `orderId`: Custom order ID
  - `amount`: Payment amount
  - `currency`: Currency code
  - `segment`: Plan segment
  - `billingCycle`: Billing cycle
  - `planName`: Plan name
  - `email`: User email (optional)
- **Process:**
  1. Validates required parameters
  2. Creates payment record (in-memory)
  3. Redirects to home page with success params
- **Implementation:** `src/app/api/paypal/success/route.ts`

---

## 🎨 UI/UX Features

### **Progress Tracking**
- Left sidebar shows 4 steps with status:
  - **Active**: Blue background with white text
  - **Completed**: Green background with checkmark
  - **Accessible**: Gray background, clickable
  - **Locked**: Gray background, disabled (if not authenticated)

### **Step Navigation**
- **Next Button**: Advances to next step, marks current as completed
- **Back Button**: Goes to previous step (doesn't unmark completion)
- **Direct Navigation**: Click step in sidebar (if accessible)
- **Auto-scroll**: Smooth scroll to section on navigation

### **Responsive Design**
- Grid layout adapts to screen size
- Sidebars stack on smaller screens
- Mobile-friendly form inputs

### **Loading States**
- Pricing data loading indicator
- Payment processing button state
- Error messages for failed operations

---

## 🔧 Key Utilities & Helpers

### **1. Authentication (`src/app/lib/auth.ts`)**
- `validateAuthenticationAsync()`: Validates user authentication
- `getAuthHeaders()`: Returns Authorization header if authenticated
- `isTokenExpired()`: Checks token expiration
- `getTokens()`: Gets tokens from localStorage

### **2. Login Utils (`src/app/lib/loginUtils.ts`)**
- `getLoginUrl(preserveCurrentUrl)`: Generates login URL with redirect

### **3. Pricing Repository (`src/app/lib/pricingRepo.ts`)**
- `getAllPricing()`: Fetches pricing from Firestore
- `makeDocId()`: Generates Firestore document ID

### **4. PayPal Client (`src/app/api/paypal/_client.ts`)**
- `getPayPalClient()`: Initializes PayPal SDK client
- Supports Sandbox and Production environments

---

## 🔄 Complete User Journey

1. **User lands on checkout page** (`/checkout`)
   - Optionally with query params: `?segment=Business&cycle=Yearly&plan=Premium`
   - Pricing data loads from API
   - Plan selection initialized from URL or defaults

2. **Step 1: Authentication Check**
   - If not authenticated → Shows login form → Redirects to external login
   - If authenticated → Shows "Continue to Billing" button

3. **Step 2: Billing Information**
   - User fills in billing details
   - Clicks "Continue to Payment"

4. **Step 3: Payment Method**
   - Selects PayPal (only option currently)
   - Clicks "Review & Confirm"

5. **Step 4: Review & Confirm**
   - Reviews order summary
   - Checks terms checkbox
   - Clicks "Pay with PayPal"

6. **Payment Processing**
   - Creates PayPal order via API
   - Redirects to PayPal checkout
   - User completes payment on PayPal
   - PayPal redirects back to success handler
   - Success handler stores payment and redirects to home page

---

## ⚠️ Important Notes & Limitations

1. **Payment Storage**: Currently uses in-memory storage (resets on server restart). Should migrate to database in production.

2. **Tax Calculation**: Taxes are hardcoded to 0 (placeholder for future implementation).

3. **Coupon Code**: UI exists but functionality not implemented (only UI state).

4. **Payment Methods**: Only PayPal is implemented. Structure allows for expansion.

5. **Error Handling**: Basic error handling with alerts. Could be enhanced with toast notifications.

6. **Success Page**: Currently redirects to home page with query params. No dedicated success page.

7. **Order Capture**: PayPal order is created with `AUTHORIZE` intent, but capture endpoint exists (`/api/paypal/capture-order`) but may not be fully integrated.

---

## 📝 File Structure Reference

```
src/app/
├── checkout/
│   └── page.tsx                    # Main checkout component
├── api/
│   ├── get-pricing/
│   │   └── route.ts               # Pricing API endpoint
│   └── paypal/
│       ├── _client.ts             # PayPal client setup
│       ├── create-order/
│       │   └── route.ts          # Create PayPal order
│       ├── success/
│       │   └── route.ts          # PayPal success handler
│       └── capture-order/
│           └── route.ts          # Order capture (if needed)
├── lib/
│   ├── auth.ts                    # Authentication utilities
│   ├── loginUtils.ts              # Login URL generator
│   └── pricingRepo.ts             # Pricing data access
└── hooks/
    └── usePricingData.ts          # Pricing data hook (alternative)
```

---

## 🚀 Future Enhancements (Potential)

1. **Persistent Payment Storage**: Use database (Postgres, Supabase, or Vercel KV)
2. **Tax Calculation**: Integrate tax calculation API based on country
3. **Coupon System**: Implement discount code functionality
4. **Multiple Payment Methods**: Add credit card, Stripe, etc.
5. **Success Page**: Dedicated success page with order confirmation
6. **Email Notifications**: Send confirmation emails on successful payment
7. **Order History**: Track and display user's order history
8. **Subscription Management**: Allow users to manage subscriptions

---

## 📌 Summary

The checkout page implements a **well-structured, multi-step checkout process** with:
- ✅ Strong authentication gating
- ✅ Clear step-by-step progression
- ✅ PayPal integration
- ✅ Responsive UI
- ✅ Error handling
- ⚠️ Some features marked as placeholders (taxes, coupons)
- ⚠️ In-memory payment storage (needs database)

The code is modular, with clear separation of concerns and reusable utilities for authentication and payment processing.

