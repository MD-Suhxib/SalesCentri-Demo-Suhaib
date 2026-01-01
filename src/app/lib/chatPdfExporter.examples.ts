/**
 * Example Usage of Chat PDF Exporter
 * 
 * This file demonstrates various ways to use the chat PDF export functionality
 */

import { 
  exportChatToPdf, 
  exportResearchBotToPdf, 
  exportMultipleConversationsToPdf,
  ChatMessage 
} from '@/app/lib/chatPdfExporter';

// Example 1: Simple research bot conversation export
export function exportSingleConversation() {
  const userQuery = "What are the latest trends in AI technology?";
  const botResponse = `# AI Technology Trends 2025

## Key Developments

1. **Large Language Models**: Continued advancement in reasoning capabilities
2. **Multimodal AI**: Integration of text, image, and audio processing
3. **Edge AI**: Deployment of AI models on edge devices
4. **AI Safety**: Focus on alignment and responsible AI development

## Market Impact

The AI market is expected to reach $1.8 trillion by 2030...`;

  exportResearchBotToPdf(userQuery, botResponse, 'ai_trends_research.pdf');
}

// Example 2: Custom messages format
export function exportCustomMessages() {
  const messages: ChatMessage[] = [
    {
      role: 'User',
      message: 'Can you analyze the competitive landscape for SaaS companies?',
      timestamp: '10:30 AM'
    },
    {
      role: 'Bot',
      message: `# SaaS Competitive Landscape Analysis

## Market Leaders
- Salesforce: CRM market leader
- Microsoft: Office 365 dominance
- Adobe: Creative software monopoly

## Emerging Players
- Notion: Workspace collaboration
- Figma: Design collaboration
- Canva: Democratized design tools

## Key Trends
1. AI integration across platforms
2. No-code/low-code solutions
3. Industry-specific vertical SaaS
4. Data privacy and security focus`,
      timestamp: '10:31 AM'
    },
    {
      role: 'User',
      message: 'What about pricing strategies?',
      timestamp: '10:32 AM'
    },
    {
      role: 'Bot',
      message: `# SaaS Pricing Strategy Analysis

## Common Models
1. **Freemium**: Free tier with paid upgrades
2. **Tiered Pricing**: Multiple feature levels
3. **Usage-Based**: Pay per API call/storage
4. **Per-Seat**: Per user pricing

## Best Practices
- Start with simple pricing
- Offer annual discounts
- Provide enterprise custom pricing
- Test pricing regularly`,
      timestamp: '10:33 AM'
    }
  ];

  exportChatToPdf(messages, {
    fileName: 'saas_analysis_conversation.pdf',
    colors: {
      user: '#0070f3',
      bot: '#00b894',
      text: '#2d3748'
    }
  });
}

// Example 3: Multiple research conversations
export function exportMultipleResearchSessions() {
  const conversations = [
    {
      userQuery: "Analyze the fintech market in Southeast Asia",
      botResponse: `# Fintech Market Analysis - Southeast Asia

## Market Size
The Southeast Asian fintech market reached $132 billion in 2024...

## Key Players
- GrabPay (Singapore)
- GoPay (Indonesia)
- TrueMoney (Thailand)

## Growth Drivers
1. High mobile penetration
2. Large unbanked population
3. Government support for digital payments`,
      timestamp: '9:00 AM'
    },
    {
      userQuery: "What are the regulatory challenges?",
      botResponse: `# Regulatory Landscape - SEA Fintech

## Country-Specific Regulations

### Singapore
- Monetary Authority of Singapore (MAS) sandbox
- Payment Services Act 2019

### Indonesia
- Bank Indonesia regulation
- OJK oversight for lending

### Thailand
- Bank of Thailand digital currency initiatives
- Regulatory sandbox program`,
      timestamp: '9:15 AM'
    }
  ];

  exportMultipleConversationsToPdf(conversations, 'fintech_research_sessions.pdf');
}

// Example 4: Advanced customization
export function exportWithCustomStyling() {
  const messages: ChatMessage[] = [
    {
      role: 'User',
      message: 'Generate a market research report for electric vehicles'
    },
    {
      role: 'Bot',
      message: `# Electric Vehicle Market Research Report

## Executive Summary
The global EV market is experiencing unprecedented growth...

## Market Segmentation
- Battery Electric Vehicles (BEV): 65% market share
- Plug-in Hybrid Electric Vehicles (PHEV): 25% market share
- Hybrid Electric Vehicles (HEV): 10% market share

## Regional Analysis
### North America
- Tesla dominance
- Growing charging infrastructure
- Government incentives

### Europe
- Volkswagen Group leadership
- Strict emission regulations
- High adoption rates

### Asia-Pacific
- BYD and Chinese manufacturers
- Largest market by volume
- Government support policies`
    }
  ];

  exportChatToPdf(messages, {
    fileName: 'ev_market_research.pdf',
    pageWidth: 210,
    pageHeight: 297,
    margin: {
      top: 25,
      right: 25,
      bottom: 25,
      left: 25
    },
    fontSize: {
      role: 14,
      message: 11
    },
    colors: {
      user: '#2563eb',
      bot: '#059669',
      text: '#1f2937'
    },
    lineHeight: 1.6
  });
}

// Example 5: Button click handler for React components
export function createExportHandler(userQuery: string, botResponse: string) {
  return () => {
    try {
      exportResearchBotToPdf(userQuery, botResponse);
      console.log('Export completed successfully');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };
}

// Example 6: Export with error handling
export async function safeExportToPdf(messages: ChatMessage[], fileName?: string) {
  try {
    // Validate input
    if (!messages || messages.length === 0) {
      throw new Error('No messages provided for export');
    }

    // Filter out empty messages
    const validMessages = messages.filter(msg => 
      msg.message && msg.message.trim().length > 0
    );

    if (validMessages.length === 0) {
      throw new Error('No valid messages found for export');
    }

    // Export with fallback filename
    exportChatToPdf(validMessages, {
      fileName: fileName || `research_export_${Date.now()}.pdf`
    });

    return { success: true, message: 'PDF exported successfully' };
  } catch (error) {
    console.error('PDF export error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown export error'
    };
  }
}
