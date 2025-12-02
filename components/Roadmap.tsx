import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { RoadmapProps } from '../types';
import SectionHeader from './SectionHeader';

const Roadmap: React.FC<RoadmapProps> = ({
    title = "Projekt-Lebenszyklus",
    subtitle = "Unser Vorgehen",
    description = "Wir begleiten Sie durch alle Phasen Ihres Projekts.",
    steps
}) => {
    // State for active step. Manages hover on desktop, and accordion on mobile.
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    // Handler for mobile accordion toggle
    const handleToggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    
    // The active step's data, used for the desktop description box
    const activeStepForDesktop = activeIndex !== null ? steps[activeIndex] : null;

    return (
        <section className="py-24 bg-white" aria-labelledby="roadmap-heading">
            <div className="container mx-auto px-4 md:px-12">
                <SectionHeader 
                    title={title}
                    subtitle={subtitle}
                    description={description}
                    id="roadmap-heading"
                />

                {/* --- DESKTOP VIEW --- */}
                <div className="hidden lg:block">
                    <div className="relative">
                        {/* Timeline background line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2"></div>
                        
                        {/* Timeline active progress line */}
                        <div 
                            className="absolute top-1/2 left-0 h-0.5 bg-orange-600 -translate-y-1/2 transition-all duration-500"
                            style={{ width: activeIndex !== null ? `${(activeIndex / (steps.length - 1)) * 100}%` : '0%' }}
                        ></div>

                        {/* Step items */}
                        <div className="flex justify-between">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => setActiveIndex(index)} // Also allow click for accessibility
                                    className="flex flex-col text-center gap-4 relative group cursor-pointer z-10 p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
                                    tabIndex={0}
                                    onKeyPress={(e) => { if (e.key === 'Enter') setActiveIndex(index) }}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 shrink-0 mx-auto
                                        ${activeIndex === index
                                            ? 'bg-orange-600 border-white text-white shadow-lg scale-110'
                                            : 'bg-white border-slate-200 text-slate-400 group-hover:border-orange-300 group-hover:text-orange-600'
                                        }`
                                    }>
                                        {step.icon}
                                    </div>
                                    <h3 className={`font-bold text-lg transition-colors ${activeIndex === index ? 'text-orange-700' : 'text-slate-600 group-hover:text-slate-900'}`}>{step.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description Box for Desktop */}
                    <div className="mt-16 min-h-[160px]">
                        {activeStepForDesktop && (
                            <div 
                                key={activeIndex} 
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-3xl mx-auto text-center shadow-sm animate-in fade-in duration-500"
                            >
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{activeStepForDesktop.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {activeStepForDesktop.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- MOBILE / TABLET ACCORDION VIEW --- */}
                <div className="block lg:hidden">
                    <div className="relative">
                        <div className="absolute top-0 left-8 w-0.5 h-full bg-slate-200 -translate-x-1/2" aria-hidden="true"></div>
                        
                        {steps.map((step, index) => {
                            const isOpen = activeIndex === index;
                            return (
                                <div key={index} className="relative pl-20 pb-8 last:pb-0">
                                    {/* Circle Icon - positioned absolutely relative to this item */}
                                    <div className="absolute top-0 left-8 -translate-x-1/2 z-10">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 shrink-0
                                            ${isOpen
                                                ? 'bg-orange-600 border-white text-white shadow-lg'
                                                : 'bg-white border-slate-200 text-slate-400'
                                            }`
                                        }>
                                            {step.icon}
                                        </div>
                                    </div>

                                    <div className="pt-3">
                                        <button 
                                            onClick={() => handleToggle(index)}
                                            className="w-full text-left flex justify-between items-center group py-2"
                                            aria-expanded={isOpen}
                                        >
                                            <h3 className={`font-bold text-xl transition-colors ${isOpen ? 'text-orange-700' : 'text-slate-800 group-hover:text-orange-700'}`}>
                                                {step.title}
                                            </h3>
                                            <span className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                                                {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                                            </span>
                                        </button>

                                        {/* Collapsible Content using grid-rows for smooth animation */}
                                        <div
                                            className={`grid transition-all duration-500 ease-in-out ${
                                                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                            }`}
                                        >
                                           <div className="overflow-hidden">
                                                <p className="text-slate-600 leading-relaxed pt-2 pb-2">
                                                    {step.description}
                                                </p>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Roadmap;
