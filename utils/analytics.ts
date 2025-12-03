/**
 * Analytics Event Tracking Utility
 * Handles all conversion tracking events for CTA clicks, form submissions, etc.
 */

interface TrackingEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

/**
 * Track a conversion event
 * Supports Google Analytics (gtag), Google Tag Manager, and custom analytics
 */
export const trackEvent = ({ action, category, label, value }: TrackingEvent) => {
  if (typeof window === 'undefined') return;

  // Google Analytics 4 (gtag)
  if ((window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value || 1
    });
  }

  // Google Tag Manager
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: action,
      eventCategory: category,
      eventLabel: label,
      eventValue: value || 1
    });
  }

  // Custom analytics (if you have your own)
  if ((window as any).trackCustomEvent) {
    (window as any).trackCustomEvent({ action, category, label, value });
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Track Event:', { action, category, label, value });
  }
};

/**
 * Track CTA button clicks
 */
export const trackCTAClick = (label: string, location?: string) => {
  trackEvent({
    action: 'click',
    category: 'CTA',
    label: location ? `${label} (${location})` : label
  });
};

/**
 * Track form submissions
 */
export const trackFormSubmit = (formName: string, success: boolean = true) => {
  trackEvent({
    action: success ? 'form_submit_success' : 'form_submit_error',
    category: 'Form',
    label: formName
  });
};

/**
 * Track phone number clicks
 */
export const trackPhoneClick = (phoneNumber: string, location?: string) => {
  trackEvent({
    action: 'click',
    category: 'Phone',
    label: location ? `${phoneNumber} (${location})` : phoneNumber
  });
};

/**
 * Track email link clicks
 */
export const trackEmailClick = (email: string, location?: string) => {
  trackEvent({
    action: 'click',
    category: 'Email',
    label: location ? `${email} (${location})` : email
  });
};

/**
 * Track PDF downloads
 */
export const trackPDFDownload = (fileName: string) => {
  trackEvent({
    action: 'download',
    category: 'PDF',
    label: fileName,
    value: 1
  });
};

/**
 * Track micro-conversions (FAQ expands, time on page, etc.)
 */
export const trackMicroConversion = (action: string, label?: string) => {
  trackEvent({
    action,
    category: 'Micro Conversion',
    label
  });
};

/**
 * Track exit intent
 */
export const trackExitIntent = () => {
  trackEvent({
    action: 'exit_intent',
    category: 'Engagement',
    label: 'User attempted to leave'
  });
};

