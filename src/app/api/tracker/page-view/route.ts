// Tracker Page View API Route
import { NextRequest, NextResponse } from 'next/server';

interface PageViewRequest {
  anon_id?: string;
  user_token?: string;
  user_id?: number;
  page_url: string;
  referrer?: string;
  duration_seconds?: number;
}

const handleTrackPageView = async (request: NextRequest) => {
  try {
    const pageViewData: PageViewRequest = await request.json();
    

    
    // Call external tracking API
    const baseURL = 'https://app.demandintellect.com/app/api';
    const url = `${baseURL}/tracker/page-view`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageViewData),
    });
    
    if (response.ok) {
      const data = await response.json();
      
      return NextResponse.json(data);
         } else {
       return NextResponse.json(
         { error: 'Failed to track page view' },
         { status: response.status }
       );
     }
     
   } catch (error) {
     console.error('Page view tracking error:', error);
     return NextResponse.json(
       { error: 'Failed to track page view' },
       { status: 500 }
     );
   }
};

export const POST = handleTrackPageView;
