import React, { useEffect, useState, useMemo } from 'react';
import { X, Calendar, Download, ArrowRight, FileText, Mail } from 'lucide-react';
import { trackExitIntent, trackCTAClick } from '../utils/analytics';
import { useLocation } from 'react-router-dom';

interface ExitIntentModalProps {
  onClose: () => void;
  // expert prop removed or optional as it is not used in previous implementation
}

interface IntentContent {
  tagline: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  ctaIconType?: 'calendar' | 'download' | 'arrow' | 'mail';
  secondaryCta: string;
  expertId?: string; // Add expertId
}

interface RouteConfig extends IntentContent {
  pathKeywords: string[];
}

interface Expert {
    name: string;
    role: string;
    image: string;
}

const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ onClose }) => {
  const location = useLocation();
  const [config, setConfig] = useState<{ default: IntentContent, routes: RouteConfig[] } | null>(null);
  const [expert, setExpert] = useState<Expert | null>(null);

  useEffect(() => {
    trackExitIntent();
    
    // Fetch global configuration
    fetch('/content/globals/exit-intent.json')
      .then(res => res.json())
      .then(setConfig)
      .catch(console.error);
  }, []);

  // Determine active content based on path
  const content = useMemo(() => {
    if (!config) return null; // Wait for data

    const path = location.pathname.toLowerCase();
    
    // Find matching route config
    const match = config.routes.find(route => 
      route.pathKeywords.some(keyword => path.includes(keyword.toLowerCase()))
    );

    return match || config.default;
  }, [location.pathname, config]);

  // Fetch expert if needed
  useEffect(() => {
    if (content?.expertId) {
        fetch(`/content/team/members/${content.expertId}.json`)
            .then(res => res.json())
            .then(setExpert)
            .catch(console.error);
    } else {
        setExpert(null);
    }
  }, [content?.expertId]);

  const getIcon = (type?: string) => {
    switch(type) {
      case 'download': return <Download size={18} />;
      case 'arrow': return <ArrowRight size={18} />;
      case 'mail': return <Mail size={18} />;
      case 'calendar': 
      default: return <Calendar size={18} />;
    }
  };

  const handlePrimaryClick = () => {
    if (!content) return;
    trackCTAClick(`exit_intent_primary_${content.ctaText}`, 'ExitIntentModal');
    if (content.ctaLink.startsWith('#')) {
       onClose();
       const el = document.getElementById(content.ctaLink.substring(1));
       if(el) el.scrollIntoView({behavior: 'smooth'});
    } else {
       window.location.href = content.ctaLink;
       onClose();
    }
  };

  if (!content) return null; // Don't render until loaded

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300"
      data-cc-path="/content/globals/exit-intent.json"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Schließen"
        >
          <X size={20} />
        </button>

        {/* Left Side: Visual / Value Prop */}
        <div className="md:w-2/5 bg-slate-900 p-8 flex flex-col justify-center relative overflow-hidden text-white">
           <div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10">
              {expert ? (
                  <div className="mb-6 flex items-center gap-4">
                      <img 
                        src={expert.image} 
                        alt={expert.name} 
                        className="w-16 h-16 rounded-full border-2 border-orange-500 shadow-lg object-cover"
                      />
                      <div>
                          <p className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-1">{content.tagline}</p>
                          <p className="text-xs text-slate-400 font-medium">Empfohlen von {expert.name.split(' ')[0]}</p>
                      </div>
                  </div>
              ) : (
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-orange-400">
                 <FileText size={24} />
              </div>
              )}
              
              {!expert && <span className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-2 block" data-cc-field="tagline">{content.tagline}</span>}
              <h3 className="text-2xl font-bold leading-tight mb-4" data-cc-field="title">{content.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed" data-cc-field="description">
                 {content.description}
              </p>
           </div>
        </div>

        {/* Right Side: Actions */}
        <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center bg-white">
           <div className="space-y-4">
              <button
                onClick={handlePrimaryClick}
                className="w-full flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-orange-900/20 transform hover:-translate-y-0.5"
              >
                {getIcon(content.ctaIconType)}
                <span data-cc-field="ctaText">{content.ctaText}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-3 px-6 rounded-xl transition border border-slate-100"
              >
                <span data-cc-field="secondaryCta">{content.secondaryCta}</span>
              </button>
           </div>
           
           <p className="text-center text-xs text-slate-400 mt-6">
              100% kostenlos & unverbindlich. Wir respektieren Ihren Datenschutz.
           </p>
        </div>

      </div>
    </div>
  );
};

export default ExitIntentModal;
