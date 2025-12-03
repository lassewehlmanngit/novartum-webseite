import React, { useEffect, useState } from 'react';
import LegalPage from './LegalPage';
import { MarkdownContent } from './MarkdownContent';
import frontMatter from 'front-matter';
import SEO from './SEO';

interface DynamicLegalPageProps {
  slug: string;
  title: string;
}

interface FrontMatterAttributes {
  title?: string;
  lastUpdated?: string;
  [key: string]: any;
}

export const DynamicLegalPage: React.FC<DynamicLegalPageProps> = ({ slug, title: defaultTitle }) => {
  const [content, setContent] = useState<string>('');
  const [pageTitle, setPageTitle] = useState<string>(defaultTitle);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/content/legal/${slug}.md`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(text => {
        const { body, attributes } = frontMatter<FrontMatterAttributes>(text);
        setContent(body);
        if (attributes.title) {
          setPageTitle(attributes.title);
        }
        if (attributes.lastUpdated) {
          setLastUpdated(attributes.lastUpdated);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error loading legal page ${slug}:`, err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <LegalPage title={pageTitle}>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </LegalPage>
    );
  }

  return (
    <LegalPage 
      title={pageTitle} 
      lastUpdated={lastUpdated}
      data-cc-path={`/content/legal/${slug}.md`}
    >
      <SEO 
        title={pageTitle} 
        description={`${pageTitle} der Novartum GmbH.`}
        type="website" 
      />
      <MarkdownContent content={content} data-cc-field="content" />
    </LegalPage>
  );
};

