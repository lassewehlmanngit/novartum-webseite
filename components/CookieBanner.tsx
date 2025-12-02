
import React, { useState, useEffect } from 'react';
import { Shield, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ConsentSettings {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = 'novartum_cookie_consent';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>({
    essential: true, // Always true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem(STORAGE_KEY);
    if (!savedConsent) {
      // Small delay for better UX (don't slam user immediately)
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (preferences: ConsentSettings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }));
    setIsVisible(false);
    setShowDetails(false);
    
    // Dispatch event so GlobalScripts can react immediately
    window.dispatchEvent(new Event('consentUpdated'));
    
    // Legacy logging
    if (preferences.analytics) {
      console.log('Analytics allowed');
    }
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleDeny = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const handleSaveSelection = () => {
    saveConsent(settings);
  };

  const toggleSetting = (key: keyof ConsentSettings) => {
    if (key === 'essential') return; // Cannot toggle essential
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* --- Main Banner --- */}
      <div className={`fixed bottom-0 left-0 w-full bg-[#15171e] border-t border-slate-700 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 transition-transform duration-500 max-h-[90vh] overflow-y-auto lg:overflow-visible ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Text Content */}
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-2 mb-2 text-white font-bold text-lg">
                <Shield size={20} className="text-orange-500 shrink-0" />
                <h3>Privatsphäre-Einstellungen</h3>
              </div>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und Zugriffe zu analysieren. 
                Weitere Informationen finden Sie in unserer <Link to="/datenschutz" className="text-orange-500 hover:text-orange-400 underline decoration-orange-500/30">Datenschutzerklärung</Link> und im <Link to="/impressum" className="text-orange-500 hover:text-orange-400 underline decoration-orange-500/30">Impressum</Link>.
              </p>
            </div>

            {/* Buttons - Optimized Grid for Mobile to save vertical space */}
            <div className="grid grid-cols-2 lg:flex gap-3 w-full lg:w-auto shrink-0">
              <button 
                onClick={() => setShowDetails(true)}
                className="col-span-1 px-3 md:px-4 py-3 md:py-2.5 rounded-lg border border-slate-600 text-slate-300 font-bold text-xs md:text-sm hover:bg-slate-800 hover:text-white transition-colors"
              >
                Einstellungen
              </button>
              <button 
                onClick={handleDeny}
                className="col-span-1 px-3 md:px-4 py-3 md:py-2.5 rounded-lg bg-slate-700 text-white font-bold text-xs md:text-sm hover:bg-slate-600 transition-colors"
              >
                Ablehnen
              </button>
              <button 
                onClick={handleAcceptAll}
                className="col-span-2 lg:w-auto px-4 md:px-6 py-3 md:py-2.5 rounded-lg bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 shadow-lg shadow-orange-900/20 transition-colors whitespace-nowrap"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Detailed Settings Modal --- */}
      {showDetails && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white sm:rounded-2xl rounded-t-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg md:text-xl font-bold text-slate-900">Cookie-Präferenzen</h3>
              <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
              <p className="text-slate-600 text-sm">
                Hier können Sie auswählen, welche Cookie-Kategorien Sie aktivieren möchten. Sie können Ihre Einstellungen jederzeit ändern.
              </p>

              {/* Essential */}
              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-200 opacity-70">
                <div className="pt-1">
                  <div className="w-5 h-5 rounded border bg-orange-500 border-orange-500 flex items-center justify-center text-white">
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">Essenziell</h4>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">Immer aktiv</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500">
                    Notwendig für Grundfunktionen (Navigation, Sicherheit).
                  </p>
                </div>
              </div>

              {/* Analytics */}
              <div 
                className={`flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all cursor-pointer hover:border-orange-300 ${settings.analytics ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}
                onClick={() => toggleSetting('analytics')}
              >
                <div className="pt-1">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${settings.analytics ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-300'}`}>
                    {settings.analytics && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Analyse & Statistik</h4>
                  <p className="text-xs md:text-sm text-slate-500">
                    Hilft uns zu verstehen, wie Besucher mit der Website interagieren (anonymisiert).
                  </p>
                </div>
              </div>

              {/* Marketing */}
              <div 
                className={`flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all cursor-pointer hover:border-orange-300 ${settings.marketing ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}
                onClick={() => toggleSetting('marketing')}
              >
                <div className="pt-1">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${settings.marketing ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-300'}`}>
                    {settings.marketing && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Marketing</h4>
                  <p className="text-xs md:text-sm text-slate-500">
                    Zeigt relevante Inhalte und Werbung basierend auf Interessen an.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Actions (Sticky Bottom) */}
            <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-end gap-3 shrink-0 sm:rounded-b-2xl">
              <button 
                onClick={handleDeny}
                className="order-2 sm:order-1 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Nur Essenzielle
              </button>
              <button 
                onClick={handleSaveSelection}
                className="order-3 sm:order-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                Speichern
              </button>
              <button 
                onClick={handleAcceptAll}
                className="order-1 sm:order-3 px-6 py-3 rounded-lg bg-orange-700 text-white font-bold text-sm hover:bg-orange-800 shadow-lg shadow-orange-900/20 transition-colors"
              >
                Alle akzeptieren
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
