import React from 'react';

interface LegalPageProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-12 max-w-4xl">
        <header className="mb-12 border-b border-slate-200 pb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{title}</h1>
            {lastUpdated && (
            <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Stand: {lastUpdated}
            </p>
            )}
        </header>
        
        <div className="prose prose-lg prose-slate max-w-none 
            prose-headings:font-bold prose-headings:text-slate-900 
            prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-6
            prose-p:leading-relaxed prose-p:text-slate-600
            prose-li:text-slate-600
            prose-strong:text-slate-800 prose-strong:font-bold
            prose-a:text-orange-700 prose-a:no-underline hover:prose-a:underline
            marker:text-orange-500">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;