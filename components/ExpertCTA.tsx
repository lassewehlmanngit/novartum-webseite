import React from 'react';
import { Mail, Calendar, Phone, CheckCircle2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { trackCTAClick, trackEmailClick, trackPhoneClick } from '../utils/analytics';

interface Expert {
  name: string;
  role: string;
  image: string;
  bio?: string;
  email: string;
  calendarLink?: string;
  phone?: string;
  stats?: {
    experience?: string;
    projects?: string;
  };
}

interface ExpertCTAProps {
  subtitle?: string;
  title?: string;
  description?: string;
  expert?: Expert;
  // Kept for backward compatibility if needed, though current design is unified
  variant?: 'compact' | 'wide'; 
}

const ExpertCTA: React.FC<ExpertCTAProps> = ({
  subtitle = "Direkter Draht",
  title = "Sprechen Sie mit dem Experten für SAM",
  description = "Haben Sie spezifische Fragen zu Oracle-Audits, Microsoft-Verträgen oder Cloud-FinOps? Unsere Experten haben jahrelange Erfahrung in der Abwehr von Nachforderungen.",
  expert = {
    name: "Dr. Michael Weber",
    role: "Head of SAM & Compliance",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    bio: "Ehemals auf Herstellerseite, kenne ich die Taktiken der Auditoren genau. Mein Ziel ist es, dieses Wissen zu 100% für den Schutz Ihres Budgets einzusetzen.",
    email: "michael.weber@novartum.com",
    calendarLink: "#",
    phone: "+49 89 12345678",
    stats: {
      experience: "20+ Jahre",
      projects: "100+ Projekte"
    }
  }
}) => {
  const handleCalendarClick = () => {
    trackCTAClick('expert_calendar_booking', 'ExpertCTA');
  };

  const handleEmailClick = () => {
    trackEmailClick(expert.email, 'ExpertCTA');
  };

  const handlePhoneClick = () => {
    if (expert.phone) {
      trackPhoneClick(expert.phone, 'ExpertCTA');
    }
  };

  return (
    <section className="py-24 bg-slate-50" aria-labelledby="expert-contact-heading">
      <div className="container mx-auto px-4 md:px-12">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Side: Text Content */}
          <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <SectionHeader
              subtitle={subtitle}
              title={title}
              description={description}
              align="left"
              id="expert-contact-heading"
              className="mb-0"
            />
          </div>

          {/* Right Side: Expert Card */}
          <div className="lg:col-span-5 bg-[#15171e] p-8 md:p-12 text-white flex flex-col justify-center relative">
            {/* Background decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <img
                src={expert.image}
                alt={expert.name}
                className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-slate-700 shadow-2xl"
              />
              <h3 className="text-2xl font-bold mb-1">{expert.name}</h3>
              <p className="text-orange-500 font-medium mb-4 text-sm uppercase tracking-wider">{expert.role}</p>
              
              {/* Social Proof Stats */}
              {expert.stats && (expert.stats.experience || expert.stats.projects) && (
                <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mb-4">
                  {expert.stats.experience && (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-orange-500" />
                      {expert.stats.experience} Erfahrung
                    </span>
                  )}
                  {expert.stats.experience && expert.stats.projects && <span>•</span>}
                  {expert.stats.projects && (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-orange-500" />
                      {expert.stats.projects}
                    </span>
                  )}
                </div>
              )}
              
              {expert.bio && (
                <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-xs italic">
                  "{expert.bio}"
                </p>
              )}

              {/* Trust Badges */}
              <div className="text-xs text-slate-400 mb-6 flex items-center gap-3">
                <span>✓ Unverbindlich</span>
                <span>•</span>
                <span>✓ Kostenlos</span>
                <span>•</span>
                <span>✓ Diskret</span>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-sm">
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
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-xl transition border border-slate-700 hover:border-slate-600"
                >
                  <Mail size={18} /> E-Mail senden
                </a>
                {expert.phone && (
                  <a 
                    href={`tel:${expert.phone.replace(/\s/g, '')}`}
                    onClick={handlePhoneClick}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-6 rounded-xl transition border border-slate-700 hover:border-slate-600"
                  >
                    <Phone size={18} /> {expert.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertCTA;
