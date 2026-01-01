import { NextRequest, NextResponse } from 'next/server';
import { getSearchUsage, forceAllowSearch, resetSearchUsage } from '../../lib/searchUsageControl';

export async function GET(request: NextRequest) {
  try {
    const usageData = getSearchUsage();
    const canSearch = forceAllowSearch();
    
    return NextResponse.json({
      success: true,
      quotaStatus: {
        canSearch,
        count: usageData.count,
        quota: usageData.quota,
        tier: usageData.tier,
        remaining: usageData.quota - usageData.count
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'reset') {
      resetSearchUsage();
      return NextResponse.json({
        success: true,
        message: 'Search quota reset successfully'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use "reset" to reset quota.'
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
