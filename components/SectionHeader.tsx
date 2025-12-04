import React from 'react';

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  dark?: boolean; // If true, optimizes text colors for dark backgrounds
  className?: string;
  id?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  description, 
  align = 'center', 
  dark = false,
  className = '',
  id
}) => {
  const alignmentClass = align === 'left' ? 'text-left' : 'text-center';
  const subtitleColor = dark ? 'text-orange-500' : 'text-orange-700';
  const titleColor = dark ? 'text-white' : 'text-slate-900';
  const descColor = dark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`${alignmentClass} mb-16 ${className}`}>
      {subtitle && (
        <span className={`${subtitleColor} font-bold text-sm uppercase tracking-wider block mb-2`}>
          {subtitle}
        </span>
      )}
      <h2 id={id} className={`text-2xl md:text-3xl font-bold ${titleColor} mb-6`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 ${descColor} max-w-2xl text-lg leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;