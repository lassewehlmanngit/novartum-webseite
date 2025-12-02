import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CaseStudyItem } from '../types';
import { IconMapper } from './IconMapper';

interface CaseStudiesProps {
  title?: React.ReactNode | string;
  subtitle?: string;
  items: CaseStudyItem[];
}

const CaseStudyCard: React.FC<CaseStudyItem> = ({ icon, title, challenge, solution, category, link }) => (
  <article className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-full group hover:transform hover:-translate-y-2 transition-all duration-300">
    <div className="p-8 flex-grow">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-orange-100 text-orange-700 rounded-xl">
           {typeof icon === 'string' ? <IconMapper name={icon} size={24} /> : icon}
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{category}</span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-orange-700 transition-colors">{title}</h3>
      
      <div className="space-y-6 text-sm text-slate-600">
        <div className="relative pl-4 border-l-2 border-orange-200">
          <strong className="block text-slate-900 mb-1">Herausforderung:</strong>
          <p>{challenge}</p>
        </div>
        <div className="relative pl-4 border-l-2 border-green-200">
          <strong className="block text-slate-900 mb-1">Lösung:</strong>
          <p>{solution}</p>
        </div>
      </div>
    </div>
    
    <div className="p-6 pt-0">
      {link ? (
        <Link 
          to={link}
          className="w-full flex items-center justify-between bg-orange-700 hover:bg-orange-800 text-white font-bold py-4 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700"
        >
          Projekt Details <ArrowRight size={18} />
        </Link>
      ) : (
        <button className="w-full flex items-center justify-between bg-orange-700 hover:bg-orange-800 text-white font-bold py-4 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700">
          Projekt Details <ArrowRight size={18} />
        </button>
      )}
    </div>
  </article>
);

const CaseStudies: React.FC<CaseStudiesProps> = ({ 
    title = <>Projekte aus der <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Praxis</span></>,
    subtitle = "Referenzen",
    items 
}) => {
  return (
    <section className="py-24 bg-[#15171e] border-t border-[#2a2e3b]" id="projekte" aria-labelledby="cases-heading">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
                <span className="text-orange-500 font-bold mb-2 block uppercase tracking-wide text-sm">{subtitle}</span>
                <h2 id="cases-heading" className="text-3xl md:text-4xl font-bold text-white">
                {typeof title === 'string' ? <span dangerouslySetInnerHTML={{ __html: title }} /> : title}
                </h2>
            </div>
            <Link to="/projekte" className="text-slate-300 hover:text-white font-medium flex items-center gap-2 group transition-colors">
                Alle Referenzen ansehen <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((study, idx) => (
            <CaseStudyCard key={idx} {...study} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
