// Utility function to generate login URL with conditional query parameters
// If preserveCurrentUrl is true, preserves the current page URL and query parameters
export const getLoginUrl = (
  preserveCurrentUrl: boolean = false,
  explicitReturnUrl?: string
): string => {
  const baseUrl = 'https://dashboard.salescentri.com/login';
  const searchParams = new URLSearchParams();

  // Always add the source parameter
  searchParams.append('source', 'onboarding-gpt');

  // If an explicit return URL is provided, it takes priority
  if (explicitReturnUrl) {
    searchParams.append('url', explicitReturnUrl);
  } else
  // Preserve current URL and query parameters if requested
  if (preserveCurrentUrl && typeof window !== 'undefined') {
    const currentUrl = window.location.href;
    searchParams.append('url', currentUrl);
    console.log('🔐 Preserving current URL for redirect:', currentUrl);
  } else {
    // Default fallback URL
    searchParams.append('url', 'https://salescentri.com/solutions/psa-suite-one-stop-solution');
  }

  // Also provide a `redirect` parameter for compatibility with dashboard login flows
  // (some endpoints use `redirect=/path` rather than `url=https://...`)
  try {
    const urlValue = searchParams.get('url');
    if (urlValue) {
      const parsed = new URL(urlValue);
      // If returning to salescentri.com, prefer relative redirect to reduce open-redirect risk.
      // Otherwise, fall back to full URL.
      if (parsed.hostname === 'salescentri.com' || parsed.hostname === 'www.salescentri.com') {
        searchParams.append('redirect', `${parsed.pathname}${parsed.search}`);
      } else {
        searchParams.append('redirect', urlValue);
      }
    }
  } catch {
    // ignore malformed URL
  }

  // Add anonId if it exists in localStorage
  if (typeof window !== 'undefined') {
    const anonId = localStorage.getItem('tracker_anon_id');
    if (anonId) {
      searchParams.append('anonId', anonId);
    }
  }

  // Check for REQUIRE_LOCALHOST_REDIRECT environment variable OR localhost return URLs
  let requireLocalhostRedirect = process.env.NEXT_PUBLIC_REQUIRE_LOCALHOST_REDIRECT === 'yes';

  if (!requireLocalhostRedirect) {
    const urlToCheck =
      explicitReturnUrl ||
      (preserveCurrentUrl && typeof window !== 'undefined' ? window.location.href : undefined);

    if (urlToCheck) {
      try {
        const parsed = new URL(urlToCheck);
        if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
          requireLocalhostRedirect = true;
        }
      } catch {
        // ignore malformed URL
      }
    }
  }

  if (requireLocalhostRedirect) {
    searchParams.append('requireLocalhostRedirect', 'yes');
  }

  return `${baseUrl}?${searchParams.toString()}`;
};
