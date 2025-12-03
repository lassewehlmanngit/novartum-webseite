import React from 'react';
import SectionHeader from './SectionHeader';

export interface MethodologyStep {
  number: string;
  title: string;
  description: string;
}

interface MethodologyProps {
  title?: string;
  subtitle?: string;
  description?: string;
  steps?: MethodologyStep[];
  qualityTitle?: string;
  qualityItems?: string[];
}

const Step: React.FC<MethodologyStep> = ({ number, title, description }) => (
    <div className="flex gap-6 group">
        <div className="flex flex-col items-center">
            <div 
              className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 font-bold text-xl flex items-center justify-center group-hover:bg-orange-700 group-hover:text-white transition-colors duration-300 shrink-0"
              data-cc-field="number"
            >
                {number}
            </div>
            <div className="w-px h-full bg-slate-200 my-2 group-last:hidden"></div>
        </div>
        <div className="pb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-2" data-cc-field="title">{title}</h3>
            <p className="text-slate-600 leading-relaxed max-w-lg" data-cc-field="description">
                {description}
            </p>
        </div>
    </div>
);

const Methodology: React.FC<MethodologyProps> = ({
  subtitle = "Unser Vorgehen",
  title = "Prozessorientiert zum Erfolg",
  description,
  steps = [],
  qualityTitle = "Unsere Qualitätsstandards",
  qualityItems = []
}) => {
    return (
        <section className="py-24 bg-white" aria-labelledby="method-heading">
             <div className="container mx-auto px-4 md:px-12 flex flex-col lg:flex-row gap-16">
                 <div className="lg:w-1/2">
                    <SectionHeader 
                      title={<span data-cc-field="title">{title}</span>}
                      subtitle={<span data-cc-field="subtitle">{subtitle}</span>}
                      description={<span data-cc-field="description">{description}</span>}
                      align="left"
                      id="method-heading"
                      className="mb-8"
                    />
                    
                    {qualityItems.length > 0 && (
                      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 inline-block">
                          <h4 className="font-bold text-slate-900 mb-2" data-cc-field="qualityTitle">{qualityTitle}</h4>
                          <ul className="space-y-2">
                              {qualityItems.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-slate-700">
                                    <span className="w-2 h-2 bg-green-500 rounded-full shrink-0"></span> <span data-cc-field={`qualityItems[${idx}]`}>{item}</span>
                                </li>
                              ))}
                          </ul>
                      </div>
                    )}
                 </div>

                 <div className="lg:w-1/2 pt-4">
                     {steps?.map((step, idx) => (
                       <div key={idx} data-cc-field={`steps[${idx}]`}>
                         <Step {...step} />
                       </div>
                     ))}
                 </div>
             </div>
        </section>
    );
};

export default Methodology;