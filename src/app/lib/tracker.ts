// Tracker utility for analytics

export interface TrackerSession {
  anon_id: string;
  created_at: string;
}

export interface TrackerPageView {
  id: number;
  created_at: string;
}

export interface TrackerEvent {
  id: number;
  created_at: string;
}

export interface TrackerExit {
  id: number;
  created_at: string;
}

export interface UTMData {
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_referrer?: string;
  utm_referrer_domain?: string;
  utm_referrer_path?: string;
  utm_referrer_query_params?: string;
  utm_referrer_fragment?: string;
  utm_referrer_host?: string;
}

export interface PageViewData {
  anon_id?: string;
  user_token?: string;
  user_id?: number;
  page_url: string;
  referrer?: string;
  duration_seconds?: number;
}

export interface EventData {
  anon_id?: string;
  user_token?: string;
  user_id?: number;
  event_type: string;
  page_url?: string;
  page_section?: string;
  meta?: Record<string, unknown>;
}

export interface ExitData {
  anon_id?: string;
  user_token?: string;
  user_id?: number;
  page_url?: string;
}

class Tracker {
  private anon_id: string | null = null;
  private sessionStartTime: number | null = null;
  private currentPageStartTime: number | null = null;
  private currentPageUrl: string | null = null;
  private initialized = false;

  constructor() {
    // Don't initialize immediately - wait for client side
  }

  private getUserToken(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem('salescentri_token') || undefined;
  }

  public initialize() {
    if (this.initialized || typeof window === 'undefined') return;
    
    this.initialized = true;
    this.initializeTracker();
  }

  private async initializeTracker() {
    // Try to get existing anon_id from localStorage
    const existingAnonId = localStorage.getItem('tracker_anon_id');
    if (existingAnonId) {
      this.anon_id = existingAnonId;
    } else {
      // Create new session
      await this.createSession();
    }

    // Only start tracking page views if we have an anon_id
    if (this.anon_id) {
      this.startPageViewTracking();
    }
  }

  private async createSession(): Promise<void> {
    try {
      const utmData = this.extractUTMParameters();
      
      // Use local API endpoint for session creation
      const response = await fetch('/api/tracker/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(utmData),
      });

      if (response.ok) {
        const data: TrackerSession = await response.json();
        this.anon_id = data.anon_id;
        localStorage.setItem('tracker_anon_id', data.anon_id);
      } else {
        // Fallback: generate local ID
        const fallbackId = `tracker_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        this.anon_id = fallbackId;
        localStorage.setItem('tracker_anon_id', fallbackId);
      }
    } catch {
      // Fallback: generate local ID
      const fallbackId = `tracker_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      this.anon_id = fallbackId;
      localStorage.setItem('tracker_anon_id', fallbackId);
    }
  }

  private extractUTMParameters(): UTMData {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    
    return {
      referrer: document.referrer || undefined,
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined,
      utm_term: searchParams.get('utm_term') || undefined,
      utm_content: searchParams.get('utm_content') || undefined,
      utm_referrer: document.referrer || undefined,
      utm_referrer_domain: document.referrer ? new URL(document.referrer).hostname : undefined,
      utm_referrer_path: document.referrer ? new URL(document.referrer).pathname : undefined,
      utm_referrer_query_params: document.referrer ? new URL(document.referrer).search : undefined,
      utm_referrer_fragment: document.referrer ? new URL(document.referrer).hash : undefined,
      utm_referrer_host: document.referrer ? new URL(document.referrer).host : undefined,
    };
  }

  private startPageViewTracking() {
    // Track initial page view
    this.trackPageView();

    // Track page changes (for SPA) - only track page views, not exits
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        setTimeout(() => this.trackPageView(), 100); // Track new page view
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  public async trackPageView(): Promise<void> {
    if (!this.anon_id) {
      return;
    }

    const pageUrl = window.location.href;
    const referrer = document.referrer || undefined;
    const userToken = this.getUserToken();
    
    // Calculate duration if we have a previous page
    let duration = 0;
    if (this.currentPageStartTime && this.currentPageUrl) {
      duration = Math.floor((Date.now() - this.currentPageStartTime) / 1000);
    }
    
    // Track the page view
    await this.sendPageView({
      anon_id: this.anon_id,
      user_token: userToken,
      page_url: pageUrl,
      referrer,
      duration_seconds: duration,
    });

    // Update current page tracking
    this.currentPageStartTime = Date.now();
    this.currentPageUrl = pageUrl;
  }

  public async trackEvent(eventData: Omit<EventData, 'anon_id' | 'user_token'>): Promise<void> {
    if (!this.anon_id) return;

    const userToken = this.getUserToken();
    await this.sendEvent({
      ...eventData,
      anon_id: this.anon_id,
      user_token: userToken,
    });
  }

  public async trackExit(): Promise<void> {
    if (!this.anon_id) return;

    const userToken = this.getUserToken();
    await this.sendExit({
      anon_id: this.anon_id,
      user_token: userToken,
      page_url: window.location.href,
    });
  }

  private async sendPageView(data: PageViewData): Promise<void> {
    try {
      const response = await fetch('/api/tracker/page-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

              if (!response.ok) {
          // Silent fail for tracking
        }
          } catch {
        // Silent fail for tracking
      }
  }

  private async sendEvent(data: EventData): Promise<void> {
    try {
      const response = await fetch('/api/tracker/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Silent fail for tracking
      }
    } catch {
      // Silent fail for tracking
    }
  }

  private async sendExit(data: ExitData): Promise<void> {
    try {
      const response = await fetch('/api/tracker/exit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Silent fail for tracking
      }
    } catch {
      // Silent fail for tracking
    }
  }

  // Helper methods for common events
  public async trackButtonClick(buttonId: string, buttonText: string, pageSection?: string): Promise<void> {
    await this.trackEvent({
      event_type: 'button_click',
      page_url: window.location.href,
      page_section: pageSection,
      meta: {
        button_id: buttonId,
        button_text: buttonText,
      },
    });
  }

  public async trackFormSubmit(formId: string, formType: string): Promise<void> {
    await this.trackEvent({
      event_type: 'form_submit',
      page_url: window.location.href,
      meta: {
        form_id: formId,
        form_type: formType,
      },
    });
  }

  public async trackLinkClick(linkUrl: string, linkText: string): Promise<void> {
    await this.trackEvent({
      event_type: 'link_click',
      page_url: window.location.href,
      meta: {
        link_url: linkUrl,
        link_text: linkText,
      },
    });
  }

  public async trackSignup(method: string): Promise<void> {
    await this.trackEvent({
      event_type: 'signup',
      page_url: window.location.href,
      meta: {
        signup_method: method,
      },
    });
  }

  public async trackLogin(method: string): Promise<void> {
    await this.trackEvent({
      event_type: 'login',
      page_url: window.location.href,
      meta: {
        login_method: method,
      },
    });
  }

  public async trackPurchase(amount: number, currency: string = 'USD'): Promise<void> {
    await this.trackEvent({
      event_type: 'purchase',
      page_url: window.location.href,
      meta: {
        amount,
        currency,
      },
    });
  }

  public async trackScroll(depth: number): Promise<void> {
    await this.trackEvent({
      event_type: 'scroll',
      page_url: window.location.href,
      meta: {
        scroll_depth: depth,
      },
    });
  }

  public async trackVideoPlay(videoId: string): Promise<void> {
    await this.trackEvent({
      event_type: 'video_play',
      page_url: window.location.href,
      meta: {
        video_id: videoId,
      },
    });
  }

  public async trackDownload(fileName: string, fileType: string): Promise<void> {
    await this.trackEvent({
      event_type: 'download',
      page_url: window.location.href,
      meta: {
        file_name: fileName,
        file_type: fileType,
      },
    });
  }

  // Journey-specific tracking methods
  public async trackLandingToPSAQuery(): Promise<void> {
    await this.trackEvent({
      event_type: 'landing_to_psa_query',
      page_url: window.location.href,
      meta: {
        journey_step: 'landing_to_psa_query',
      },
    });
  }

  public async trackQuery(queryNumber: number): Promise<void> {
    await this.trackEvent({
      event_type: `query_${queryNumber}`,
      page_url: window.location.href,
      meta: {
        journey_step: `query_${queryNumber}`,
        query_number: queryNumber,
      },
    });
  }

  public async trackQueryLimitReached(): Promise<void> {
    await this.trackEvent({
      event_type: 'query_limit_reached',
      page_url: window.location.href,
      meta: {
        journey_step: 'query_limit_reached',
      },
    });
  }

  public async trackRedirectToLogin(): Promise<void> {
    await this.trackEvent({
      event_type: 'redirect_to_login',
      page_url: window.location.href,
      meta: {
        journey_step: 'redirect_to_login',
      },
    });
  }

  public async trackRedirectFromLogin(): Promise<void> {
    await this.trackEvent({
      event_type: 'redirect_from_login',
      page_url: window.location.href,
      meta: {
        journey_step: 'redirect_from_login',
      },
    });
  }
}

// Create singleton instance
export const tracker = new Tracker();

// Export for use in components
export default tracker; 