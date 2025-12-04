import React, { useState, useEffect } from 'react';
import { ProjectsData, ProjectItem } from '../types';
import Hero from './Hero';
import { CheckCircle2, Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectsOverviewProps {
  data?: ProjectsData;
}

const ProjectCard: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const [imageError, setImageError] = useState(false);

  // Fallback pattern logic based on category
  const getFallbackPattern = () => {
    switch (project.category) {
      case 'Software': return 'bg-blue-600';
      case 'SAM': return 'bg-orange-600';
      case 'IT-Procurement': return 'bg-emerald-600';
      case 'ITSM': return 'bg-indigo-600';
      default: return 'bg-purple-600';
    }
  };

  return (
  <article className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 group">
    {/* Card Image Header */}
    <Link to={`/projekte/${project.slug}`} className="h-48 overflow-hidden relative block">
        {!imageError ? (
            <img 
                src={project.coverImage.url} 
                alt={project.coverImage.alt} 
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
        ) : (
            <div className={`w-full h-full ${getFallbackPattern()} flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-700`}>
                <div className="text-white opacity-20 transform -rotate-12 scale-150 font-bold text-4xl">
                    {project.category}
                </div>
            </div>
        )}
        <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
            project.category === 'Software' ? 'bg-blue-100 text-blue-700' :
            project.category === 'SAM' ? 'bg-orange-100 text-orange-700' :
            project.category === 'IT-Procurement' ? 'bg-emerald-100 text-emerald-700' :
            project.category === 'ITSM' ? 'bg-indigo-100 text-indigo-700' :
            'bg-purple-100 text-purple-700'
            }`}>
            {project.category}
            </span>
        </div>
    </Link>

    <div className="p-8 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{project.clientIndustry}</span>
        <span className="text-slate-400 text-sm font-medium">{project.year}</span>
      </div>

      <Link to={`/projekte/${project.slug}`}>
        <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-orange-700 transition-colors">
            {project.title}
        </h3>
      </Link>
      
      <p className="text-slate-700 text-sm mb-6 line-clamp-3 leading-relaxed">
          {project.shortDescription}
      </p>

      {/* Results Snippet */}
      {project.results && project.results.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
            <strong className="block text-slate-900 text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-600"/> Key Results
            </strong>
            <ul className="space-y-2">
                {project.results.slice(0, 2).map((res, i) => (
                    <li key={i} className="text-slate-700 text-sm font-medium flex items-start gap-2">
                        <span className="block w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></span>
                        <span className="line-clamp-2">{res}</span>
                    </li>
                ))}
            </ul>
            {project.results.length > 2 && (
                <p className="text-xs text-slate-400 mt-2 pl-3.5">+ {project.results.length - 2} weitere Ergebnisse</p>
            )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
         <div className="flex -space-x-2 overflow-hidden">
             {/* Tech Stack Preview (Circles) */}
            {project.techStack.slice(0, 3).map((tech, idx) => (
                <div key={idx} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500" title={tech}>
                    {tech.substring(0,2)}
                </div>
            ))}
            {project.techStack.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                    +{project.techStack.length - 3}
                </div>
            )}
         </div>

         <Link to={`/projekte/${project.slug}`} className="text-orange-700 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Details <ArrowRight size={16} />
         </Link>
      </div>
    </div>
  </article>
)};

const ProjectsOverview: React.FC<ProjectsOverviewProps> = ({ data: initialData }) => {
  // Since we don't have a single JSON for all projects yet (projects are individual files), 
  // we would typically need an index file generated by CloudCannon or fetch them individually.
  // For this migration phase, if `initialData` (from data/projects.tsx) is missing, 
  // we would need a mechanism to load all projects.
  // However, without a pre-built index.json of all projects, fetching list of files client-side isn't standard.
  // Assuming for now either props are passed (from GenericPage via slice if implemented there? No, GenericPage fetches page.json)
  // OR we rely on `projects/index.json` which we haven't created.
  
  // Let's assume we might need to create `projects/index.json` similar to `blog/index.json` if we want full dynamic loading.
  // I will add a TODO to create `projects/index.json` if I haven't already (I created individual files).
  // But wait, the `projects_overview_slice` in `cloudcannon.config.yml` suggests this might be used in a page.
  
  const [data, setData] = useState<ProjectsData | undefined>(initialData);
  const [filter, setFilter] = useState<'All' | 'Software' | 'SAM' | 'Consulting' | 'IT-Procurement' | 'ITSM'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!initialData) {
      fetch('/content/projects/index.json')
        .then(res => res.json())
        .then(fetchedData => {
            // @ts-ignore
            setData({ items: fetchedData, hero: undefined });
        })
        .catch(console.error);
    }
  }, [initialData]);

  if (!data && !initialData) {
      return <div className="py-24 text-center">Laden...</div>; 
  }
  
  const currentData = data || initialData!;
  const items = currentData.items || [];

  const filteredProjects = items.filter(item => {
    const matchesCategory = filter === 'All' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          item.clientIndustry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Schema.org Data Generation for Collection Page
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Novartum Projekte & Referenzen",
    "description": "Übersicht erfolgreicher IT-Projekte, SAM-Audits und Softwareentwicklungen.",
    "hasPart": filteredProjects.map(project => ({
      "@type": "CreativeWork",
      "headline": project.title,
      "about": project.clientIndustry,
      "abstract": project.shortDescription,
      "keywords": project.techStack.join(", ")
    }))
  };

  return (
    <>
        {/* Inject Schema */}
        <script type="application/ld+json">
            {JSON.stringify(schemaData)}
        </script>

        {currentData.hero && <Hero {...currentData.hero} />}
        
        <section className="py-12 bg-slate-50 border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-slate-50/90">
            <div className="container mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Filters */}
                <div className="flex p-1 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden overflow-x-auto">
                    {(['All', 'Software', 'SAM', 'Consulting', 'IT-Procurement', 'ITSM'] as const).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                                filter === cat 
                                ? 'bg-slate-800 text-white shadow-md' 
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {cat === 'All' ? 'Alle Projekte' : cat}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Technologie, Branche..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-sm"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
            </div>
        </section>

        <section className="py-24 bg-white min-h-screen">
            <div className="container mx-auto px-4 md:px-12">
                
                <div className="mb-10">
                   <h2 className="text-xl md:text-2xl font-semibold text-slate-900 flex items-center gap-2">
                      {filteredProjects.length} {filteredProjects.length === 1 ? 'Projekt' : 'Projekte'} gefunden
                      {filter !== 'All' && <span className="text-orange-700">in {filter}</span>}
                   </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                        <Filter size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Keine Projekte gefunden</h3>
                        <p className="text-slate-500">Versuchen Sie es mit anderen Filterkriterien oder Suchbegriffen.</p>
                        <button 
                            onClick={() => {setFilter('All'); setSearchTerm('');}}
                            className="mt-6 text-orange-700 font-bold hover:underline"
                        >
                            Filter zurücksetzen
                        </button>
                    </div>
                )}
            </div>
        </section>
    </>
  );
};

export default ProjectsOverview;
