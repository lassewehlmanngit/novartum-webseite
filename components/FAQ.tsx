import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { trackMicroConversion } from '../utils/analytics';

export interface FAQItem {
  question: string;
  answer: React.ReactNode | string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}

const FAQAccordion: React.FC<{ item: FAQItem; isOpen: boolean; toggle: () => void }> = ({ item, isOpen, toggle }) => {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={toggle}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        aria-expanded={isOpen}
      >
        <h3 className={`text-lg font-bold transition-colors ${isOpen ? 'text-orange-700' : 'text-slate-800 group-hover:text-orange-700'}`}>
          {item.question}
        </h3>
        <span className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-slate-600 leading-relaxed pr-8">
          {typeof item.answer === 'string' ? <div dangerouslySetInnerHTML={{ __html: item.answer }} /> : item.answer}
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC<FAQProps> = ({ 
  title = "Häufige Fragen", 
  subtitle = "Wissen kompakt", 
  items 
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (idx: number) => {
    const isOpening = openIndex !== idx;
    setOpenIndex(openIndex === idx ? null : idx);
    
    // Track FAQ expansion as micro-conversion
    if (isOpening && items[idx]) {
      trackMicroConversion('faq_expand', items[idx].question);
    }
  };

  // FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof item.answer === 'string' ? item.answer : "Siehe Details auf der Webseite"
      }
    }))
  };

  return (
    <section className="py-24 bg-white" aria-labelledby="faq-heading">
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <div className="container mx-auto px-4 md:px-12 flex flex-col lg:flex-row gap-16">
        
        {/* Header / Intro */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <span className="text-orange-700 font-bold uppercase text-xs tracking-widest mb-4 block">{subtitle}</span>
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{title}</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Antworten auf die wichtigsten Fragen rund um Lizenzmanagement, Audits und Compliance.
              Optimiert für schnelle Informationsfindung.
            </p>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 inline-flex items-start gap-4">
               <HelpCircle className="text-blue-600 shrink-0 mt-1" />
               <div>
                 <h4 className="font-bold text-blue-900 text-sm mb-1">Noch Fragen offen?</h4>
                 <p className="text-blue-700 text-sm">Unsere Experten beraten Sie gerne unverbindlich.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="lg:w-2/3">
           <div className="bg-white rounded-2xl">
             {items.map((item, idx) => (
               <FAQAccordion 
                 key={idx} 
                 item={item} 
                 isOpen={openIndex === idx} 
                 toggle={() => handleToggle(idx)} 
               />
             ))}
           </div>
        </div>

      </div>
    </section>
  );
};

export default FAQ;
