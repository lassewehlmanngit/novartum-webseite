import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Professionelles Lizenzmanagement, Software Asset Management und IT-Beratung von Novartum.", 
  image, 
  url, 
  type = 'website',
  author = "Novartum GmbH",
  keywords = [],
  canonicalUrl
}) => {
  const siteTitle = "Novartum - Lizenzmanagement & IT-Services";
  const fullTitle = title === "Home" ? siteTitle : `${title} | Novartum`;
  const currentUrl = url || typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="Novartum" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;

