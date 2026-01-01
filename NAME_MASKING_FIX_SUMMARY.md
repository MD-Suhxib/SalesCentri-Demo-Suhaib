# Name Masking Improvements - Fix Unwanted Word Masking

## Problem Summary

The Multi-GPT name masking system was overly aggressive, incorrectly masking legitimate business terms including:
- **Company names**: "Goldman Sachs" → "Goldman ****"
- **Product names**: "Microsoft Office" → "Microsoft ****"
- **Technology terms**: "Deep Learning" → "Deep ****"
- **Industry terms**: "Investment Banking" → "Investment ****"
- **Location names**: "Salt Lake" → "Salt ****"

## Root Cause

The original regex pattern `(/\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g)` matched **ALL** two-capitalized-word phrases without proper entity recognition, treating every such phrase as a potential person name.

## Solution Implemented

### 1. **Expanded Business Terms Exclusion List** (Lines 17-86)

Added 100+ major business terms including:
- **Major Companies**: Goldman Sachs, Morgan Stanley, Bank America, Wells Fargo, Credit Suisse, Deutsche Bank, Capital One, American Express, Microsoft Office, Google Analytics, Salesforce Platform, Adobe Creative, Oracle Database, General Electric, American Airlines, etc.
- **Technology Terms**: Deep Learning, Natural Language, Computer Vision, Quantum Computing, Neural Network, Cloud Storage, Software Development, Database Management, etc.
- **Industry Terms**: Investment Banking, Private Equity, Venture Capital, Asset Management, Market Research, Consumer Electronics, etc.
- **Extended Locations**: Salt Lake, Las Vegas, Hong Kong, New Delhi, Cape Town, Costa Rica, South Africa, South Korea, New Zealand, etc.

### 2. **Company Context Detection** (Lines 88-124)

Added `hasCompanyContext()` function that prevents masking when:
- **Company suffixes detected**: Inc, LLC, Corp, Ltd, Co, Corporation, Incorporated, Limited, Company
- **"at [Company]" pattern**: "Working at Apple Computer"
- **Company keywords nearby**: company, firm, corporation, organization, business, enterprise, vendor, partner, client, supplier
- **Product/service indicators**: platform, software, service, product, solution, system, tool, application, website, portal

Example: `"Working at Apple Computer"` → Context detected, NOT masked

### 3. **Strong Person-Name Signal Detection** (Lines 126-149)

Added `hasStrongPersonNameSignal()` function that only masks when clear evidence exists:
- **Contact labels**: "Contact:", "Rep:", "Manager:", "Lead:"
- **Action verbs**: "spoke with", "met with", "interviewed"
- **Honorifics**: Dr., Mr., Mrs., Ms., Prof.
- **Attribution**: "reported by", "written by", "authored by"

Example: `"Contact: John Smith"` → Strong signal detected, MASK as "Contact: John ****"

### 4. **Refined Masking Logic** (Lines 182-260)

**Pattern 1a** - Strong Person Indicators (Line 210):
```typescript
// ONLY mask with clear evidence
const strongPersonPattern = /\b((?:Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.|Contact:|Rep:|Manager:|Lead:|spoke with|met with|interviewed)\s+)([A-Z][a-z]+)(?:\s+[A-Z]\.?)?\s+([A-Z][a-z]+)\b/gi;
```

**Pattern 1b** - Generic Two-Word Patterns (Line 224):
```typescript
// Default: DON'T mask unless we're sure it's a person
// Checks: business terms, company context, table headers, person signals
if (hasStrongPersonNameSignal(maskedText, offset)) {
  return `${firstName} ****`;
}
return match; // Default: preserve
```

**Pattern 2** - Table Masking (Line 262):
- Now checks column headers to identify person-specific columns
- Only masks in columns labeled: "contact", "person", "maker", "representative", "rep", "manager", "lead", "stakeholder", "executive"
- Preserves company names in "Company Name", "Partner", "Vendor", "Client" columns

**Pattern 4** - Contextual Names (Line 313):
- Added company context check
- Requires job title after name (e.g., "John Smith, CEO")
- Default behavior: DON'T mask unless clear person context

### 5. **Enhanced Validation** (Lines 380-420)

Expanded exclusion list in validation function to include all major companies, products, and industry terms to reduce false positive warnings.

## Test Results

All 10 tests pass successfully:

✅ **Test 1**: Company names (Goldman Sachs, Morgan Stanley) - NOT masked  
✅ **Test 2**: Product names (Microsoft Office, Google Analytics) - NOT masked  
✅ **Test 3**: Technology terms (Deep Learning, Natural Language) - NOT masked  
✅ **Test 4**: Person with "Contact:" indicator - MASKED correctly  
✅ **Test 5**: Person with "Dr." title - MASKED correctly  
✅ **Test 6**: Industry terms (Investment Banking, Private Equity) - NOT masked  
✅ **Test 7**: Location names (Salt Lake City, Hong Kong) - NOT masked  
✅ **Test 8**: Company context ("at Apple Computer") - NOT masked  
✅ **Test 9**: Person with job title prefix - MASKED correctly  
✅ **Test 10**: Validation passes for business terms  

## Key Behavioral Changes

### Before:
```
"Goldman Sachs" → "Goldman ****" ❌
"Microsoft Office" → "Microsoft ****" ❌
"Deep Learning" → "Deep ****" ❌
"John Smith" → "John ****" (always masked)
```

### After:
```
"Goldman Sachs" → "Goldman Sachs" ✅ (preserved)
"Microsoft Office" → "Microsoft Office" ✅ (preserved)
"Deep Learning" → "Deep Learning" ✅ (preserved)
"John Smith" → "John Smith" ✅ (preserved - no clear person signal)
"Contact: John Smith" → "Contact: John ****" ✅ (masked - strong signal)
"Dr. John Smith" → "Dr. John ****" ✅ (masked - title indicator)
```

## Philosophy Change

**Old approach**: "Mask everything except known exclusions" (high false positive rate)  
**New approach**: "Only mask with clear person-name evidence" (low false positive rate)

This shifts the system from **overly cautious** (breaking business content) to **intelligently selective** (protecting real names while preserving business data).

## Files Modified

- `src/app/lib/namesMasking.ts` - Core masking logic
- `src/app/lib/test-name-masking.ts` - Comprehensive tests (new)

## Integration Points

This fix automatically applies to all Multi-GPT responses through:
- `src/app/lib/researchOrchestration/modelCalls.ts` (line 52, 222, 399)
- All models: GPT-4o, Gemini, Perplexity, Groq, Grok, DeepSeek

## Performance Impact

Minimal - added context checks only trigger when two capitalized words are detected, with early returns for common business terms.

## Future Considerations

For further improvements, consider:
1. **NER Library Integration**: Use `compromise` or `natural` for entity type detection
2. **Company Name Database**: Query APIs like Clearbit or OpenCorporates
3. **Caching**: Cache frequently-checked terms to improve performance
4. **Machine Learning**: Train model to distinguish person vs organization names

## Summary

The Multi-GPT name masking system now correctly preserves business terminology while still protecting personal privacy. The system requires **strong person-name signals** before masking, dramatically reducing false positives.

✅ **No more unwanted word masking**  
✅ **Real person names still protected**  
✅ **Business content preserved intact**
