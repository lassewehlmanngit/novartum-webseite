import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceItem, ServicesProps } from '../types';
import SectionHeader from './SectionHeader';
import { IconMapper } from './IconMapper';

const ServiceCard: React.FC<ServiceItem> = ({ icon, title, description, link }) => {
  const CardContent = (
    <>
      <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-orange-700 mb-6 group-hover:bg-orange-700 group-hover:text-white transition-colors duration-300" aria-hidden="true">
        {typeof icon === 'string' ? <IconMapper name={icon} size={28} /> : icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 mb-8 text-sm leading-relaxed flex-grow">
        {description}
      </p>
      {link && (
        <span className="inline-flex items-center text-orange-700 font-bold text-sm group-hover:translate-x-1 transition-transform">
          Mehr erfahren <ChevronRight size={16} className="ml-1" aria-hidden="true" />
          <span className="sr-only">über {title}</span>
        </span>
      )}
    </>
  );

  const containerClasses = "bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col focus-within:ring-2 focus-within:ring-orange-500";

  if (link) {
    // If external or hash link
    if (link.startsWith('#')) {
      return (
        <a href={link} className={`${containerClasses} cursor-pointer`}>
          {CardContent}
        </a>
      );
    }
    // Internal router link
    return (
      <Link to={link} className={`${containerClasses} cursor-pointer`}>
        {CardContent}
      </Link>
    );
  }

  return (
    <article className={containerClasses}>
      {CardContent}
    </article>
  );
};

const Services: React.FC<ServicesProps> = ({ 
  title = "Leistungsspektrum", 
  subtitle = "Unsere Expertise", 
  description = "Wir decken den gesamten Lebenszyklus professioneller IT-Lösungen ab.", 
  items 
}) => {
  return (
    <section className="pt-24 pb-24 bg-slate-50" id="services" aria-labelledby="services-heading">
      <div className="container mx-auto px-4 md:px-12">
        <SectionHeader 
          title={title} 
          subtitle={subtitle} 
          description={description} 
          id="services-heading"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((service, idx) => (
            <ServiceCard key={idx} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
