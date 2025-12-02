import React, { useEffect, useState } from 'react';

interface TrustBarProps {
  title?: string;
  clients?: { name: string; logo: string }[];
}

const TrustBar: React.FC<TrustBarProps> = ({ 
  title: initialTitle, 
  clients: initialClients 
}) => {
  const [data, setData] = useState<{ title: string; clients: { name: string; logo: string }[] }>({
    title: initialTitle || "Unsere Kunden vertrauen uns",
    clients: initialClients || []
  });

  useEffect(() => {
    if (!initialClients) {
      fetch('/content/globals/trustbar.json')
        .then(res => res.json())
        .then(fetchedData => {
          if (fetchedData) {
            setData({
              title: fetchedData.title || initialTitle || "Unsere Kunden vertrauen uns",
              clients: fetchedData.clients || []
            });
          }
        })
        .catch(console.error);
    } else {
        setData({ title: initialTitle || "Unsere Kunden vertrauen uns", clients: initialClients });
    }
  }, [initialClients, initialTitle]);

  if (!data.clients || data.clients.length === 0) return null;

  const renderClientLogo = (client: { name: string; logo: string }) => {
     // If logo is a file path (starts with / or http), render image
     if (client.logo.startsWith('/') || client.logo.startsWith('http')) {
        return <img src={client.logo} alt={client.name} className="h-9 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300" />;
     }

     // Fallback for hardcoded vector logos (for legacy support during migration)
     let logoElement: React.ReactNode;
     const baseLogoClasses = "h-9 flex items-center transition-all duration-300";
     
     switch(client.name) {
       case "DZ BANK":
         logoElement = <span className={`${baseLogoClasses} text-3xl font-bold tracking-tighter text-slate-800`}>DZ BANK</span>;
         break;
       case "Deutsche Telekom":
         logoElement = (
           <div className={`${baseLogoClasses} flex items-center gap-0.5 text-[#e20074]`}>
             <div className="w-2.5 h-2.5 bg-current rounded-sm"></div>
             <span className="font-black text-4xl leading-none -mt-1">T</span>
             <div className="w-2.5 h-2.5 bg-current rounded-sm"></div>
           </div>
         );
         break;
       case "E.ON":
         logoElement = <span className={`${baseLogoClasses} text-3xl font-black text-[#E30613] tracking-tighter`}>e.on</span>;
         break;
       case "Lufthansa":
         logoElement = <span className={`${baseLogoClasses} text-3xl font-serif font-medium text-slate-800`}>Lufthansa</span>;
         break;
       case "SAP":
         logoElement = <span className={`${baseLogoClasses} text-3xl font-bold text-[#008FD3]`}>SAP</span>;
         break;
       case "Allianz":
         logoElement = <span className={`${baseLogoClasses} text-3xl font-serif font-bold tracking-wide text-slate-800`}>Allianz</span>;
         break;
       default:
         // Generic text fallback for clients without a logo image or special case
         logoElement = (
           <span className={`${baseLogoClasses} px-4 py-2 rounded-lg bg-slate-50 border border-slate-100 text-lg font-bold text-slate-600 whitespace-nowrap shadow-sm`}>
             {client.name}
           </span>
         );
         break;
     }

     return (
        <div className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300" title={client.name}>
          {logoElement}
        </div>
     );
  };

  return (
    <section className="bg-white relative z-20 rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-16" aria-labelledby="trust-heading">
      
      {/* Awards Floating Badge */}
      <div className="relative -top-16 md:-top-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12 border border-slate-100">
             
             {/* Badges Container - NEU: Siegel Bilder */}
             <div className="flex gap-6 shrink-0 items-center justify-center">
                <img 
                  src="/images/awards/bvmid-siege-top.png" 
                  alt="BVMID Auszeichnung 1" 
                  className="h-28 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
                <img 
                  src="/images/awards/bvmid-siegel-1.png" 
                  alt="BVMID Auszeichnung 2" 
                  className="h-28 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
             </div>

             {/* Text Content */}
             <div className="text-center md:text-left">
                <h2 className="font-bold text-xl md:text-2xl text-slate-900 mb-2">
                  Novartum – ausgezeichnet vom BVMID.
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Wir gehören zu den besten IT-Beratern für den Mittelstand. <br className="hidden md:inline"/>
                  Qualität, die durch unabhängige Audits bestätigt wurde.
                </p>
             </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 text-center mt-4 pb-16">
        <h3 id="trust-heading" className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">{data.title}</h3>
        
        <div className="flex flex-wrap justify-center gap-x-12 sm:gap-x-16 gap-y-12 items-center">
           {data.clients.map((client) => (
             <React.Fragment key={client.name}>
               {renderClientLogo(client)}
             </React.Fragment>
           ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
