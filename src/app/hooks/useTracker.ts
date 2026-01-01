import { useCallback } from 'react';
import tracker from '../lib/tracker';

export const useTracker = () => {
  const trackButtonClick = useCallback((
    buttonId: string, 
    buttonText: string, 
    pageSection?: string
  ) => {
    tracker.trackButtonClick(buttonId, buttonText, pageSection);
  }, []);

  const trackFormSubmit = useCallback((
    formId: string, 
    formType: string
  ) => {
    tracker.trackFormSubmit(formId, formType);
  }, []);

  const trackLinkClick = useCallback((
    linkUrl: string, 
    linkText: string
  ) => {
    tracker.trackLinkClick(linkUrl, linkText);
  }, []);

  const trackSignup = useCallback((
    method: string
  ) => {
    tracker.trackSignup(method);
  }, []);

  const trackLogin = useCallback((
    method: string
  ) => {
    tracker.trackLogin(method);
  }, []);

  const trackPurchase = useCallback((
    amount: number, 
    currency: string = 'USD'
  ) => {
    tracker.trackPurchase(amount, currency);
  }, []);

  const trackScroll = useCallback((
    depth: number
  ) => {
    tracker.trackScroll(depth);
  }, []);

  const trackVideoPlay = useCallback((
    videoId: string
  ) => {
    tracker.trackVideoPlay(videoId);
  }, []);

  const trackDownload = useCallback((
    fileName: string, 
    fileType: string
  ) => {
    tracker.trackDownload(fileName, fileType);
  }, []);

  const trackCustomEvent = useCallback((
    eventType: string,
    meta?: Record<string, unknown>,
    pageSection?: string
  ) => {
    tracker.trackEvent({
      event_type: eventType,
      page_url: window.location.href,
      page_section: pageSection,
      meta,
    });
  }, []);

  // Journey-specific tracking methods
  const trackLandingToPSAQuery = useCallback(() => {
    tracker.trackLandingToPSAQuery();
  }, []);

  const trackQuery = useCallback((queryNumber: number) => {
    tracker.trackQuery(queryNumber);
  }, []);

  const trackQueryLimitReached = useCallback(() => {
    tracker.trackQueryLimitReached();
  }, []);

  const trackRedirectToLogin = useCallback(() => {
    tracker.trackRedirectToLogin();
  }, []);

  const trackRedirectFromLogin = useCallback(() => {
    tracker.trackRedirectFromLogin();
  }, []);

  return {
    trackButtonClick,
    trackFormSubmit,
    trackLinkClick,
    trackSignup,
    trackLogin,
    trackPurchase,
    trackScroll,
    trackVideoPlay,
    trackDownload,
    trackCustomEvent,
    trackLandingToPSAQuery,
    trackQuery,
    trackQueryLimitReached,
    trackRedirectToLogin,
    trackRedirectFromLogin,
  };
}; 