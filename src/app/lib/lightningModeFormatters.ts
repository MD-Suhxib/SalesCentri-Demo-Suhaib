import { CompanyProfile, GrowthChallenge, PersonalizationInputs, ICPPreview } from '../types/lightningMode';

/**
 * Format company profile for chat display
 */
export function formatCompanyProfile(profile: CompanyProfile): string {
  let content = `🔍 **Company Profile Research Complete**\n\n`;
  
  if (profile.companyName) {
    content += `**Company:** ${profile.companyName}\n`;
  }
  
  if (profile.website) {
    content += `**Website:** ${profile.website}\n`;
  }
  
  if (profile.industry) {
    content += `**Industry:** ${profile.industry}\n`;
  }
  
  if (profile.employeeSize) {
    content += `**Employee Size:** ${profile.employeeSize}\n`;
  }
  
  if (profile.revenueBand) {
    content += `**Revenue Band:** ${profile.revenueBand}\n`;
  }
  
  if (profile.jobTitle) {
    content += `**Job Title:** ${profile.jobTitle}\n`;
  }
  
  if (profile.targetGeography) {
    content += `**Target Geography:** ${profile.targetGeography}\n`;
  }
  
  if (profile.techStack && profile.techStack.length > 0) {
    content += `**Tech Stack:** ${profile.techStack.join(', ')}\n`;
  }
  
  if (profile.productsServices && profile.productsServices.length > 0) {
    content += `**Products & Services:** ${profile.productsServices.join(', ')}\n`;
  }
  
  if (profile.description) {
    content += `\n**Description:** ${profile.description}\n`;
  }
  
  content += `\n---\n\n`;
  content += `## 🎯 Next Steps - Let's Personalize Your Approach\n\n`;
  content += `Based on your company profile, I need a few more details to create your personalized sales strategy:\n\n`;
  content += `### Q2. Which product or service are you focusing on?\n`;
  content += `*(Customized from auto-derived list + growth goal)*\n\n`;
  content += `Please specify which products or services you want to focus on for lead generation.\n\n`;
  content += `### Q3. Outreach Preference\n\n`;
  content += `How do you prefer to reach out to prospects?\n`;
  content += `• **Email**\n`;
  content += `• **Phone** (Cold Call / SMS / WhatsApp)\n`;
  content += `• **Social Media** (LinkedIn, FB, X, Insta)\n`;
  content += `• **Other** (please specify)\n\n`;
  content += `### Q4. Lead Handoff Preference\n\n`;
  content += `How would you like to receive qualified leads?\n`;
  content += `• **SalesCentri LMS**\n`;
  content += `• **Own LMS/CRM**\n`;
  content += `• **Email**\n`;
  content += `• **Website Form**\n`;
  content += `• **Phone / WhatsApp**\n`;
  content += `• **Other** (please specify)\n\n`;
  content += `Please provide your answers in the chat, and I'll create your personalized sales strategy!`;
  
  return content;
}

/**
 * Format growth challenge question
 */
export function formatGrowthChallengeQuestion(): string {
  return `**What is your main growth challenge?**\n\nPlease select one:\n• Generate more qualified leads\n• Improve conversion rates\n• Expand to new markets/regions\n• Increase revenue from existing customers\n• Other (please specify)\n\nType your response in the chat.`;
}

/**
 * Format personalization questions
 */
export function formatPersonalizationQuestions(profile: CompanyProfile, challenge: GrowthChallenge): string {
  let content = `📝 **Personalization Questions**\n\n`;
  content += `Based on your company profile and growth challenge, I need a few more details:\n\n`;
  
  content += `**1. Product/Service Focus:**\n`;
  content += `What specific products or services do you want to focus on for lead generation?\n\n`;
  
  content += `**2. Outreach Preference:**\n`;
  content += `How do you prefer to reach out to prospects?\n`;
  content += `• Email\n`;
  content += `• Phone\n`;
  content += `• LinkedIn\n`;
  content += `• Social Media\n`;
  content += `• Other (please specify)\n\n`;
  
  content += `**3. Lead Handoff Preference:**\n`;
  content += `How would you like to receive qualified leads?\n`;
  content += `• SalesCentri LMS\n`;
  content += `• Your CRM\n`;
  content += `• Email\n`;
  content += `• Website Form\n`;
  content += `• WhatsApp\n`;
  content += `• Other (please specify)\n\n`;
  
  content += `Please provide your answers in the chat.`;
  
  return content;
}

/**
 * Format ICP preview
 */
export function formatICPPreview(icp: ICPPreview): string {
  let content = `🎯 **Your Ideal Customer Profile (ICP)**\n\n`;
  
  content += `**Target Personas:**\n`;
  if (icp.personas.jobTitles.length > 0) {
    content += `• Job Titles: ${icp.personas.jobTitles.join(', ')}\n`;
  }
  if (icp.personas.industries.length > 0) {
    content += `• Industries: ${icp.personas.industries.join(', ')}\n`;
  }
  if (icp.personas.regions.length > 0) {
    content += `• Regions: ${icp.personas.regions.join(', ')}\n`;
  }
  
  content += `\n**Example Target Accounts:**\n`;
  icp.targetAccounts.slice(0, 3).forEach(account => {
    content += `• ${account.companyName} (${account.industry}, ${account.size}, ${account.location})\n`;
  });
  
  content += `\n**Example Target Leads:**\n`;
  icp.targetLeads.slice(0, 3).forEach(lead => {
    content += `• ${lead.name} - ${lead.title} at ${lead.company} (${lead.location})\n`;
  });
  
  content += `\n**Channel Fit Recommendations:**\n`;
  if (icp.channelFit.email) content += `• Email outreach\n`;
  if (icp.channelFit.linkedin) content += `• LinkedIn outreach\n`;
  if (icp.channelFit.phone) content += `• Phone outreach\n`;
  if (icp.channelFit.social) content += `• Social media outreach\n`;
  
  if (icp.channelFit.recommendations.length > 0) {
    content += `\n**Additional Recommendations:**\n`;
    icp.channelFit.recommendations.forEach(rec => {
      content += `• ${rec}\n`;
    });
  }
  
  content += `\n**Growth Playbook:**\n`;
  content += `${icp.growthPlaybook.strategy}\n\n`;
  content += `**Key Tactics:**\n`;
  icp.growthPlaybook.tactics.forEach(tactic => {
    content += `• ${tactic}\n`;
  });
  
  content += `\n**Recommended Tools:**\n`;
  icp.growthPlaybook.tools.forEach(tool => {
    content += `• ${tool}\n`;
  });
  
  content += `\n---\n\n`;
  content += `**Does this ICP look good to you?** Type "Yes" to proceed or "No" to make adjustments.`;
  
  return content;
}

/**
 * Format activation options
 */
export function formatActivationOptions(): string {
  let content = `🚀 **Lightning Mode Activated!**\n\n`;
  content += `Your personalized sales toolkit is now ready:\n\n`;
  
  content += `**✅ Unlocked Features:**\n`;
  content += `• Pre-built outreach sequences tailored to your ICP\n`;
  content += `• Verified lead recommendations with contact details\n`;
  content += `• Competitive insights and market analysis\n`;
  content += `• Automated follow-up sequences\n`;
  content += `• Lead scoring and qualification tools\n`;
  content += `• Performance tracking and analytics\n\n`;
  
  content += `**🎯 Next Steps:**\n`;
  content += `1. Review your personalized outreach templates\n`;
  content += `2. Start generating leads with our AI-powered tools\n`;
  content += `3. Track your results in the analytics dashboard\n`;
  content += `4. Optimize your approach based on performance data\n\n`;
  
  content += `**💡 Pro Tips:**\n`;
  content += `• Use the lead generation tool to find new prospects\n`;
  content += `• Customize your outreach messages for better response rates\n`;
  content += `• Set up automated follow-up sequences to nurture leads\n`;
  content += `• Monitor your performance and adjust your strategy\n\n`;
  
  content += `Ready to start generating leads? Let me know how I can help!`;
  
  return content;
}

/**
 * Format error message
 */
export function formatErrorMessage(error: string): string {
  return `❌ **Error:** ${error}\n\nPlease try again or contact support if the issue persists.`;
}

/**
 * Format loading message
 */
export function formatLoadingMessage(step: string): string {
  return `⏳ **${step}**\n\nPlease wait while I process your request...`;
}

/**
 * Format success message
 */
export function formatSuccessMessage(message: string): string {
  return `✅ **Success:** ${message}`;
}

/**
 * Format confirmation message
 */
export function formatConfirmationMessage(question: string, options: string[]): string {
  let content = `**${question}**\n\n`;
  options.forEach((option, index) => {
    content += `${index + 1}. ${option}\n`;
  });
  content += `\nPlease type your choice or response.`;
  return content;
}
