import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import ContactFooter from './components/ContactFooter';
import ProjectDetail from './components/ProjectDetail';
import BlogPostReader from './components/BlogPostReader';
import LegalPage from './components/LegalPage';
import { DynamicLegalPage } from './components/DynamicLegalPage';
import CookieBanner from './components/CookieBanner';
import NotFound from './components/NotFound';
import { GenericPage } from './components/GenericPage';
import { MarkdownContent } from './components/MarkdownContent';
import GlobalScripts from './components/GlobalScripts';
import GlobalSchema from './components/GlobalSchema';
import BreadcrumbsSchema from './components/BreadcrumbsSchema';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Global Data Hook
const useGlobalData = () => {
  const [navigationData, setNavigationData] = useState<any>({});
  const [footer, setFooter] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [navRes, footerRes] = await Promise.all([
          fetch('/content/globals/navigation.json'),
          fetch('/content/globals/footer.json')
        ]);

        if (navRes.ok) {
          const navData = await navRes.json();
          setNavigationData(navData); 
        }

        if (footerRes.ok) {
          const footerData = await footerRes.json();
          setFooter(footerData);
        }
      } catch (error) {
        console.error("Failed to fetch global data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { navigationData, footer, loading };
};

const App: React.FC = () => {
  const { navigationData, footer, loading } = useGlobalData();

  if (loading) {
     return <div className="min-h-screen bg-white flex items-center justify-center">Laden...</div>;
  }

  // Extract logo from navigation data if present
  const logo = navigationData?.logo || ""; 
  const navItems = navigationData?.navigation || [];

  return (
    <HelmetProvider>
      <Router>
        <GlobalScripts />
        <GlobalSchema />
        <BreadcrumbsSchema />
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Header navigation={navItems} logo={logo} />
          <Routes>
          {/* Static Routes that fetch their own content via GenericPage */}
          <Route path="/" element={<GenericPage slug="home" />} />
          <Route path="/software" element={<GenericPage slug="software" />} />
          <Route path="/sam" element={<GenericPage slug="sam" />} />
          <Route path="/itsm" element={<GenericPage slug="itsm" />} />
          <Route path="/einkauf" element={<GenericPage slug="einkauf" />} />
          <Route path="/consulting" element={<GenericPage slug="consulting" />} />
          
          <Route path="/team" element={<GenericPage slug="team" />} />
          <Route path="/partner" element={<GenericPage slug="partner" />} />
          <Route path="/karriere" element={<GenericPage slug="karriere" />} />

          <Route path="/projekte" element={<GenericPage slug="projekte" />} />
          <Route path="/projekte/:slug" element={<ProjectDetail />} />
          
          <Route path="/blog" element={<GenericPage slug="blog" />} />
          <Route path="/blog/:slug" element={<BlogPostReader />} />

          {/* Legal Routes */}
          <Route path="/impressum" element={<DynamicLegalPage slug="impressum" title="Impressum" />} />
          <Route path="/datenschutz" element={<DynamicLegalPage slug="datenschutz" title="Datenschutzerklärung" />} />
          <Route path="/agb" element={<DynamicLegalPage slug="agb" title="Allgemeine Geschäftsbedingungen" />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <ContactFooter {...footer} />
        <CookieBanner />
      </div>
    </Router>
    </HelmetProvider>
  );
};

export default App;
