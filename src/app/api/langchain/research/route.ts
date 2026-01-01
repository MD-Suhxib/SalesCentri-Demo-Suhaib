// Langchain Research API Route
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
// Auth removed for anonymous access to research endpoint
import { UserProfile } from '../../../lib/auth';
import { researchAgent } from '../../../lib/langchain/researchAgent';
import { ragSystem } from '../../../lib/langchain/ragSystem';

interface ResearchRequest {
  query: string;
  taskType?: 'research' | 'company-analysis' | 'lead-generation' | 'icp-development';
  options?: {
    enableWeb?: boolean;
    enableRAG?: boolean;
    maxResults?: number;
    companyWebsite?: string;
  };
  onboardingData?: {
    userRole?: string;
    salesObjective?: string;
    companyWebsite?: string;
    immediateGoal?: string;
  };
}

const handleResearch = async (request: NextRequest) => {
  try {
    const { 
      query, 
      taskType = 'research',
      options = {},
      onboardingData
    }: ResearchRequest = await request.json();
    
    if (!query) {
      return NextResponse.json({ 
        error: 'Query is required' 
      }, { status: 400 });
    }

    // Get user profile from auth
    const userProfile = (request as any).userProfile as UserProfile;

    let result;

    switch (taskType) {
      case 'company-analysis':
        const website = options.companyWebsite || userProfile?.organization.website;
        if (!website) {
          return NextResponse.json({ 
            error: 'Company website is required for company analysis' 
          }, { status: 400 });
        }
        result = await researchAgent.analyzeCompany(website, query, {
          userRole: userProfile?.user.job_title || userProfile?.user.role,
          salesObjective: userProfile?.organization.industry,
          companyWebsite: userProfile?.organization.website,
          immediateGoal: query,
        });
        break;

      case 'lead-generation':
        const leadOnboardingData = onboardingData || {
          userRole: userProfile?.user.job_title || userProfile?.user.role,
          salesObjective: userProfile?.organization.industry,
          companyWebsite: userProfile?.organization.website,
          immediateGoal: query
        };
        result = await researchAgent.generateLeads(leadOnboardingData);
        break;

      case 'icp-development':
        const icpOnboardingData = onboardingData || {
          userRole: userProfile?.user.job_title || userProfile?.user.role,
          salesObjective: userProfile?.organization.industry,
          companyWebsite: userProfile?.organization.website
        };
        result = await researchAgent.researchICP(icpOnboardingData);
        break;

      default:
        result = await researchAgent.researchWithRAG(query, {
          enableWeb: options.enableWeb ?? true,
          enableRAG: options.enableRAG ?? true,
          maxSearchResults: options.maxResults ?? 5,
          taskType: taskType as any
        });
    }

    return NextResponse.json({ 
      result: result.answer,
      sources: result.sources,
      searchQueries: result.searchQueries,
      taskType: result.taskType,
      timestamp: result.timestamp
    });

  } catch (error) {
    console.error('Research error:', error);
    return NextResponse.json({ 
      error: 'Research failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
};

export const POST = handleResearch;
