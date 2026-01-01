# How to Restore OTP and Form Steps

This guide explains how to restore the email/phone collection, OTP verification, and objective selection steps that were hidden in `src/app/components/LeadCaptureModal.tsx`.

## Overview

During the implementation, we:

- **Hidden** steps 1-4 (email/phone collection, OTP verification, objective selection, success screen)
- **Skipped** directly to step 5 (voice agent widget)
- **Hidden** progress indicators
- **Modified** the header to always show "Talk to Our Team"

All the code is still present in the file, just conditionally hidden with `false &&` conditions.

---

## Step-by-Step Restoration Guide

### 1. Restore Step Initialization

**Location:** Line ~54-55

**Current Code:**

```typescript
// Initialize step to 5 (voice agent) since we skip form steps
const [step, setStep] = useState<Step>(5);
```

**Change To:**

```typescript
const [step, setStep] = useState<Step>(1);
```

---

### 2. Remove Auto-Skip Logic

**Location:** Lines ~123-135

**Current Code:**

```typescript
// Auto-skip to step 5 (voice agent) when modal opens
useEffect(() => {
  if (isOpen) {
    // Skip directly to step 5 (voice agent widget)
    setStep(5);
    // Reset call tracking to ensure button shows
    setCallTracking({
      leadId: null,
      callStartTime: null,
      callEndTime: null,
      isCallActive: false,
    });
  } else {
    // Reset step when modal closes
    setStep(1);
  }
}, [isOpen]);
```

**Change To:**

```typescript
// Remove this entire useEffect block, or keep it but remove the setStep(5) logic
// If you want to reset step on close, keep only:
useEffect(() => {
  if (!isOpen) {
    setStep(1);
  }
}, [isOpen]);
```

---

### 3. Restore Progress Indicators

**Location:** Lines ~819-841

**Current Code:**

```typescript
{/* Progress indicator - HIDDEN */}
{false && step < 4 && (
  // ... progress indicator code ...
)}
{false && step === 5 && (
  // ... progress indicator code ...
)}
```

**Change To:**

```typescript
{/* Progress indicator */}
{step < 4 && (
  <div className="flex items-center justify-center gap-2 px-5 py-3 bg-black/50 border-b border-blue-500/10">
    {[1, 2, 3].map((s) => (
      <div
        key={s}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          s === step ? 'w-10 bg-gradient-to-r from-blue-500 to-blue-600' : s < step ? 'w-6 bg-blue-500/60' : 'w-6 bg-gray-700'
        }`}
      />
    ))}
  </div>
)}
{step === 5 && (
  <div className="flex items-center justify-center gap-2 px-5 py-3 bg-black/50 border-b border-blue-500/10">
    {[1, 2, 3, 4, 5].map((s) => (
      <div
        key={s}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          s === 5 ? 'w-10 bg-gradient-to-r from-blue-500 to-blue-600' : 'w-6 bg-blue-500/60'
        }`}
      />
    ))}
  </div>
)}
```

---

### 4. Restore Step 1: Email/Phone Collection

**Location:** Line ~848

**Current Code:**

```typescript
{/* Step 1: Contact Info + CAPTCHA - HIDDEN */}
{false && step === 1 && (
  // ... form code ...
)}
```

**Change To:**

```typescript
{/* Step 1: Contact Info + CAPTCHA */}
{step === 1 && (
  // ... form code (already there, just remove false &&) ...
)}
```

---

### 5. Restore Step 2: OTP Verification

**Location:** Line ~946

**Current Code:**

```typescript
{/* Step 2: OTP Verification - HIDDEN */}
{false && step === 2 && (
  // ... OTP form code ...
)}
```

**Change To:**

```typescript
{/* Step 2: OTP Verification */}
{step === 2 && (
  // ... OTP form code (already there, just remove false &&) ...
)}
```

---

### 6. Restore Step 3: Objective Selection

**Location:** Line ~995

**Current Code:**

```typescript
{/* Step 3: Objective Selection - HIDDEN */}
{false && step === 3 && (
  // ... objective selector code ...
)}
```

**Change To:**

```typescript
{/* Step 3: Objective Selection */}
{step === 3 && (
  // ... objective selector code (already there, just remove false &&) ...
)}
```

---

### 7. Restore Step 4: Success Screen

**Location:** Line ~1034

**Current Code:**

```typescript
{/* Step 4: Success - HIDDEN */}
{false && step === 4 && (
  // ... success screen code ...
)}
```

**Change To:**

```typescript
{/* Step 4: Success */}
{step === 4 && (
  // ... success screen code (already there, just remove false &&) ...
)}
```

---

### 8. Restore Dynamic Header

**Location:** Lines ~643-648

**Current Code:**

```typescript
<h2 id="modal-title" className="text-xl font-bold text-white">
  Talk to Our Team
</h2>
<p className="text-blue-100 text-xs mt-1">
  Start a voice conversation with our AI assistant
</p>
```

**Change To:**

```typescript
<h2 id="modal-title" className="text-xl font-bold text-white">
  {step === 4 ? 'Success!' : step === 5 ? 'Talk to Our Team' : "Let's Talk"}
</h2>
<p className="text-blue-100 text-xs mt-1">
  {step === 1 && 'Verified by Google reCAPTCHA'}
  {step === 2 && 'Verify your identity'}
  {step === 3 && 'Tell us how we can help'}
  {step === 4 && 'We\'ll be in touch soon!'}
  {step === 5 && 'Start a voice conversation with our AI assistant'}
</p>
```

---

### 9. Update Step 3 Submit Handler

**Location:** Lines ~273-278 (in `handleStep3Submit`)

**Current Code:**

```typescript
if (response.ok) {
  const data = await response.json();
  setCallTracking((prev) => ({ ...prev, leadId: data.leadId }));
  setStep(4);
  // Transition to Step 5 after 2 seconds instead of closing
  setTimeout(() => {
    setStep(5);
  }, 2000);
}
```

**Optional:** If you want the original behavior (close modal after success), change to:

```typescript
if (response.ok) {
  const data = await response.json();
  setCallTracking((prev) => ({ ...prev, leadId: data.leadId }));
  setStep(4);
  // Close modal after showing success for 2 seconds
  setTimeout(() => {
    handleClose();
  }, 2000);
}
```

Or keep the current flow (show success then go to voice agent).

---

## Quick Summary

To restore everything, you need to:

1. ✅ Change `useState<Step>(5)` to `useState<Step>(1)` (line ~55)
2. ✅ Remove or modify the auto-skip `useEffect` (lines ~123-135)
3. ✅ Remove `false &&` from all step conditionals:
   - Step 1: Line ~848
   - Step 2: Line ~946
   - Step 3: Line ~995
   - Step 4: Line ~1034
4. ✅ Remove `false &&` from progress indicators (lines ~819, ~831)
5. ✅ Restore dynamic header text (lines ~643-648)

---

## What Each Step Does

- **Step 1:** Collects corporate email and phone number, validates with reCAPTCHA, sends OTP
- **Step 2:** User enters 6-digit OTP code, auto-verifies when complete
- **Step 3:** User selects their objective/use case from predefined options
- **Step 4:** Success confirmation screen
- **Step 5:** Voice agent widget (ElevenLabs)

---

## Notes

- All the form validation, API calls, and error handling code is **already present** and functional
- The code was hidden using `false &&` conditions, so removing those will restore full functionality
- The watermark hiding code for the ElevenLabs widget will remain active regardless
- The widget container height (225px) and styling will remain as configured

---

## Testing After Restoration

After making these changes, test the flow:

1. Open the modal → Should show Step 1 (email/phone form)
2. Enter email/phone → Should go to Step 2 (OTP)
3. Enter OTP → Should go to Step 3 (objective selection)
4. Select objective → Should go to Step 4 (success)
5. After 2 seconds → Should go to Step 5 (voice agent)

All steps should work with their original validation and API integration intact.
