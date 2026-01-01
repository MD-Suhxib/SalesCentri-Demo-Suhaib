import { NextRequest, NextResponse } from 'next/server';
import {
  createResearchSession,
  getResearchSession,
  updateResearchSession,
  storeResultsInSession,
  completeResearchSession,
  abandonResearchSession,
  pauseResearchSession,
  resumeResearchSession,
} from '../../lib/sessionManager';

/**
 * POST /api/research-session/create - Create a new research session
 */
async function handleCreateSession(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, originalPrompt, fileMetadata } = body;

    if (!originalPrompt || !fileMetadata) {
      return NextResponse.json(
        { error: 'Missing required fields: originalPrompt, fileMetadata' },
        { status: 400 }
      );
    }

    const sessionId = await createResearchSession(
      userId || 'guest',
      originalPrompt,
      fileMetadata
    );

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Research session created successfully',
    });
  } catch (error) {
    console.error('❌ Error creating session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/research-session/:sessionId - Retrieve a research session
 */
async function handleGetSession(request: NextRequest, sessionId: string) {
  try {
    const session = await getResearchSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('❌ Error retrieving session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/research-session/:sessionId/update-progress - Update session progress
 */
async function handleUpdateProgress(request: NextRequest, sessionId: string) {
  try {
    const body = await request.json();
    const { batchIndex, processedUpTo, currentResults, newInstructions } = body;

    if (currentResults === undefined) {
      return NextResponse.json(
        { error: 'Missing required field: currentResults' },
        { status: 400 }
      );
    }

    await storeResultsInSession(sessionId, batchIndex, currentResults, newInstructions || '');

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Session progress updated',
    });
  } catch (error) {
    console.error('❌ Error updating session progress:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update progress' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/research-session/:sessionId/complete - Mark session as completed
 */
async function handleCompleteSession(request: NextRequest, sessionId: string) {
  try {
    await completeResearchSession(sessionId);

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Session marked as completed',
    });
  } catch (error) {
    console.error('❌ Error completing session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete session' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/research-session/:sessionId/abandon - Mark session as abandoned
 */
async function handleAbandonSession(request: NextRequest, sessionId: string) {
  try {
    await abandonResearchSession(sessionId);

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Session marked as abandoned',
    });
  } catch (error) {
    console.error('❌ Error abandoning session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to abandon session' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/research-session/:sessionId/pause - Pause a session
 */
async function handlePauseSession(request: NextRequest, sessionId: string) {
  try {
    await pauseResearchSession(sessionId);

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Session paused',
    });
  } catch (error) {
    console.error('❌ Error pausing session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to pause session' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/research-session/:sessionId/resume - Resume a paused session
 */
async function handleResumeSession(request: NextRequest, sessionId: string) {
  try {
    await resumeResearchSession(sessionId);

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Session resumed',
    });
  } catch (error) {
    console.error('❌ Error resuming session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to resume session' },
      { status: 500 }
    );
  }
}

/**
 * Main route handler that dispatches to specific handlers
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const sessionId = pathParts[4];
  const action = pathParts[5];

  // Route: /api/research-session/create
  if (!sessionId || sessionId === 'create') {
    return handleCreateSession(request);
  }

  // Route: /api/research-session/:sessionId/update-progress
  if (action === 'update-progress') {
    return handleUpdateProgress(request, sessionId);
  }

  // Route: /api/research-session/:sessionId/complete
  if (action === 'complete') {
    return handleCompleteSession(request, sessionId);
  }

  // Route: /api/research-session/:sessionId/abandon
  if (action === 'abandon') {
    return handleAbandonSession(request, sessionId);
  }

  // Route: /api/research-session/:sessionId/pause
  if (action === 'pause') {
    return handlePauseSession(request, sessionId);
  }

  // Route: /api/research-session/:sessionId/resume
  if (action === 'resume') {
    return handleResumeSession(request, sessionId);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

/**
 * GET handler for retrieving sessions
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const sessionId = pathParts[4];

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }

  return handleGetSession(request, sessionId);
}
