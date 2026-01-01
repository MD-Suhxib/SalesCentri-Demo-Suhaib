import { NextRequest, NextResponse } from 'next/server';
import { getResearchSession } from '../../../lib/sessionManager';

/**
 * GET /api/research-session/batch/:sessionId/:batchIndex - Retrieve a specific batch of rows
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const sessionId = pathParts[5];
    const batchIndex = parseInt(pathParts[6], 10);

    if (!sessionId || isNaN(batchIndex)) {
      return NextResponse.json(
        { error: 'Session ID and batch index are required' },
        { status: 400 }
      );
    }

    // Retrieve session to get file metadata
    const session = await getResearchSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const { batchSize, totalRows } = session.fileMetadata;
    const startRow = batchIndex * batchSize;
    const endRow = Math.min((batchIndex + 1) * batchSize, totalRows);
    const isLastBatch = endRow >= totalRows;

    // Note: Actual row data would need to be retrieved from uploaded file storage
    // For now, we return metadata about the batch
    // In production, integrate with Cloud Storage or S3

    return NextResponse.json({
      success: true,
      batchIndex,
      startRow,
      endRow,
      batchRowCount: endRow - startRow,
      isLastBatch,
      totalRows,
      totalBatches: Math.ceil(totalRows / batchSize),
      message: 'Batch metadata retrieved. Actual row data would be fetched from storage.',
    });
  } catch (error) {
    console.error('❌ Error retrieving batch:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve batch' },
      { status: 500 }
    );
  }
}
