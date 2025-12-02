import React from 'react';
import { Helmet } from 'react-helmet-async';

const GlobalSchema: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Novartum GmbH",
    "url": "https://novartum.com",
    "logo": "https://novartum.com/logo.svg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+49 89 12345678",
      "contactType": "customer service",
      "email": "info@novartum.com",
      "areaServed": "DE",
      "availableLanguage": "German"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "München",
      "postalCode": "80331",
      "addressCountry": "DE"
    },
    "sameAs": [
      "https://www.linkedin.com/company/novartum",
      "https://twitter.com/novartum"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default GlobalSchema;

