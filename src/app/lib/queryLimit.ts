// Query limit tracking utilities
export const QUERY_LIMIT = 3;
export const QUERY_COUNT_KEY = 'salescentri_query_count';

export const getQueryCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const count = sessionStorage.getItem(QUERY_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
};

export const incrementQueryCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const newCount = getQueryCount() + 1;
  sessionStorage.setItem(QUERY_COUNT_KEY, newCount.toString());
  return newCount;
};

export const resetQueryCount = (): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(QUERY_COUNT_KEY);
};

export const hasReachedLimit = (): boolean => {
  return getQueryCount() >= QUERY_LIMIT;
};

export const canMakeQuery = (): boolean => {
  return !hasReachedLimit();
};
