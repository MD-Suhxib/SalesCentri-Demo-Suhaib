# Quick Start: Incremental Excel Batch Research

## 🚀 For Developers: Getting Started

### What's New?
Your SalesCentri MultiGPT now supports **batch processing Excel files** with persistent context across batches. Users upload a file, process the first batch of rows, then click "Continue" to process more batches while maintaining context from previous findings.

### Files Modified/Created

| File | Type | Purpose |
|------|------|---------|
| `src/app/lib/sessionManager.ts` | NEW | Firestore session CRUD |
| `src/app/lib/contextMerger.ts` | NEW | Context & instruction merging |
| `src/app/lib/researchOrchestration/incremental.ts` | NEW | Incremental orchestration |
| `src/app/api/research-session/route.ts` | NEW | Session endpoints (CRUD, lifecycle) |
| `src/app/api/research-session/batch/route.ts` | NEW | Batch metadata endpoints |
| `src/app/api/multi-research-ai/route.ts` | MODIFIED | Added dual-mode routing |
| `src/app/lib/researchOrchestration/types.ts` | MODIFIED | Extended ResearchRequest |
| `src/app/blocks/ResearchComparison/ResearchComparison.tsx` | MODIFIED | Added batch state & UI |
| `src/app/blocks/ResearchComparison/ResearchHandlers.ts` | MODIFIED | Added batch tracking |

---

## 🧪 Testing the Feature

### Test 1: Basic Batch Processing
```bash
1. Navigate to MultiGPT Research page
2. Upload Excel file with 100+ rows
3. Enter query: "Find AI companies"
4. Click "Research"
5. Wait for first 30 rows to process
6. Verify "Continue with Batch 2" button appears
7. Click button
8. Verify next 30 rows processing with context
```

### Test 2: Batch Instructions
```bash
1. After Batch 1 completes
2. Click "Add Instructions"
3. Enter: "Focus on funding status"
4. Click "Continue with Batch 2"
5. Verify instruction merged in results
```

### Test 3: Analytics Tracking
```bash
1. Upload Excel file
2. Process Batch 1
3. Check DevTools → Network → filter by "event"
4. Look for: excel_batch_research_started
5. Click "Continue"
6. Look for: excel_batch_continue_clicked
7. Process Batch 2
8. Look for: excel_batch_research_completed (for batch 2)
```

### Test 4: Normal Queries Still Work
```bash
1. Clear the uploaded file
2. Enter query: "Find SaaS companies"
3. Click "Research"
4. Verify no batch UI appears
5. Results display normally
6. No "Continue" button
```

---

## 🔍 Key Code Locations

### Session Management
```typescript
// Create a session
import { createResearchSession } from '@/app/lib/sessionManager';
const sessionId = await createResearchSession(userId, prompt, fileMetadata);

// Store batch results
import { storeResultsInSession } from '@/app/lib/sessionManager';
await storeResultsInSession(sessionId, batchIndex, results, instructions);

// Get session
import { getResearchSession } from '@/app/lib/sessionManager';
const session = await getResearchSession(sessionId);
```

### Context Merging
```typescript
// Merge instructions
import { mergeInstructions } from '@/app/lib/contextMerger';
const merged = mergeInstructions(originalPrompt, batchInstructions);

// Check context preservation
import { checkContextPreservation } from '@/app/lib/contextMerger';
const preserved = checkContextPreservation(newResults, originalPrompt);
```

### Incremental Research
```typescript
// Route to incremental orchestrator
import { orchestrateIncrementalResearch } from '@/app/lib/researchOrchestration/incremental';
const results = await orchestrateIncrementalResearch(request);
```

---

## 📊 Request/Response Examples

### First Batch Request
```json
{
  "query": "Find AI companies",
  "category": "market_analysis",
  "depth": "basic",
  "excel_data": ["Company A", "Company B", "Company C", ...],
  "selected_models": { "gpt4o": true, "gemini": true },
  "isContinuation": false,
  "currentBatch": ["Company A", "Company B", ..., "Company 30"],
  "batchIndex": 0
}
```

### Second Batch Request
```json
{
  "query": "Find AI companies",
  "category": "market_analysis",
  "depth": "basic",
  "selected_models": { "gpt4o": true, "gemini": true },
  "isContinuation": true,
  "sessionId": "uuid-xxx",
  "batchIndex": 1,
  "currentBatch": ["Company 31", "Company 32", ..., "Company 60"],
  "previousResults": {
    "gpt4o": "Found 8 AI companies...",
    "gemini": "Key findings: 65% B2B..."
  },
  "mergedInstructions": "ORIGINAL: Find AI companies\nBATCH: Focus on funding"
}
```

### Response (Same for Both)
```json
{
  "gpt4o": "Analyzed companies 31-60...",
  "gemini": "Found patterns matching...",
  "perplexity": null,
  "contextPreserved": true,
  "batchIndex": 1,
  "timestamp": 1704067200000
}
```

---

## 🎯 State Flow in Frontend

```
Initial State
    ↓
User uploads Excel file
    ↓
setExcelData() triggers useEffect
    ↓
Calculate batches:
  - totalBatches = Math.ceil(excelData.length / batchSize)
  - currentBatchData = excelData.slice(0, batchSize)
  - isBatchResearch = true
    ↓
User clicks "Research"
    ↓
handleResearch() called with currentBatchData
    ↓
Results display
    ↓
showContinueButton = true (if not last batch)
    ↓
User clicks "Continue with Batch 2"
    ↓
handleContinueNextBatch() called
    ↓
State updated:
  - currentBatchIndex = 1
  - currentBatchData = excelData.slice(batchSize, batchSize*2)
  - previousResults = stored
    ↓
handleResearch() called with isContinuation=true
    ↓
API called with enhanced request
    ↓
Context preservation verified
    ↓
Session progress updated in Firestore
    ↓
New results display
    ↓
Continue button appears if not last batch
```

---

## 🔐 Important: Error Scenarios

### What Happens If...

#### User closes browser mid-batch?
- Session saved in Firestore with `status: 'active'`
- User can resume later by providing sessionId
- Previous batch results preserved

#### Model call fails in batch 2?
- Failed model returns `null`
- Other models still return results
- Session still saved
- User can continue

#### User adds conflicting instructions?
- Instructions merged with original prompt
- LLM receives: "Original task... Additional: user instruction"
- Context preserved regardless

#### Last batch processed?
- Session status set to 'completed'
- Continue button disappears
- All batch results in Firestore

---

## 📋 Debugging Checklist

- [ ] Check browser console for batch logs (search "📊")
- [ ] Verify session created in Firestore → research_sessions collection
- [ ] Check DevTools Network → /api/research-session/create returns sessionId
- [ ] Verify currentBatch contains correct rows
- [ ] Check contextPreserved field in response
- [ ] Verify excel_batch_research_started event in analytics
- [ ] Verify excel_batch_continue_clicked event on button click
- [ ] Check previous results passed in continuation request
- [ ] Verify mergedInstructions contains both original + batch instruction
- [ ] Check Firestore batchResults field has indexed entries (0, 1, 2...)

---

## 🚨 Common Issues & Solutions

### Issue: Continue button doesn't appear
**Solution**: Check if `currentBatchIndex >= totalBatches - 1`. Should only show on non-final batches.

### Issue: Batch 2 results don't reference Batch 1 findings
**Solution**: Verify `previousResults` passed in request. Check `contextPreserved` in response.

### Issue: Analytics events not tracked
**Solution**: Verify `trackCustomEvent('excel_batch_research_started')` called. Check if event name matches.

### Issue: Session not saving in Firestore
**Solution**: Check Firebase credentials. Verify `sessionId` generated. Check Firestore permissions.

### Issue: Wrong batch size
**Solution**: Verify `batchSize` state variable. Default is 30 rows. Check slice() calculation.

---

## 📈 Performance Tips

1. **Monitor Firestore writes**: Track calls to `storeResultsInSession()`
2. **Optimize batch size**: 30 rows = ~30-60s per batch (reasonable UX)
3. **Cache context**: Previous findings cached in component state, not refetched
4. **Parallel LLM calls**: All models called simultaneously per batch
5. **Clean up old sessions**: Delete old `research_sessions` docs periodically

---

## 🔗 Related Documentation

- **Architecture Deep Dive**: See `INCREMENTAL_EXCEL_BATCH_IMPLEMENTATION.md`
- **API Reference**: Check inline JSDoc comments in `sessionManager.ts`
- **Type Definitions**: See `src/app/lib/researchOrchestration/types.ts`
- **Previous Analysis**: See `INCREMENTAL_EXCEL_RESEARCH_ARCHITECTURE.md`

---

## ✅ Verification Checklist

Run through these to verify implementation is working:

- [ ] New files exist: sessionManager.ts, contextMerger.ts, incremental.ts
- [ ] New API routes exist: /api/research-session/*, /api/research-session/batch/*
- [ ] ResearchComparison.tsx has batch state variables
- [ ] ResearchHandlers.ts has excel_batch_* events
- [ ] multi-research-ai route has isContinuation check
- [ ] Upload Excel file → batch calculation works
- [ ] Process batch 1 → results display
- [ ] Continue button appears (if multiple batches)
- [ ] Click continue → batch 2 processes
- [ ] Context preserved in batch 2 (check response)
- [ ] Analytics events tracked (check DevTools)
- [ ] Firestore session updated (check console)

---

**Ready to use!** Test with a real Excel file and proceed to production. 🚀
