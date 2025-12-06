import React, { useState, useEffect } from 'react';
import { PartnerItem } from '../types';
import SectionHeader from './SectionHeader';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface PartnerGridProps {
  title: string;
  subtitle: string;
  description: string;
  partners?: PartnerItem[];
  ctaLink?: string;
  ctaText?: string;
}

const PartnerGrid: React.FC<PartnerGridProps> = ({ title, subtitle, description, partners: initialPartners, ctaLink, ctaText }) => {
  const [partners, setPartners] = useState<PartnerItem[]>(initialPartners || []);

  useEffect(() => {
    // Only fetch if we are NOT in CTA mode and have no partners
    if (!ctaLink && (!initialPartners || initialPartners.length === 0)) {
      fetch('/content/partners/list.json')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setPartners(data);
            }
        })
        .catch(console.error);
    }
  }, [initialPartners, ctaLink]);

  if (ctaLink) {
    return (
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-12 flex flex-col items-center">
          <SectionHeader 
            title={<span data-cc-field="title">{title}</span>}
            subtitle={<span data-cc-field="subtitle">{subtitle}</span>}
            description={<span data-cc-field="description">{description}</span>}
            className="mb-8"
          />
          <Link 
            to={ctaLink} 
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <span data-cc-field="ctaText">{ctaText || "Zu den Partnern"}</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
      return null;
  }

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-12">
        <SectionHeader 
          title={<span data-cc-field="title">{title}</span>}
          subtitle={<span data-cc-field="subtitle">{subtitle}</span>}
          description={<span data-cc-field="description">{description}</span>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {partners.map((partner, idx) => (
             <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center" data-cc-field={`partners[${idx}]`}>
                <div className="h-24 flex items-center justify-center mb-6 w-full border-b border-slate-50 pb-6">
                    {/* Visual Logo Placeholder Logic */}
                    <span className={`text-2xl font-bold ${
                        partner.name === 'Microsoft' ? 'text-slate-700 font-sans' :
                        partner.name === 'SAP' ? 'text-[#008FD3]' :
                        partner.name === 'Oracle' ? 'text-[#C74634] font-serif' :
                        partner.name === 'VMware' ? 'text-slate-600 font-extrabold' :
                        'text-slate-800'
                    }`}
                    data-cc-field="logo"
                    >
                        {partner.logo}
                    </span>
                </div>
                
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3" data-cc-field="type">
                    {partner.type}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-4" data-cc-field="name">{partner.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed" data-cc-field="description">
                    {partner.description}
                </p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerGrid;