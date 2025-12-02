import React, { useEffect } from 'react';

const STORAGE_KEY = 'novartum_cookie_consent';

const GlobalScripts = () => {
  useEffect(() => {
    // Function to inject scripts
    const injectScripts = (trackingScripts: any) => {
      if (!trackingScripts) return;

      // Inject Head Scripts
      if (trackingScripts.head) {
        const headRange = document.createRange();
        headRange.setStart(document.head, 0);
        const headFragment = headRange.createContextualFragment(trackingScripts.head);
        document.head.appendChild(headFragment);
      }

      // Inject Body Scripts (top of body)
      if (trackingScripts.body) {
        const bodyRange = document.createRange();
        bodyRange.setStart(document.body, 0);
        const bodyFragment = bodyRange.createContextualFragment(trackingScripts.body);
        document.body.prepend(bodyFragment);
      }
    };

    const initScripts = async () => {
      try {
        // 1. Check consent first
        const savedConsent = localStorage.getItem(STORAGE_KEY);
        if (!savedConsent) return; // No choice made yet

        const consent = JSON.parse(savedConsent);
        
        // 2. Fetch settings
        const response = await fetch('/content/globals/settings.json');
        if (response.ok) {
          const settings = await response.json();
          
          // Inject Analytics if consented
          if (consent.analytics && settings.analyticsScripts) {
             injectScripts(settings.analyticsScripts);
          }
          
          // Inject Marketing if consented
          if (consent.marketing && settings.marketingScripts) {
             injectScripts(settings.marketingScripts);
          }
        }
      } catch (e) {
        console.error("Failed to load global settings", e);
      }
    };

    // Run on mount
    initScripts();

    // Listen for consent updates (custom event from CookieBanner)
    const handleConsentUpdate = () => {
      initScripts();
    };
    
    window.addEventListener('consentUpdated', handleConsentUpdate);
    return () => window.removeEventListener('consentUpdated', handleConsentUpdate);
  }, []);

  return null;
};

export default GlobalScripts;

