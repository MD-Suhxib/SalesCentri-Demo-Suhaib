import { db } from './firestore';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface ResearchSessionState {
  sessionId: string;
  userId: string | 'guest';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  originalPrompt: string;
  currentBatchIndex: number;
  processedUpTo: number;
  previousResults: Record<string, string | null> | null;
  fileMetadata: {
    fileName: string;
    totalRows: number;
    batchSize: number;
    uploadedAt: Timestamp;
  };
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  batchResults: Record<
    number,
    {
      timestamp: Timestamp;
      userInstructions: string;
      results: Record<string, string | null>;
    }
  >;
}

/**
 * Create a new research session for incremental Excel research
 */
export async function createResearchSession(
  userId: string | 'guest',
  originalPrompt: string,
  fileMetadata: {
    fileName: string;
    totalRows: number;
    batchSize: number;
  }
): Promise<string> {
  try {
    const sessionId = uuidv4();
    const now = serverTimestamp();

    const sessionData: ResearchSessionState = {
      sessionId,
      userId,
      createdAt: now as Timestamp,
      updatedAt: now as Timestamp,
      originalPrompt,
      currentBatchIndex: 0,
      processedUpTo: 0,
      previousResults: null,
      fileMetadata: {
        ...fileMetadata,
        uploadedAt: now as Timestamp,
      },
      status: 'active',
      batchResults: {},
    };

    await setDoc(doc(db, 'research_sessions', sessionId), sessionData);
    console.log('✅ Research session created:', sessionId);
    return sessionId;
  } catch (error) {
    console.error('❌ Failed to create research session:', error);
    throw error;
  }
}

/**
 * Retrieve a research session
 */
export async function getResearchSession(
  sessionId: string
): Promise<ResearchSessionState | null> {
  try {
    const docRef = doc(db, 'research_sessions', sessionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as ResearchSessionState;
    } else {
      console.warn('⚠️ Session not found:', sessionId);
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to retrieve research session:', error);
    throw error;
  }
}

/**
 * Update research session progress
 */
export async function updateResearchSession(
  sessionId: string,
  updates: Partial<ResearchSessionState>
): Promise<void> {
  try {
    const docRef = doc(db, 'research_sessions', sessionId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Research session updated:', sessionId);
  } catch (error) {
    console.error('❌ Failed to update research session:', error);
    throw error;
  }
}

/**
 * Store batch results in session
 */
export async function storeResultsInSession(
  sessionId: string,
  batchIndex: number,
  results: Record<string, string | null>,
  userInstructions: string
): Promise<void> {
  try {
    const session = await getResearchSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const batchResults = session.batchResults || {};
    batchResults[batchIndex] = {
      timestamp: serverTimestamp() as Timestamp,
      userInstructions,
      results,
    };

    await updateResearchSession(sessionId, {
      batchResults,
      currentBatchIndex: batchIndex,
      processedUpTo: (batchIndex + 1) * session.fileMetadata.batchSize,
      previousResults: results,
    });

    console.log(
      '✅ Batch results stored in session:',
      sessionId,
      'Batch:',
      batchIndex
    );
  } catch (error) {
    console.error('❌ Failed to store batch results:', error);
    throw error;
  }
}

/**
 * Get results from a specific batch
 */
export async function getSessionBatchResults(
  sessionId: string,
  batchIndex: number
): Promise<Record<string, string | null> | null> {
  try {
    const session = await getResearchSession(sessionId);
    if (!session) {
      return null;
    }

    const batchResult = session.batchResults?.[batchIndex];
    if (batchResult) {
      return batchResult.results;
    }

    return null;
  } catch (error) {
    console.error('❌ Failed to get batch results:', error);
    throw error;
  }
}

/**
 * Mark session as completed
 */
export async function completeResearchSession(sessionId: string): Promise<void> {
  try {
    await updateResearchSession(sessionId, {
      status: 'completed',
    });
    console.log('✅ Research session completed:', sessionId);
  } catch (error) {
    console.error('❌ Failed to complete research session:', error);
    throw error;
  }
}

/**
 * Mark session as abandoned
 */
export async function abandonResearchSession(sessionId: string): Promise<void> {
  try {
    await updateResearchSession(sessionId, {
      status: 'abandoned',
    });
    console.log('✅ Research session abandoned:', sessionId);
  } catch (error) {
    console.error('❌ Failed to abandon research session:', error);
    throw error;
  }
}

/**
 * Pause a session
 */
export async function pauseResearchSession(sessionId: string): Promise<void> {
  try {
    await updateResearchSession(sessionId, {
      status: 'paused',
    });
    console.log('✅ Research session paused:', sessionId);
  } catch (error) {
    console.error('❌ Failed to pause research session:', error);
    throw error;
  }
}

/**
 * Resume a paused session
 */
export async function resumeResearchSession(sessionId: string): Promise<void> {
  try {
    await updateResearchSession(sessionId, {
      status: 'active',
    });
    console.log('✅ Research session resumed:', sessionId);
  } catch (error) {
    console.error('❌ Failed to resume research session:', error);
    throw error;
  }
}
