// Anonymous User Creation API Route
import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleCreateAnonymousUser = async (_request: NextRequest) => {
  try {
    // Call external API to create anonymous user
    const baseURL = 'https://app.demandintellect.com/app/api';
    const url = `${baseURL}/auth/anon.php`; // Fixed URL with .php extension
    
    console.log('🔐 CREATING ANONYMOUS USER: Calling external API at', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('🔐 ANON USER API RESPONSE:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText);
      
      // Fallback: generate local anonymous ID if external API fails
      const fallbackId = `tracker_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
      console.log('🔄 Using fallback anon ID:', fallbackId);
      return NextResponse.json({
        anon_id: fallbackId,
        source: 'local_fallback'
      });
    }
    
    const data = await response.json();
    console.log('✅ ANONYMOUS USER CREATED: Success');
    
    return NextResponse.json({
      anon_id: data.anon_id,
      source: 'external_api'
    });
    
  } catch (error) {
    console.error('Error creating anonymous user:', error);
    
    // Fallback: generate local anonymous ID
    const fallbackId = `local_anon_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    return NextResponse.json({
      anon_id: fallbackId,
      source: 'local_fallback'
    });
  }
};

export const POST = handleCreateAnonymousUser;
