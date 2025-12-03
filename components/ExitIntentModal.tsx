import React, { useState, useEffect } from 'react';
import { X, Calendar, Mail } from 'lucide-react';
import { trackExitIntent, trackCTAClick } from '../utils/analytics';

interface ExitIntentModalProps {
  onClose: () => void;
  expert?: {
    name: string;
    email: string;
    calendarLink?: string;
  };
}

const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ 
  onClose,
  expert = {
    name: "Dr. Michael Weber",
    email: "michael.weber@novartum.com",
    calendarLink: "#contact"
  }
}) => {
  useEffect(() => {
    trackExitIntent();
  }, []);

  const handleCalendarClick = () => {
    trackCTAClick('exit_intent_calendar', 'ExitIntentModal');
    onClose();
  };

  const handleEmailClick = () => {
    trackCTAClick('exit_intent_email', 'ExitIntentModal');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Schließen"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Warten Sie! Bevor Sie gehen...
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Lassen Sie uns unverbindlich über Ihre IT-Herausforderungen sprechen. 
            Kostenloses Erstgespräch mit unserem Experten <strong>{expert.name}</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={expert.calendarLink || '#contact'}
            onClick={handleCalendarClick}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg hover:shadow-orange-900/20 transform hover:-translate-y-0.5"
          >
            <Calendar size={18} /> Kostenloses Erstgespräch (30 Min.)
          </a>
          <a
            href={`mailto:${expert.email}`}
            onClick={handleEmailClick}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition"
          >
            <Mail size={18} /> E-Mail senden
          </a>
          <button
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700 py-2 transition-colors"
          >
            Nein, danke
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentModal;

