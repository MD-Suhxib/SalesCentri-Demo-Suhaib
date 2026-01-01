// Fallback messages when API calls fail or no results are found

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createCompanyAnalysisFallback = (_website: string): string => {
  return `Company analysis is temporarily unavailable. Please try again later.`;
};

export const icpFallbackMessage = (): string => {
  return `ICP development is temporarily unavailable. Please try again later.`;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createICPFallback = (_onboardingData: {
  userRole?: string;
  salesObjective?: string;
  companyWebsite?: string;
  immediateGoal?: string;
}): string => {
  return `ICP development is temporarily unavailable. Please try again later.`;
};

export const icpCreationFallbackMessage = (): string => {
  return `ICP creation is temporarily unavailable. Please try again later.`;
};

export const createLeadsGenerationFallback = (): string => {
  return `Lead generation is temporarily unavailable. Please try again later.`;
};

export const createTabularLeadsFallback = (): string => {
  return `Lead generation results are temporarily unavailable. Please try again later.`;
};


