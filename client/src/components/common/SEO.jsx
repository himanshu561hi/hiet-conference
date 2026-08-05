import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({ title, description, url = "https://nexus2026.hiet.in", image = "/og-image.jpg" }) => {
  const siteTitle = title ? `${title} | NEXUS 2026` : "NEXUS 2026 - Research Paper Management System";
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
