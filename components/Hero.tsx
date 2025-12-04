import React from 'react';
import { Link } from 'react-router-dom';
import { HeroProps } from '../types';
import { trackCTAClick } from '../utils/analytics';
import { useCloudCannon } from '../contexts/CloudCannonContext';

const Hero: React.FC<HeroProps> = ({
  tagline,
  title,
  description,
  primaryButtonText = "Projekt anfragen",
  secondaryButtonText = "Mehr erfahren",
  primaryLink,
  secondaryLink,
  onPrimaryClick,
  onSecondaryClick
}) => {
  const { contentPath } = useCloudCannon();
  
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const elementId = id.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderButton = (text: string, link?: string, onClick?: () => void, variant: 'primary' | 'secondary' = 'primary') => {
    const baseClasses = variant === 'primary' 
      ? "bg-orange-700 hover:bg-orange-800 text-white shadow-xl shadow-orange-900/20 focus:ring-orange-700" 
      : "bg-transparent border border-slate-600 hover:border-white text-slate-300 hover:text-white focus:ring-slate-500";
    
    const classes = `${baseClasses} px-8 py-4 rounded-lg font-semibold text-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 w-full sm:w-auto inline-flex justify-center items-center cursor-pointer`;

    const handleClick = () => {
      trackCTAClick(text, 'Hero');
      if (onClick) onClick();
    };

    if (link) {
      if (link.startsWith('#')) {
         return (
           <a 
             href={link} 
             onClick={(e) => {
               handleClick();
               handleScrollTo(e, link);
             }} 
             className={classes}
           >
             {text}
           </a>
         );
      }
      return (
        <Link to={link} onClick={handleClick} className={classes}>
          {text}
        </Link>
      );
    }
    
    return (
      <button onClick={handleClick} className={classes}>
        {text}
      </button>
    );
  };

  return (
    <section className="relative bg-[#15171e] text-white pt-32 pb-40 md:pt-48 md:pb-48 overflow-hidden" aria-label="Einleitung">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-900/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-900/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" aria-hidden="true"></div>

      <div className="container mx-auto px-4 md:px-12 relative z-10 text-center flex flex-col items-center">
        <div 
          className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 font-medium text-sm mb-8"
          {...(contentPath && {
            'data-cc-field': 'tagline',
            'data-cc-type': 'text'
          })}
        >
          {tagline}
        </div>
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] tracking-tight max-w-5xl"
          {...(contentPath && {
            'data-cc-field': 'title',
            'data-cc-type': 'text'
          })}
        >
          {typeof title === 'string' ? <span dangerouslySetInnerHTML={{ __html: title }} /> : title}
        </h1>
        
        <p 
          className="max-w-3xl mx-auto text-slate-300 text-lg md:text-xl mb-10 leading-relaxed font-light"
          {...(contentPath && {
            'data-cc-field': 'description',
            'data-cc-type': 'textarea'
          })}
        >
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          {renderButton(primaryButtonText, primaryLink, onPrimaryClick, 'primary')}
          {secondaryButtonText && (secondaryLink || onSecondaryClick) && (
            renderButton(secondaryButtonText, secondaryLink, onSecondaryClick, 'secondary')
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
