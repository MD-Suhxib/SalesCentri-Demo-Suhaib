// Tracker Exit API Route
import { NextRequest, NextResponse } from 'next/server';

interface ExitRequest {
  anon_id?: string;
  user_token?: string;
  user_id?: number;
  page_url?: string;
}

const handleTrackExit = async (request: NextRequest) => {
  try {
    const exitData: ExitRequest = await request.json();
    

    
    // Call external tracking API
    const baseURL = 'https://app.demandintellect.com/app/api';
    const url = `${baseURL}/tracker/exit`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exitData),
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: 'Failed to track exit' },
        { status: response.status }
      );
    }
    
  } catch {
    return NextResponse.json(
      { error: 'Failed to track exit' },
      { status: 500 }
    );
  }
};

export const POST = handleTrackExit;
