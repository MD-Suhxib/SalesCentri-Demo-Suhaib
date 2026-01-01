// Tracker Event API Route
import { NextRequest, NextResponse } from 'next/server';

interface EventRequest {
  anon_id?: string;
  user_token?: string;
  user_id?: number;
  event_type: string;
  page_url?: string;
  page_section?: string;
  meta?: Record<string, unknown>;
}

const handleTrackEvent = async (request: NextRequest) => {
  try {
    const eventData: EventRequest = await request.json();
    

    
    // Call external tracking API
    const baseURL = 'https://app.demandintellect.com/app/api';
    const url = `${baseURL}/tracker/event`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: response.status }
      );
    }
    
  } catch {
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
};

export const POST = handleTrackEvent;
