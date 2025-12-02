import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from './SEO';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <SEO 
        title="404 - Seite nicht gefunden" 
        description="Die gesuchte Seite konnte leider nicht gefunden werden."
      />
      
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-slate-200 mb-8">404</h1>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Hoppla! Seite nicht gefunden.
        </h2>
        
        <p className="text-slate-600 mb-10 text-lg leading-relaxed">
          Die Seite, die Sie suchen, wurde möglicherweise verschoben, gelöscht oder existiert gar nicht mehr.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors w-full sm:w-auto shadow-lg shadow-orange-900/20"
          >
            <Home size={18} /> Zur Startseite
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto"
          >
            <ArrowLeft size={18} /> Zurück
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

