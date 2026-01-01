/**
 * Context Merger Utilities
 * Handles merging of instructions and context from previous batches
 */

export interface ContextSummary {
  batchIndex: number;
  rowsProcessed: number;
  keyFindings: string[];
  summary: string;
}

/**
 * Merge original prompt with batch-specific instructions
 */
export function mergeInstructions(
  originalPrompt: string,
  batchInstructions: string[] = []
): string {
  if (batchInstructions.length === 0) {
    return originalPrompt;
  }

  const mergedInstructions = [
    `ORIGINAL TASK: ${originalPrompt}`,
    ...batchInstructions.map((inst, idx) => `\nADDITIONAL INSTRUCTION (Batch ${idx + 1}): ${inst}`),
  ].join('\n');

  return mergedInstructions;
}

/**
 * Extract key findings from LLM response
 */
export function extractKeyFindings(text: string, maxFindings: number = 5): string[] {
  if (!text) return [];

  const findings = text
    .split('\n')
    .filter((line) => line.trim().startsWith('-') || line.trim().startsWith('•'))
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter((line) => line.length > 0)
    .slice(0, maxFindings);

  return findings;
}

/**
 * Build context summary from previous batch results
 */
export function buildContextSummary(
  previousResults: Record<string, string | null>,
  batchIndex: number,
  rowsProcessed: number
): ContextSummary {
  const summary: ContextSummary = {
    batchIndex,
    rowsProcessed,
    keyFindings: [],
    summary: '',
  };

  // Extract key findings from the primary model's results
  const primaryResult = previousResults?.gpt4o || previousResults?.gemini;
  if (primaryResult) {
    summary.keyFindings = extractKeyFindings(primaryResult);
  }

  // Build summary text
  const findingsText =
    summary.keyFindings.length > 0
      ? summary.keyFindings.map((f) => `- ${f}`).join('\n')
      : 'No specific findings extracted';

  summary.summary = `
PREVIOUS BATCH SUMMARY (Batch ${batchIndex}):
- Rows Analyzed: ${rowsProcessed}
- Key Findings:
${findingsText}

This batch should build upon these findings and look for similar patterns or related companies.
`;

  return summary;
}

/**
 * Format previous results for use as context in prompt
 */
export function formatPreviousResultsForContext(
  results: Record<string, string | null>,
  modelName: string = 'GPT-4o'
): string {
  const resultText = results?.gpt4o || results?.gemini || '';

  if (!resultText) {
    return '';
  }

  return `
PREVIOUS BATCH ANALYSIS (${modelName}):
${resultText}

Now analyze this batch using the same methodology as the previous batch.
Maintain consistency with the findings above.
`;
}

/**
 * Merge batch results for display
 */
export function mergeBatchResults(
  previousResults: Record<string, string | null> | null,
  currentResults: Record<string, string | null>,
  batchIndex: number
): Record<string, string | null> {
  if (!previousResults || batchIndex === 0) {
    return currentResults;
  }

  // For batch N+1, append to previous results
  const merged: Record<string, string | null> = {};

  Object.keys(currentResults).forEach((model) => {
    const prevResult = previousResults[model] || '';
    const currResult = currentResults[model] || '';

    if (prevResult && currResult) {
      merged[model] = `${prevResult}\n\n---\n\nBATCH ${batchIndex + 1}:\n${currResult}`;
    } else if (currResult) {
      merged[model] = currResult;
    } else if (prevResult) {
      merged[model] = prevResult;
    } else {
      merged[model] = null;
    }
  });

  return merged;
}

/**
 * Create a cumulative summary across all batches
 */
export function createCumulativeSummary(
  allBatchResults: Record<number, Record<string, string | null>>,
  totalRows: number,
  batchSize: number
): string {
  const totalBatches = Object.keys(allBatchResults).length;
  const totalProcessed = totalBatches * batchSize;

  return `
CUMULATIVE RESEARCH SUMMARY
==========================
- Total Rows Analyzed: ${Math.min(totalProcessed, totalRows)} of ${totalRows}
- Total Batches Processed: ${totalBatches}
- Batch Size: ${batchSize} rows per batch

FINDINGS ACROSS ALL BATCHES:
${Object.entries(allBatchResults)
  .map(
    ([batchIdx, results]) =>
      `
Batch ${parseInt(batchIdx) + 1}:
${results?.gpt4o?.split('\n').slice(0, 5).join('\n') || 'No results'}
...`
  )
  .join('\n')}

For complete details, review individual batch results above.
`;
}

/**
 * Check if context was properly preserved
 */
export function checkContextPreservation(
  currentResults: Record<string, string | null>,
  previousQuery: string
): boolean {
  if (!currentResults) {
    return false;
  }

  // Simple check: does the current result reference previous analysis?
  const resultText = currentResults?.gpt4o || currentResults?.gemini || '';
  const contextKeywords = [
    'previous',
    'earlier',
    'previous batch',
    'consistent',
    'similar',
    'unlike',
    'contrast',
  ];

  const hasContextReference = contextKeywords.some((keyword) =>
    resultText.toLowerCase().includes(keyword)
  );

  return hasContextReference;
}

/**
 * Validate instruction merging
 */
export function validateInstructionMerge(
  merged: string,
  original: string,
  additions: string[]
): boolean {
  // Check that original is present
  if (!merged.includes(original)) {
    console.warn('⚠️ Original instruction not found in merged result');
    return false;
  }

  // Check that additions are present
  const missingAdditions = additions.filter((add) => !merged.includes(add));
  if (missingAdditions.length > 0) {
    console.warn('⚠️ Some additions missing from merged result:', missingAdditions);
    return false;
  }

  return true;
}
