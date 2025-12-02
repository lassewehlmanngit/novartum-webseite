import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';

interface HeaderProps {
  navigation?: NavItem[];
  logo?: string;
  variant?: 'transparent' | 'solid';
}

const Header: React.FC<HeaderProps> = ({ navigation = [], logo, variant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<number | null>(null);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const location = useLocation();

  const isSolidPage = location.pathname.startsWith('/blog/') || location.pathname.startsWith('/impressum') || location.pathname.startsWith('/datenschutz') || location.pathname.startsWith('/agb');
  const effectiveVariant = variant || (isSolidPage ? 'solid' : 'transparent');
  const isSolid = effectiveVariant === 'solid';

  // Scroll Detection Logic
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky nav after scrolling past typical Hero height (approx 600px)
      // For solid variant (like on blog posts), show sticky nav sooner or always?
      // Keeping original behavior but can adjust if needed.
      if (window.scrollY > 600) {
        setShowStickyNav(true);
      } else {
        setShowStickyNav(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elementId = id.startsWith('#') ? id.substring(1) : id;
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };
  
  // Navigation Items
  const navItems = navigation.length > 0 ? navigation : [
    { label: "Software", link: "/software" },
    { label: "SAM", link: "/sam" },
  ];

  const toggleMobileSubMenu = (index: number) => {
    setMobileSubMenuOpen(mobileSubMenuOpen === index ? null : index);
  };

  const isActive = (link?: string) => link && location.pathname === link;

  const renderLogo = (isSmall = false, isDark = false) => {
    // Always use the SVG logo now
    return <img src="/logo.svg" alt="Novartum Logo" className={`${isSmall ? 'h-8' : 'h-10'} w-auto`} />;
  };

  const headerTextColor = isSolid ? 'text-slate-700' : 'text-slate-200';
  const headerHoverColor = isSolid ? 'hover:text-orange-700' : 'hover:text-white';
  const activeColor = isSolid ? 'text-orange-700 font-bold' : 'text-white font-bold';

  return (
    <>
      {/* --- STANDARD ABSOLUTE HEADER (Initial View) --- */}
      <header className={`absolute top-0 left-0 w-full z-40 py-6 px-4 md:px-8 lg:px-12 ${isSolid ? 'bg-white border-b border-slate-100' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center gap-2 group ${isSolid ? 'text-slate-900' : 'text-white'} outline-none focus:ring-2 focus:ring-orange-500 rounded-lg p-1 z-50 relative`} 
            aria-label="Novartum Startseite"
          >
             {renderLogo(false, isSolid)}
          </Link>

          {/* Desktop Menu - Initial View */}
          <nav className={`hidden md:flex items-center space-x-8 text-sm font-medium ${headerTextColor}`} aria-label="Hauptnavigation">
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.link || '#'} 
                className={`transition-colors ${headerHoverColor} ${isActive(item.link) ? activeColor : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons & Action Links (Initial View) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/projekte" 
              className={`text-sm font-medium transition ${headerHoverColor} ${isActive('/projekte') ? activeColor : headerTextColor}`}
            >
              Projekte
            </Link>
            <Link 
              to="/blog" 
              className={`text-sm font-medium transition ${headerHoverColor} ${isActive('/blog') ? activeColor : headerTextColor}`}
            >
              Blog
            </Link>
            <button 
              onClick={() => handleScrollTo('contact')}
              className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-lg hover:shadow-orange-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:ring-offset-slate-900"
            >
              Kontaktieren
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden ${isSolid ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'} p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 z-50 relative`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* --- STICKY ANIMATED HEADER (Scroll View - Desktop Only) --- */}
      <div 
        className={`fixed top-0 left-0 w-full z-50 bg-[#15171e]/95 backdrop-blur-md border-b border-slate-700 transition-transform duration-500 ease-in-out hidden md:flex items-center shadow-2xl ${
          showStickyNav ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4 flex justify-between items-center">
           
           {/* Mini Logo */}
           <Link to="/" onClick={() => handleScrollTo('top')} className="flex items-center gap-2 group text-white">
              {renderLogo(true)}
           </Link>

           {/* Centered Service Navigation */}
           <nav className="flex items-center gap-6 lg:gap-8">
              {navItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.link || '#'} 
                  className={`text-sm font-medium transition-colors hover:text-orange-500 ${isActive(item.link) ? 'text-orange-500 font-bold' : 'text-slate-300'}`}
                >
                  {item.label}
                </Link>
              ))}
           </nav>

           {/* Right Actions: Contact + Back to Top */}
           <div className="flex items-center gap-4">
              <button 
                onClick={() => handleScrollTo('contact')}
                className="bg-orange-700 hover:bg-orange-800 text-white px-5 py-2 rounded-lg text-sm font-bold transition shadow-lg"
              >
                Kontaktieren
              </button>
              
              <div className="w-px h-6 bg-slate-700"></div>

              <button
                onClick={() => handleScrollTo('top')}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Zurück nach oben"
              >
                <ArrowUp size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY (Standard) --- */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#15171e] z-40 pt-24 px-6 flex flex-col overflow-y-auto animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item, index) => {
              if (item.children) {
                 return (
                   <div key={index} className="border-b border-[#2a2e3b] pb-2">
                      <button 
                        onClick={() => toggleMobileSubMenu(index)}
                        className="flex items-center justify-between w-full text-lg font-medium text-slate-200 py-3 hover:text-white"
                      >
                        {item.label}
                        <ChevronDown size={20} className={`transition-transform duration-300 ${mobileSubMenuOpen === index ? 'rotate-180' : ''}`}/>
                      </button>
                      
                      {mobileSubMenuOpen === index && (
                        <div className="pl-4 flex flex-col space-y-2 pb-2 animate-in slide-in-from-top-2">
                           {item.children.map((child, cIdx) => (
                             <Link
                               key={cIdx}
                               to={child.link || '#'}
                               onClick={() => setIsOpen(false)}
                               className={`block py-2 text-base ${isActive(child.link) ? 'text-orange-500 font-bold' : 'text-slate-400 hover:text-white'}`}
                             >
                               {child.label}
                             </Link>
                           ))}
                        </div>
                      )}
                   </div>
                 );
              }

              return (
                <Link 
                  key={index}
                  to={item.link || '#'} 
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium py-3 border-b border-[#2a2e3b] block ${isActive(item.link) ? 'text-white font-bold' : 'text-slate-200 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile Extras */}
            <Link 
              to="/projekte"
              onClick={() => setIsOpen(false)} 
              className={`text-lg font-medium py-3 border-b border-[#2a2e3b] block ${isActive('/projekte') ? 'text-white font-bold' : 'text-slate-200 hover:text-white'}`}
            >
              Projekte
            </Link>
            <Link 
              to="/blog"
              onClick={() => setIsOpen(false)} 
              className={`text-lg font-medium py-3 border-b border-[#2a2e3b] block ${isActive('/blog') ? 'text-white font-bold' : 'text-slate-200 hover:text-white'}`}
            >
              Blog
            </Link>
          </nav>
          
          <div className="mt-8">
            <button 
              onClick={() => handleScrollTo('contact')}
              className="w-full bg-orange-700 text-white px-4 py-4 rounded-xl text-center font-bold text-lg hover:bg-orange-800 shadow-lg"
            >
              Kontaktieren
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
