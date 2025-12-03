import React, { useState } from 'react';
import { JobOffer } from '../types';
import { MapPin, Clock, Briefcase, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface JobBoardProps {
  jobs: JobOffer[];
}

const JobBoard: React.FC<JobBoardProps> = ({ jobs }) => {
  const [openJob, setOpenJob] = useState<string | null>(null);

  const toggleJob = (id: string) => {
    setOpenJob(openJob === id ? null : id);
  };

  return (
    <section className="py-24 bg-white" id="jobs">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-slate-900 mb-4">Offene Stellen</h2>
           <p className="text-slate-600">Finde die Rolle, die zu dir passt.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
           {jobs.map((job) => {
             const isOpen = openJob === job.id;
             
             // JobPosting Schema
             const jobSchema = {
               "@context": "https://schema.org",
               "@type": "JobPosting",
               "title": job.title,
               "description": `
                 <p>${job.description}</p>
                 <h3>Aufgaben:</h3>
                 <ul>${job.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
                 <h3>Profil:</h3>
                 <ul>${job.profile.map(p => `<li>${p}</li>`).join('')}</ul>
               `,
               "datePosted": new Date().toISOString().split('T')[0], // Ideally comes from CMS
               "employmentType": job.type === "Vollzeit" ? "FULL_TIME" : "PART_TIME",
               "hiringOrganization": {
                 "@type": "Organization",
                 "name": "Novartum GmbH",
                 "sameAs": "https://novartum.com",
                 "logo": "https://novartum.com/logo.svg"
               },
               "jobLocation": {
                 "@type": "Place",
                 "address": {
                   "@type": "PostalAddress",
                   "addressLocality": job.location.split(',')[0] || "München",
                   "addressCountry": "DE"
                 }
               }
             };

             return (
               <div key={job.id} className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-orange-200 bg-orange-50/30 shadow-md' : 'border-slate-200 bg-white hover:border-orange-200'}`} data-cc-field={`jobs[${jobs.indexOf(job)}]`}>
                  {isOpen && (
                    <script type="application/ld+json">
                      {JSON.stringify(jobSchema)}
                    </script>
                  )}
                  <button 
                    onClick={() => toggleJob(job.id)}
                    className="w-full flex flex-col md:flex-row md:items-center justify-between p-6 text-left focus:outline-none"
                  >
                     <div className="mb-4 md:mb-0">
                        <h3 className={`text-xl font-bold mb-2 transition-colors ${isOpen ? 'text-orange-700' : 'text-slate-900'}`} data-cc-field="title">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                           <span className="flex items-center gap-1"><Briefcase size={14}/> <span data-cc-field="department">{job.department}</span></span>
                           <span className="flex items-center gap-1"><Clock size={14}/> <span data-cc-field="type">{job.type}</span></span>
                           <span className="flex items-center gap-1"><MapPin size={14}/> <span data-cc-field="location">{job.location}</span></span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 text-sm font-bold text-orange-700">
                        {isOpen ? 'Details ausblenden' : 'Details ansehen'}
                        {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                     </div>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="px-6 pb-8 pt-2 border-t border-slate-200/50">
                        <p className="text-slate-700 mb-6 leading-relaxed font-medium" data-cc-field="description">
                           {job.description}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                           <div>
                              <h4 className="font-bold text-slate-900 mb-3">Deine Aufgaben</h4>
                              <ul className="space-y-2">
                                 {job.tasks.map((task, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                       <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0"></span>
                                       <span data-cc-field={`tasks[${i}]`}>{task}</span>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900 mb-3">Das bringst du mit</h4>
                              <ul className="space-y-2">
                                 {job.profile.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                       <span className="mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0"></span>
                                       <span data-cc-field={`profile[${i}]`}>{item}</span>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </div>

                        <div className="flex justify-end">
                           <a 
                             href={`mailto:karriere@novartum.com?subject=Bewerbung: ${job.title}`}
                             className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-orange-900/20 flex items-center gap-2"
                           >
                              Jetzt bewerben <ArrowRight size={18} />
                           </a>
                        </div>
                     </div>
                  </div>
               </div>
             );
           })}
        </div>
        
        <div className="text-center mt-12 text-slate-500 text-sm">
           Kein passender Job dabei? <a href="mailto:karriere@novartum.com?subject=Initiativbewerbung" className="text-orange-700 font-bold hover:underline">Initiativbewerbung senden</a>
        </div>
      </div>
    </section>
  );
};

export default JobBoard;