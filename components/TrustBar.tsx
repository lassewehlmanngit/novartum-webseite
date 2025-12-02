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
         logoElement = <span className={`${baseLogoClasses} text-2xl font-bold text-slate-700`}>{client.logo}</span>;
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
             
             {/* Badges Container */}
             <div className="flex gap-3 shrink-0">
                {/* Badge 1 */}
                <div className="w-20 h-24 bg-gradient-to-b from-[#b4985a] to-[#8c733f] shadow-md flex flex-col items-center justify-center text-white p-1 relative overflow-hidden rounded-sm group">
                   <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                   <span className="font-serif font-bold text-2xl leading-none">TOP</span>
                   <span className="text-[0.6rem] font-bold uppercase tracking-tighter leading-tight text-center mt-1">CONSULTANT</span>
                   <div className="w-8 h-px bg-white/50 my-1"></div>
                   <span className="text-[0.6rem]">2023</span>
                </div>

                {/* Badge 2 */}
                <div className="w-20 h-24 bg-gradient-to-b from-[#a83232] to-[#7a1f1f] shadow-md flex flex-col items-center justify-center text-white p-1 relative overflow-hidden rounded-sm group">
                   <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 delay-100"></div>
                   <span className="font-serif font-bold text-2xl leading-none">TOP</span>
                   <span className="text-[0.6rem] font-bold uppercase tracking-tighter leading-tight text-center mt-1">KATEGORIE</span>
                   <div className="w-8 h-px bg-white/50 my-1"></div>
                   <span className="text-[0.5rem] uppercase">IT-Beratung</span>
                </div>
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
