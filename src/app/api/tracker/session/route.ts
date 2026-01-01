// Tracker Session API Route
import { NextRequest, NextResponse } from 'next/server';

interface TrackerSessionRequest {
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_referrer?: string;
  utm_referrer_domain?: string;
  utm_referrer_path?: string;
  utm_referrer_query_params?: string;
  utm_referrer_fragment?: string;
  utm_referrer_host?: string;
}

const handleCreateTrackerSession = async (request: NextRequest) => {
  try {
    const utmData: TrackerSessionRequest = await request.json().catch(() => ({}));
    

    
    // Call external API to create anonymous user (same as chat system)
    const baseURL = 'https://app.demandintellect.com/app/api';
    const url = `${baseURL}/auth/anon.php`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(utmData), // Include UTM data in the request
    });
    
    if (!response.ok) {
      // Fallback: generate local anonymous ID if external API fails
      const fallbackId = `tracker_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      return NextResponse.json({
        anon_id: fallbackId,
        created_at: new Date().toISOString(),
        source: 'local_fallback'
      });
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      anon_id: data.anon_id,
      created_at: new Date().toISOString(),
      source: 'external_api'
    });
    
  } catch {
    // Fallback: generate local anonymous ID
    const fallbackId = `tracker_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    return NextResponse.json({
      anon_id: fallbackId,
      created_at: new Date().toISOString(),
      source: 'local_fallback'
    });
  }
};

export const POST = handleCreateTrackerSession;
