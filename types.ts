import React from 'react';

export interface HeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  primaryButtonText?: string;
  primaryLink?: string;
  secondaryButtonText?: string;
  secondaryLink?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

export interface ServicesProps {
  title?: string;
  subtitle?: string;
  description?: string;
  items: ServiceItem[];
}

export interface CaseStudyItem {
  icon: React.ReactNode;
  category: string;
  title: string;
  challenge: string;
  solution: string;
  solution_long?: string;
  link?: string;
}

export interface CaseStudiesProps {
  title?: React.ReactNode;
  subtitle?: string;
  items: CaseStudyItem[];
}

// CMS Optimized Project Interface
export interface ProjectItem {
  id: string;
  slug: string; // CMS Identifier for Routing
  title: string;
  clientIndustry: string;
  clientName?: string; // Optional, often hidden in public case studies
  category: 'Software' | 'SAM' | 'Consulting' | 'IT-Procurement' | 'ITSM';
  
  // Teaser Content (Overview)
  shortDescription: string;
  
  // Deep Dive Content (Detail Page)
  challenge: string;
  solution: string;
  results: string[]; // Quantifiable results for AI Search
  
  // CMS Rich Text Simulation (HTML string)
  body?: string; 

  techStack: string[];
  
  // CMS Asset Object
  coverImage: {
    url: string;
    alt: string;
  };
  
  year: string;

  // CMS SEO Fields
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export interface ProjectsData {
  hero: HeroProps;
  items: ProjectItem[];
}

export interface AboutFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutProps {
  title: React.ReactNode;
  subtitle: string;
  text: React.ReactNode;
  stats: AboutStat[];
  features: AboutFeature[];
}

export interface TechCategoryItem {
  title: string;
  icon?: React.ReactNode;
  items: string[];
}

export interface TechStackProps {
  title?: string;
  subtitle?: string;
  description?: string;
  categories: TechCategoryItem[];
}

export interface MethodologyStep {
  number: string;
  title: string;
  description: string;
}

export interface MethodologyProps {
  title?: string;
  subtitle?: string;
  description?: string;
  steps?: MethodologyStep[];
  qualityTitle?: string;
  qualityItems?: string[];
}

export interface RoadmapStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface RoadmapProps {
  title?: string;
  subtitle?: string;
  description?: string;
  steps: RoadmapStep[];
}


export interface VendorIssue {
  vendor: string;
  logo: string;
  color: string;
  risks: string[];
  solution: string;
  label?: string; // Custom label override (e.g. "Herausforderung" instead of "Audit Fokus")
}

export interface VendorDeepDiveProps {
  title?: string;
  subtitle?: string;
  description?: string;
  vendors: VendorIssue[];
  id?: string;
}

export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export interface FAQProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; 
  date: string; 
  isoDate: string; 
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  tldr: string;
  faq?: { question: string; answer: string }[];
}

export interface BlogData {
  hero: HeroProps;
  posts: BlogPost[];
}

export interface ContactPerson {
  name: string;
  role: string;
  image: string;
  email: string;
  phone: string;
}

export interface FooterLink {
  label: string;
  link: string;
}

export interface FooterLinks {
  services: FooterLink[];
  company: FooterLink[];
  resources: FooterLink[];
  legal: FooterLink[];
}

export interface ContactFooterProps {
  contactPerson?: ContactPerson;
  contactPersonId?: string;
  links?: FooterLinks;
}

export interface BlogSectionProps {
  title?: React.ReactNode;
  subtitle?: string;
  posts: BlogPost[];
}

// Synergy / Cross-Pollination Interface
export interface SynergyItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface SynergyProps {
  title: string;
  subtitle: string;
  description: React.ReactNode;
  items: SynergyItem[];
}

// --- Team & Career & Partner Interfaces ---

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
  linkedin?: string;
}

export interface TeamData {
  hero: HeroProps;
  about: AboutProps; // Re-use About for general company intro
  members: TeamMember[];
}

export interface PartnerItem {
  name: string;
  type: string;
  description: string;
  logo: React.ReactNode; // Or string url
  link?: string;
}

export interface PartnerData {
  hero: HeroProps;
  intro: {
    title: string;
    subtitle: string;
    description: string;
  };
  partners: PartnerItem[];
}

export interface JobOffer {
  id: string;
  title: string;
  department: string;
  type: 'Vollzeit' | 'Teilzeit' | 'Freelance';
  location: string;
  description: string;
  tasks: string[];
  profile: string[];
}

export interface CareerData {
  hero: HeroProps;
  benefits: AboutProps; // Use About structure for benefits
  jobs: JobOffer[];
}

// --- Page Data Interfaces ---

export interface HomeData {
  hero: HeroProps;
  services: ServicesProps;
  about: AboutProps;
  caseStudies: CaseStudiesProps;
  blog: BlogSectionProps;
}

export interface SoftwareData {
  hero: HeroProps;
  services: ServicesProps;
  techStack: TechStackProps;
  roadmap: MethodologyProps; 
  about: AboutProps;
  caseStudies: CaseStudiesProps;
}

export interface SamData {
  hero: HeroProps;
  services: ServicesProps;
  vendorDetails: VendorDeepDiveProps;
  faq: FAQProps;
  methodology: MethodologyProps;
  about: AboutProps;
  caseStudies: CaseStudiesProps;
  synergy: SynergyProps; 
}

export interface ItsmData {
  hero: HeroProps;
  services: ServicesProps;
  challenges: VendorDeepDiveProps;
  roadmap: MethodologyProps; 
  about: AboutProps;
  faq: FAQProps;
  synergy: SynergyProps; 
}

export interface ProcurementData {
  hero: HeroProps;
  services: ServicesProps;
  challenges: VendorDeepDiveProps;
  roadmap: MethodologyProps;
  about: AboutProps;
  faq: FAQProps;
  synergy: SynergyProps; 
}

export interface ConsultingData {
  hero: HeroProps;
  services: ServicesProps;
  risks: VendorDeepDiveProps;
  roadmap: MethodologyProps;
  about: AboutProps;
  faq: FAQProps;
  synergy: SynergyProps;
}

export interface NavItem {
  label: string;
  link?: string;
  isAnchor?: boolean;
  children?: NavItem[];
}