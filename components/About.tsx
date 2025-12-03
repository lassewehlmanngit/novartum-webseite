import React from 'react';
import { IconMapper } from './IconMapper';

export interface AboutFeature {
  icon: React.ReactNode | string;
  title: string;
  description: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

interface AboutProps {
  title: React.ReactNode | string;
  subtitle: string;
  text: React.ReactNode | string;
  stats: AboutStat[];
  features: AboutFeature[];
}

const About: React.FC<AboutProps> = ({ title, subtitle, text, stats, features }) => {
  return (
    <section className="bg-[#15171e] text-white py-24 md:py-32 relative overflow-hidden" id="about" aria-labelledby="about-heading">
      
      <div className="container mx-auto px-4 md:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Visual / Illustration side */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative z-10 grid grid-cols-2 gap-6">
             {/* Decorative Elements */}
             <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10"></div>

             {features.map((feature, idx) => (
                <div 
                  key={idx} 
                  className={`bg-[#1f222b]/80 backdrop-blur-sm p-8 rounded-2xl border border-[#2a2e3b] shadow-2xl hover:-translate-y-1 transition-transform duration-300 ${idx === 2 ? 'col-span-2 max-w-sm mx-auto transform lg:-translate-y-6 hover:-translate-y-8' : idx === 0 ? 'transform lg:translate-y-12' : ''}`}
                  data-cc-field={`features[${idx}]`}
                >
                  <div 
                    className={`w-14 h-14 border rounded-xl flex items-center justify-center mb-5 ${idx === 0 ? 'bg-blue-900/50 border-blue-500/30 text-blue-400' : idx === 1 ? 'bg-orange-900/50 border-orange-500/30 text-orange-400' : 'bg-purple-900/50 border-purple-500/30 text-purple-400'}`}
                    data-cc-field="icon"
                  >
                      {typeof feature.icon === 'string' ? <IconMapper name={feature.icon} size={28} /> : feature.icon}
                  </div>
                  <h4 className="font-bold text-xl mb-3 text-white" data-cc-field="title">{feature.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed" data-cc-field="description">{feature.description}</p>
               </div>
             ))}
          </div>
        </div>

        {/* Text Content Side */}
        <div className="w-full lg:w-1/2">
          <span className="text-orange-500 font-bold mb-3 block uppercase tracking-wide text-sm" data-cc-field="subtitle">{subtitle}</span>
          <h2 
            id="about-heading" 
            className="text-3xl md:text-5xl font-bold mb-8 text-white leading-tight"
            data-cc-field="title"
          >
            {typeof title === 'string' ? <span dangerouslySetInnerHTML={{ __html: title }} /> : title}
          </h2>
          <div 
            className="space-y-6 text-lg text-slate-300 leading-relaxed font-light"
            data-cc-field="text"
          >
            {typeof text === 'string' ? <div dangerouslySetInnerHTML={{ __html: text }} /> : text}
          </div>
          
          <div className="grid grid-cols-3 gap-8 border-t border-[#2a2e3b] pt-10 mt-10">
             {stats.map((stat, idx) => (
               <div key={idx} data-cc-field={`stats[${idx}]`}>
                  <span className="block text-4xl font-bold text-white mb-2" data-cc-field="value">{stat.value}</span>
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider" data-cc-field="label">{stat.label}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;