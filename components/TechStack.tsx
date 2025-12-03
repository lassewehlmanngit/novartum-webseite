import React from 'react';
import { Layers } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { IconMapper } from './IconMapper';

export interface TechCategoryItem {
  title: string;
  icon?: React.ReactNode | string;
  items: string[];
}

interface TechStackProps {
  title?: string;
  subtitle?: string;
  description?: string;
  categories: TechCategoryItem[];
}

const TechCategory: React.FC<TechCategoryItem> = ({ title, icon, items }) => (
  <div className="bg-[#1f222b] p-6 rounded-xl border border-[#2a2e3b] hover:border-orange-700/50 transition-colors h-full">
    <div className="flex items-center gap-3 mb-6">
      <div className="text-orange-500" data-cc-field="icon">
        {typeof icon === 'string' ? <IconMapper name={icon} size={24} /> : (icon || <Layers size={24}/>)}
      </div>
      <h3 className="text-white font-bold text-lg" data-cc-field="title">{title}</h3>
    </div>
    <ul className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <li key={item} className="px-3 py-1 bg-[#2a2e3b] text-slate-300 text-sm rounded-md font-medium" data-cc-field={`items[${idx}]`}>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const TechStack: React.FC<TechStackProps> = ({
  subtitle = "State of the Art",
  title = "Unser Technologie-Stack",
  description = "Wir setzen auf bewährte Technologien.",
  categories
}) => {
  return (
    <section className="py-24 bg-[#15171e]" id="techstack" aria-labelledby="tech-heading">
      <div className="container mx-auto px-4 md:px-12">
        <SectionHeader 
          title={<span data-cc-field="title">{title}</span>}
          subtitle={<span data-cc-field="subtitle">{subtitle}</span>}
          description={<span data-cc-field="description">{description}</span>}
          dark={true}
          align="left"
          id="tech-heading"
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} data-cc-field={`categories[${idx}]`} className="h-full">
                <TechCategory {...cat} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
