import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BreadcrumbsSchema: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://novartum.com/"
      },
      ...pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        // Capitalize first letter
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": formattedName,
          "item": `https://novartum.com${routeTo}`
        };
      })
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbList)}
      </script>
    </Helmet>
  );
};

export default BreadcrumbsSchema;

