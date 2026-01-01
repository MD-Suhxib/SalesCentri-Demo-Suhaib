import { NextRequest, NextResponse } from 'next/server';
import { DecisionMakerExtractor } from '../../lib/decisionMakerExtractor';
import { ContactDiscoveryService } from '../../lib/contactDiscoveryService';

export async function POST(request: NextRequest) {
  try {
    const { researchResults } = await request.json();
    
    if (!researchResults) {
      return NextResponse.json({
        success: false,
        error: 'Research results are required'
      }, { status: 400 });
    }

    // Extract decision makers from research results
    const decisionMakers = DecisionMakerExtractor.extractDecisionMakers(researchResults);
    
    // Discover additional contact information
    const contactDiscovery = await ContactDiscoveryService.discoverContacts(decisionMakers, {
      includeEmail: true,
      includeLinkedIn: true,
      maxContactsPerCompany: 3,
      priority: 'accuracy'
    });

    // Format the results
    const formattedDecisionMakers = DecisionMakerExtractor.formatDecisionMakers(decisionMakers);
    const formattedContacts = ContactDiscoveryService.formatDiscoveredContacts(contactDiscovery);

    return NextResponse.json({
      success: true,
      data: {
        decisionMakers,
        contactDiscovery,
        formattedDecisionMakers,
        formattedContacts,
        summary: {
          companiesFound: decisionMakers.length,
          totalDecisionMakers: decisionMakers.reduce((sum, company) => sum + company.decisionMakers.length, 0),
          contactsDiscovered: contactDiscovery.contacts.length,
          sourcesUsed: contactDiscovery.sources.length
        }
      }
    });

  } catch (error) {
    console.error('Decision maker extraction error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Decision Maker Extraction API',
    usage: 'Send POST request with researchResults in body to extract decision makers and discover contacts'
  });
}
