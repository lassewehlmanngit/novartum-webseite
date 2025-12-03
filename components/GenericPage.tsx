import React, { useEffect, useState } from 'react';
import { SliceZone } from './SliceZone';
import SEO from './SEO';
import { Helmet } from 'react-helmet-async';
import { useTimeOnPageTracking } from '../hooks/useTimeOnPageTracking';
import { CloudCannonProvider } from '../contexts/CloudCannonContext';

interface PageData {
  title: string;
  content_blocks: any[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
  };
}

export const GenericPage = ({ slug }: { slug: string }) => {
  const [data, setData] = useState<PageData | null>(null);
  const [error, setError] = useState<boolean>(false);
  
  // Track time on page as micro-conversion
  useTimeOnPageTracking();

  useEffect(() => {
    // Determine file path: /content/pages/home.json
    const jsonPath = `/content/pages/${slug}.json`;
    
    fetch(jsonPath)
      .then(res => {
        if (!res.ok) throw new Error('Page not found');
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, [slug]);

  if (error) return <div className="pt-32 text-center">Seite nicht gefunden (404)</div>;
  if (!data) return <div className="pt-32 text-center">Laden...</div>;

  // Service Schema Injection (for specific pages)
  const isServicePage = ['consulting', 'software', 'sam', 'itsm', 'einkauf'].includes(slug);
  const serviceSchema = isServicePage ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.title,
    "provider": {
      "@type": "Organization",
      "name": "Novartum GmbH"
    },
    "description": data.seo?.metaDescription || `Professionelle ${data.title} Dienstleistungen.`,
    "areaServed": "DE",
    "url": `https://novartum.com/${slug}`
  } : null;

  const contentPath = `/content/pages/${slug}.json`;

  return (
    <CloudCannonProvider pageSlug={slug} contentPath={contentPath}>
      <main data-cc-path={contentPath}>
        <SEO 
          title={data.seo?.metaTitle || data.title} 
          description={data.seo?.metaDescription}
          keywords={data.seo?.metaKeywords}
          image={data.seo?.ogImage}
        />
        
        {/* Schema Injection */}
        {serviceSchema && (
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify(serviceSchema)}
            </script>
          </Helmet>
        )}

        {/* AI Context Block (Visually Hidden) */}
        <div className="sr-only">
          <h1>{data.title}</h1>
          <p>
            Novartum GmbH bietet spezialisierte Dienstleistungen im Bereich {data.title}. 
            {data.seo?.metaDescription || "Wir unterstützen Unternehmen bei der Optimierung ihrer IT-Landschaft."}
            Dieser Bereich umfasst: {data.content_blocks.map((block: any) => block.title).join(', ')}.
          </p>
        </div>

        <SliceZone slices={data.content_blocks} pageSlug={slug} />
      </main>
    </CloudCannonProvider>
  );
};
