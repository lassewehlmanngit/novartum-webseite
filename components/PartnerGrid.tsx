import React from 'react';
import { PartnerItem } from '../types';
import SectionHeader from './SectionHeader';

interface PartnerGridProps {
  title: string;
  subtitle: string;
  description: string;
  partners: PartnerItem[];
}

const PartnerGrid: React.FC<PartnerGridProps> = ({ title, subtitle, description, partners }) => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-12">
        <SectionHeader 
          title={title}
          subtitle={subtitle}
          description={description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {partners.map((partner, idx) => (
             <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center">
                <div className="h-24 flex items-center justify-center mb-6 w-full border-b border-slate-50 pb-6">
                    {/* Visual Logo Placeholder Logic */}
                    <span className={`text-2xl font-bold ${
                        partner.name === 'Microsoft' ? 'text-slate-700 font-sans' :
                        partner.name === 'SAP' ? 'text-[#008FD3]' :
                        partner.name === 'Oracle' ? 'text-[#C74634] font-serif' :
                        partner.name === 'VMware' ? 'text-slate-600 font-extrabold' :
                        'text-slate-800'
                    }`}>
                        {partner.logo}
                    </span>
                </div>
                
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-3">
                    {partner.type}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{partner.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
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