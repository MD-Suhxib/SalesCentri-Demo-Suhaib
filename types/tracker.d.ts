export {};

declare global {
  type TrackerConfig = {
    apiBaseUrl?: string;
    debug?: boolean;
    autoTrack?: {
      pageViews?: boolean;
      clicks?: boolean;
      scrolls?: boolean;
      formSubmissions?: boolean;
      outboundLinks?: boolean;
      fileDownloads?: boolean;
      conversions?: boolean;
      exitBeacons?: boolean;
    };
  };

  type TrackerApi = {
    init: (config?: TrackerConfig) => void;
    trackEvent: (eventType: string, data?: Record<string, unknown>) => void;
    trackFunnelEvent: (
      eventType: string,
      data?: Record<string, unknown>
    ) => void;
    trackPageView: (url?: string | null, title?: string | null) => void;
    trackConversion: (type: string, data?: Record<string, unknown>) => void;
    setUserId: (userId: string, token?: string | null) => void;
    getSessionId: () => string | null;
    getUserId: () => string | null;
    flush: () => Promise<void> | void;
    redirectTo: (url: string, params?: Record<string, string>) => void;
    utils: {
      buildRedirectUrl: (
        targetUrl: string,
        params?: Record<string, string>
      ) => string;
      getScrollDepth: () => number;
      generateUUID: () => string;
    };
  };

  interface Window {
    tracker?: TrackerApi;
    salescentriTrackerReady?: boolean;
  }
}
