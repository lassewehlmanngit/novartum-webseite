import React from 'react';
import Hero from './Hero';
import Services from './Services';
import About from './About';
import CaseStudies from './CaseStudies';
import TechStack from './TechStack';
import Methodology from './Methodology';
import SynergySection from './SynergySection';
import VendorDeepDive from './VendorDeepDive';
import FAQ from './FAQ';
import SAMCalculator from './SAMCalculator';
import Blog from './Blog'; // Home page blog teaser
import TeamGrid from './TeamGrid';
import PartnerGrid from './PartnerGrid';
import JobBoard from './JobBoard';
import BlogOverview from './BlogOverview';
import ProjectsOverview from './ProjectsOverview';
import TrustBar from './TrustBar';
import ExpertCTA from './ExpertCTA';
import { useCloudCannon } from '../contexts/CloudCannonContext';

const SLICE_MAP: Record<string, React.FC<any>> = {
  hero_slice: Hero,
  services_slice: Services,
  about_slice: About,
  case_studies_slice: CaseStudies,
  tech_stack_slice: TechStack,
  methodology_slice: Methodology,
  synergy_slice: SynergySection,
  vendor_deep_dive_slice: VendorDeepDive,
  faq_slice: FAQ,
  sam_calculator_slice: SAMCalculator,
  blog_slice: Blog,
  team_grid_slice: TeamGrid,
  partner_grid_slice: PartnerGrid,
  job_board_slice: JobBoard,
  blog_overview_slice: BlogOverview,
  projects_overview_slice: ProjectsOverview,
  trustbar_slice: TrustBar,
  expert_cta_slice: ExpertCTA,
};

interface SliceZoneProps {
  slices: any[];
  pageSlug?: string;
}

export const SliceZone = ({ slices, pageSlug }: SliceZoneProps) => {
  const { pageSlug: contextSlug } = useCloudCannon();
  const effectiveSlug = pageSlug || contextSlug || 'home';
  
  if (!slices) return null;

  // Determine the content path for CloudCannon
  const contentPath = `/content/pages/${effectiveSlug}.json`;

  return (
    <>
      {slices.map((slice, index) => {
        const Component = SLICE_MAP[slice._type];
        if (!Component) {
          console.warn(`Unbekannter Slice Typ: ${slice._type}`);
          return null;
        }
        return (
          <div
            key={index}
            data-cc-path={contentPath}
            data-cc-field={`content_blocks[${index}]`}
            data-cc-type={slice._type}
          >
            <Component {...slice} />
          </div>
        );
      })}
    </>
  );
};
