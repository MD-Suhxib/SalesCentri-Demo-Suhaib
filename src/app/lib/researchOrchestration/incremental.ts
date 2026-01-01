import { ResearchRequest, ResearchResponse } from './types';
import { orchestrateResearch } from './orchestrator';
import {
  mergeInstructions,
  formatPreviousResultsForContext,
  checkContextPreservation,
} from '../contextMerger';

/**
 * Orchestrate incremental research for Excel batches
 * Preserves context from previous batches and merges instructions
 */
export async function orchestrateIncrementalResearch(
  request: ResearchRequest
): Promise<ResearchResponse & {
  contextPreserved?: boolean;
  batchIndex?: number;
  timestamp?: number;
}> {
  console.log('🔄 Starting incremental research for batch:', request.batchIndex);

  // Build enhanced prompt with context from previous batch
  const previousContext = request.previousResults
    ? formatPreviousResultsForContext(request.previousResults as unknown as Record<string, string | null>)
    : '';

  // Merge the original prompt with batch-specific instructions
  const mergedInstructions = mergeInstructions(
    request.originalPrompt || request.query,
    request.mergedInstructions ? [request.mergedInstructions] : []
  );

  // Create enhanced query that includes context from previous batch
  const enhancedQuery = previousContext
    ? `${mergedInstructions}\n\n📌 CONTEXT FROM PREVIOUS BATCH:\n${previousContext}\n\nMaintain consistency with any previous findings. Build upon the analysis pattern established in earlier batches.`
    : mergedInstructions;

  // Create a modified request with the enhanced query
  const enhancedRequest: ResearchRequest = {
    ...request,
    query: enhancedQuery,
    originalPrompt: request.originalPrompt || request.query,
  };

  try {
    // Call the standard orchestrator with enhanced context
    const results = await orchestrateResearch(enhancedRequest);

    // Check if context was preserved
    const contextPreserved = request.isContinuation
      ? checkContextPreservation(results as unknown as Record<string, string | null>, request.originalPrompt || '')
      : false;

    const response = {
      ...results,
      contextPreserved,
      batchIndex: request.batchIndex,
      timestamp: Date.now(),
    };

    console.log('✅ Incremental research completed for batch:', request.batchIndex);

    return response;
  } catch (error) {
    console.error('❌ Incremental research failed:', error);
    throw error;
  }
}

/**
 * Build continuation prompt that includes previous context
 * This is called from prompts.ts but implemented here for batch research
 */
export function buildContinuationPrompt(
  originalPrompt: string,
  currentBatch: string[],
  previousContext: string,
  batchIndex: number
): string {
  return `
${originalPrompt}

CURRENT BATCH INFORMATION:
- Batch Number: ${batchIndex + 1}
- Batch Data Count: ${currentBatch.length} items
- Batch Content: ${currentBatch.join(', ')}

${previousContext}

TASK FOR THIS BATCH:
Analyze the current batch using the same methodology as previous batches.
Look for the same patterns, companies, or insights.
Maintain consistency with findings from earlier batches.
`;
}
