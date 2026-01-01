# Batch Processing Flow - Quick Reference

## User Experience Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. UPLOAD EXCEL FILE                                        │
│    - User uploads Excel with 100+ rows                      │
│    - System calculates: 4 batches of 30 rows                │
│    - Shows: "Batch 1 of 4"                                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. BATCH 1 PROCESSING                                       │
│    - Models analyze first 30 rows                           │
│    - Results stream into columns                            │
│    - Progress bar shows 25% complete                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. BATCH 1 COMPLETE ✅                                      │
│    - Loader disappears                                      │
│    - Green message shows:                                   │
│      "✅ Batch 1 Analysis Complete"                         │
│    - "Review the analysis before continuing..."             │
│    - Results displayed in columns                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. USER REVIEW                                              │
│    - User can:                                              │
│      • Review findings from Batch 1                         │
│      • Add instructions for next batch (optional)           │
│      • Export current results (optional)                    │
│      • Continue to Batch 2                                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼                    ▼
  [Continue]          [Add Instructions]
        │                    │
        └────────┬───────────┘
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. BATCH 2 STARTS                                           │
│    - Next 30 rows (batch 2) are processed                   │
│    - Previous context preserved                            │
│    - Uses same model configuration                         │
│    - Progress bar shows 50% complete                        │
│    - Shows: "Batch 2 of 4"                                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. BATCH 2 COMPLETE ✅                                      │
│    - Results append to existing analysis                    │
│    - New green message shows:                               │
│      "✅ Batch 2 Analysis Complete"                         │
│    - Continue button available for Batch 3                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
        [Continue to Batch 3...]
                  │
        [Continue to Batch 4...]
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. ALL BATCHES COMPLETE ✅                                  │
│    - Final message shows:                                   │
│      "✅ All Batches Complete!"                             │
│    - "Successfully processed 4 batches (120 rows total)"    │
│    - All results available for:                             │
│      • Review                                               │
│      • Export/Download                                      │
│      • Analysis                                             │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Results-First Display
- Each batch's results display immediately after completion
- Clear visual confirmation: ✅ Batch N Analysis Complete
- Green success message for emphasis

### 2. User-Driven Continuation
- **NO automatic progression** to next batch
- User must explicitly click "Continue with Batch N+1"
- Allows for review, adjustments, or export between batches

### 3. Context Preservation
- Previous batch results passed to next batch
- Models maintain consistency across batches
- Original query preserved for reference

### 4. Optional Instructions
- Users can add special instructions between batches
- "Add Instructions" button allows customization
- Instructions applied to next batch only

### 5. Clear Progress Tracking
- Batch counter: "Batch X of Y"
- Visual progress bar
- Completion messages at each stage
- Final summary on completion

## Configuration

### Batch Size
**Location:** `ResearchComparison.tsx` Line 95
```typescript
const [batchSize, setBatchSize] = useState<number>(30); // Default 30 rows per batch
```
**Changeable:** Yes, can be made user-configurable

### Triggers

**Continue Button Appears:**
```
- Batch research is active (isBatchResearch === true)
- Not on last batch (currentBatchIndex < totalBatches - 1)
- Results exist (at least one model has output)
- Not currently loading (!loading)
```

**Continue Button Logic:**
```typescript
{isBatchResearch && totalBatches > 0 && !loading && 
 currentBatchIndex < totalBatches - 1 && 
 Object.values(results).some(r => r) && (
  // Show button
)}
```

## Error Handling

### If a batch fails:
1. Error message shown in UI
2. Continue button disabled
3. User can:
   - Try again (hidden in current impl)
   - Adjust query/settings
   - Go back

### If results are empty:
1. Continue button still shows
2. User can continue or stop
3. Previous results context still applies

## Analytics Tracking

Each batch tracks:
- `excel_batch_research_completed` event
- Duration (ms)
- Success status
- Total rows processed
- Models used
- Current batch index
- Total batches
- Whether results obtained

