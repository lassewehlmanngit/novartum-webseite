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

  // Duplicate clients to create a seamless loop
  // For <10 clients we repeat 4 times, otherwise 2 times is enough for the scroll effect
  const repeatCount = data.clients.length < 10 ? 4 : 2;
  const marqueeClients = Array(repeatCount).fill(data.clients).flat();

  const renderClientLogo = (client: { name: string; logo: string }) => {
     // Image Logo
     if (client.logo.startsWith('/') || client.logo.startsWith('http')) {
        return <img src={client.logo} alt={client.name} className="h-8 md:h-10 w-auto object-contain" />;
     }

     // Fallback for hardcoded vector logos (for legacy support during migration)
     let logoElement: React.ReactNode;
     const baseLogoClasses = "h-8 md:h-10 flex items-center transition-all duration-300";
     
     switch(client.name) {
       case "DZ BANK":
         logoElement = <span className={`${baseLogoClasses} text-2xl md:text-3xl font-bold tracking-tighter text-slate-800`}>DZ BANK</span>;
         break;
       case "Deutsche Telekom":
         logoElement = (
           <div className={`${baseLogoClasses} flex items-center gap-0.5 text-[#e20074]`}>
             <div className="w-2.5 h-2.5 bg-current rounded-sm"></div>
             <span className="font-black text-3xl md:text-4xl leading-none -mt-1">T</span>
             <div className="w-2.5 h-2.5 bg-current rounded-sm"></div>
           </div>
         );
         break;
       case "E.ON":
         logoElement = <span className={`${baseLogoClasses} text-2xl md:text-3xl font-black text-[#E30613] tracking-tighter`}>e.on</span>;
         break;
       case "Lufthansa":
         logoElement = <span className={`${baseLogoClasses} text-2xl md:text-3xl font-serif font-medium text-slate-800`}>Lufthansa</span>;
         break;
       case "SAP":
         logoElement = <span className={`${baseLogoClasses} text-2xl md:text-3xl font-bold text-[#008FD3]`}>SAP</span>;
         break;
       case "Allianz":
         logoElement = <span className={`${baseLogoClasses} text-2xl md:text-3xl font-serif font-bold tracking-wide text-slate-800`}>Allianz</span>;
         break;
       default:
         // Generic text fallback for clients without a logo image or special case
         logoElement = (
            <span className="text-xl font-bold text-slate-800 whitespace-nowrap">
             {client.name}
           </span>
         );
         break;
     }

     return logoElement;
  };

  return (
    <section className="bg-white relative z-20 rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-16" aria-labelledby="trust-heading">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: scroll 60s linear infinite; /* Slow, smooth speed */
        }
        .animate-marquee:hover {
          animation-play-state: paused; /* Pause on hover for interaction */
        }
      `}</style>
      
      {/* Awards Floating Badge */}
      <div className="relative -top-16 md:-top-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12 border border-slate-100">
             
             {/* Badges Container */}
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

      <div className="container mx-auto text-center mt-4 pb-20">
        <h3 id="trust-heading" className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12" data-cc-field="title">{data.title}</h3>
        
        {/* Infinite Marquee Container */}
        <div className="relative w-full overflow-hidden">
           
           {/* Fade Gradients (Left & Right) for that "premium" look */}
           <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
           <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

           {/* Scrolling Track */}
           <div className="flex w-max animate-marquee">
              {marqueeClients.map((client, idx) => (
                <div 
                  key={`${client.name}-${idx}`} 
                  className="mx-8 md:mx-12 shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default select-none flex items-center justify-center"
                >
                 {renderClientLogo(client)}
               </div>
           ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;