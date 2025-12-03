import React from 'react';
import { SynergyProps } from '../types';
import { Plus, ArrowRight, Layers } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { IconMapper } from './IconMapper';

const SynergySection: React.FC<SynergyProps> = ({ title, subtitle, description, items }) => {
  return (
    <section className="py-24 bg-[#1f222b] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]"></div>
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <SectionHeader 
          title={<span data-cc-field="title">{title}</span>}
          subtitle={<span data-cc-field="subtitle">{subtitle}</span>}
          description="" 
          dark={true}
          align="left"
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
           {/* Text Side */}
           <div className="lg:col-span-5">
              <div 
                className="text-lg text-slate-300 leading-relaxed space-y-6 font-light"
                data-cc-field="description"
              >
                 {typeof description === 'string' ? <div dangerouslySetInnerHTML={{ __html: description }} /> : description}
              </div>
              <div className="mt-10">
                 <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 font-bold text-sm uppercase tracking-wide">
                    <Layers size={16} /> Integrated IT Governance
                 </div>
              </div>
           </div>

           {/* Cards Side */}
           <div className="lg:col-span-7">
              <div className="grid gap-6">
                 {items?.map((item, idx) => (
                    <div key={idx} className="relative group" data-cc-field={`items[${idx}]`}>
                       {/* Connector Line (except for last item) */}
                       {idx !== items.length - 1 && (
                          <div className="absolute left-8 top-full h-6 w-0.5 bg-slate-700 -z-10 group-hover:bg-orange-500/50 transition-colors"></div>
                       )}

                       <div className="bg-[#2a2e3b]/50 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl hover:border-orange-500/50 hover:bg-[#2a2e3b] transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                          <div 
                            className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg"
                            data-cc-field="icon"
                          >
                             <div className="text-orange-500 group-hover:text-white transition-colors">
                                {typeof item.icon === 'string' ? <IconMapper name={item.icon} size={24} /> : item.icon}
                             </div>
                          </div>
                          
                          {/* Plus Sign Overlay */}
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 hidden lg:flex w-6 h-6 bg-[#1f222b] border border-slate-700 rounded-full items-center justify-center text-slate-500 text-xs">
                             <Plus size={10} />
                          </div>

                          <div className="flex-1">
                             <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors flex items-center gap-2" data-cc-field="title">
                                {item.title} 
                                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500"/>
                             </h3>
                             <p className="text-slate-400 text-sm leading-relaxed" data-cc-field="description">
                                {item.description}
                             </p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default SynergySection;
