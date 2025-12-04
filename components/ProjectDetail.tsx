import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ProjectItem } from '../types';
import { ArrowLeft, CheckCircle2, Layers, Calendar, Building2, ArrowRight } from 'lucide-react';
import SEO from './SEO';

interface ProjectDetailProps {
  projects?: ProjectItem[];
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects: initialProjects }) => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Image fallback handling for header (must be declared before any early returns)
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (initialProjects && slug) {
      const found = initialProjects.find(p => p.slug === slug);
      if (found) {
        setProject(found);
        setLoading(false);
        return;
      }
    }

    if (slug) {
      fetch(`/content/projects/${slug}.json`)
        .then(res => {
          if (!res.ok) throw new Error('Project not found');
          return res.json();
        })
        .then(data => {
          setProject(data);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [slug, initialProjects]);

  // Early returns before accessing `project` details
  if (loading) return <div className="min-h-screen bg-white pt-32 text-center">Laden...</div>;
  if (error || !project) return <Navigate to="/projekte" replace />;

  // Schema.org for Case Study (AI Search Optimization)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article", // Or CaseStudy if supported by specific parsers, Article is safer
    "headline": project.title,
    "description": project.seo.metaDescription,
    "image": project.coverImage.url,
    "author": {
      "@type": "Organization",
      "name": "Novartum"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Novartum",
      "logo": {
        "@type": "ImageObject",
        "url": "https://novartum.com/logo.png"
      }
    },
    "about": {
        "@type": "Thing",
        "name": project.category
    },
    "datePublished": `${project.year}-01-01`
  };

  const getHeaderBackground = () => {
    switch (project.category) {
      case 'Software':
        return 'bg-blue-700';
      case 'SAM':
        return 'bg-orange-700';
      case 'IT-Procurement':
        return 'bg-emerald-700';
      case 'ITSM':
        return 'bg-indigo-700';
      default:
        return 'bg-slate-800';
    }
  };

  return (
    <article 
      className="min-h-screen bg-white pb-24"
      data-cc-path={`/content/projects/${slug}.json`}
    >
       <SEO 
         title={project.title}
         description={project.seo.metaDescription}
         image={project.coverImage.url}
         type="article"
       />
       {/* Inject Schema */}
       <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* Header Image Area */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {/* Background image or colored fallback */}
        <div className={`absolute inset-0 ${(!imageError && project.coverImage?.url) ? '' : getHeaderBackground()}`}>
          {!imageError && project.coverImage?.url && (
            <img 
              src={project.coverImage.url} 
              alt={project.coverImage.alt} 
              className="w-full h-full object-cover"
              data-cc-field="coverImage.url"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-16 md:pb-24">
             <div className="container mx-auto px-4 md:px-12">
                <Link to="/projekte" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2"/> Zurück zur Übersicht
                </Link>
                <div className="flex items-center gap-3 mb-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white`}
                      data-cc-field="category"
                    >
                        {project.category}
                    </span>
                    <span className="text-white/80 flex items-center gap-1 text-sm font-medium">
                        <Calendar size={14} /> <span data-cc-field="year">{project.year}</span>
                    </span>
                </div>
                <h1 
                  className="text-4xl md:text-5xl font-bold text-white max-w-4xl leading-tight"
                  data-cc-field="title"
                >
                    {project.title}
                </h1>
             </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 -mt-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-t-3xl p-8 md:p-12 shadow-sm border border-slate-100 min-h-[500px]">
                    
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs mb-6">
                        <Building2 size={16} /> <span data-cc-field="clientIndustry">{project.clientIndustry}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Die Ausgangslage</h2>
                    <p 
                      className="text-lg text-slate-600 leading-relaxed mb-12"
                      data-cc-field="challenge"
                    >
                        {project.challenge}
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Unsere Lösung</h2>
                    <p 
                      className="text-lg text-slate-600 leading-relaxed mb-8"
                      data-cc-field="solution"
                    >
                        {project.solution}
                    </p>

                    {/* CMS Body Content (Rich Text) */}
                    {project.body && (
                        <div 
                            className="prose prose-lg prose-slate max-w-none mb-12 text-slate-600"
                            dangerouslySetInnerHTML={{ __html: project.body }}
                            data-cc-field="body"
                        />
                    )}
                    
                    <div className="bg-slate-50 border-l-4 border-green-500 p-8 rounded-r-xl my-12">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                             <CheckCircle2 className="text-green-600" /> Ergebnisse
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {project.results.map((res, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div>
                                    <span className="font-bold text-slate-700" data-cc-field={`results[${idx}]`}>{res}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar / Meta Info */}
            <div className="lg:col-span-4 lg:pt-12">
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 sticky top-32">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Layers size={20} className="text-orange-600" /> Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.techStack.map((tech, idx) => (
                            <span key={tech} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm" data-cc-field={`techStack[${idx}]`}>
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 pt-8 mt-8">
                        <h4 className="font-bold text-slate-900 mb-2">Ähnliche Herausforderung?</h4>
                        <p className="text-sm text-slate-500 mb-6">
                            Lassen Sie uns darüber sprechen, wie wir diese Ergebnisse für Ihr Unternehmen replizieren können.
                        </p>
                        <a href="#contact" className="flex items-center justify-center w-full bg-orange-700 text-white font-bold py-3 rounded-xl hover:bg-orange-800 transition-colors shadow-lg shadow-orange-900/10">
                            Projekt anfragen <ArrowRight size={18} className="ml-2"/>
                        </a>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </article>
  );
};

export default ProjectDetail;