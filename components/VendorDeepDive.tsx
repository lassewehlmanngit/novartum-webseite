import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { VendorIssue, VendorDeepDiveProps } from '../types';
import { IconMapper } from './IconMapper';

const VendorCard: React.FC<VendorIssue> = ({ vendor, logo, color, risks, solution, label = "Audit Fokus" }) => {
  // Dynamically calculate text color based on the bar color (e.g. bg-blue-600 -> text-blue-600)
  // Fallback to slate-500 if the pattern doesn't match
  const labelTextColor = color.startsWith('bg-') ? color.replace('bg-', 'text-') : 'text-slate-500';

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <div className={`h-2 w-full ${color}`}></div>
      <div className="p-8 flex flex-col h-full">
        {/* Eyebrow Layout: Label above Title */}
        <div className="mb-6">
          <span 
            className={`text-xs font-bold uppercase tracking-widest block mb-2 ${labelTextColor}`}
            data-cc-field="label"
          >
            {label}
          </span>
          <h3 
            className="text-2xl font-bold text-slate-900 break-words hyphens-auto leading-tight"
            data-cc-field="logo"
          >
            {typeof logo === 'string' && !logo.includes('/') ? logo : <IconMapper name={logo} size={32} />}
          </h3>
        </div>

        <div className="mb-6 bg-red-50 rounded-xl p-5 border border-red-100">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-3 text-sm uppercase tracking-wide">
            <AlertTriangle size={16} /> Häufige Risiken
          </div>
          <ul className="space-y-3">
            {risks?.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span data-cc-field={`risks[${idx}]`}>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-2 text-green-700 font-bold mb-3 text-sm uppercase tracking-wide">
            <CheckCircle2 size={16} /> Die Novartum Lösung
          </div>
          <p 
            className="text-slate-600 text-sm leading-relaxed mb-6"
            data-cc-field="solution"
          >
            {solution}
          </p>
          <button className="text-orange-700 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            Beratung anfragen <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const VendorDeepDive: React.FC<VendorDeepDiveProps> = ({
  title = "Hersteller-Spezifika",
  subtitle = "Tiefenwissen",
  description = "Jeder Softwarehersteller hat eigene Lizenzmodelle und Fallstricke. Wir kennen das Kleingedruckte.",
  vendors,
  id = "vendor-details"
}) => {
  return (
    <section className="py-24 bg-slate-50" id={id} aria-labelledby={`${id}-heading`}>
      <div className="container mx-auto px-4 md:px-12">
        <SectionHeader 
          title={<span data-cc-field="title">{title}</span>}
          subtitle={<span data-cc-field="subtitle">{subtitle}</span>}
          description={<span data-cc-field="description">{description}</span>}
          id={`${id}-heading`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {vendors.map((v, idx) => (
            <div key={idx} data-cc-field={`vendors[${idx}]`} className="h-full">
               <VendorCard {...v} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorDeepDive;
