
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getSeoSettings } from '../services/seoService';
import { SeoSettings } from '../types';

const SeoMeta: React.FC = () => {
  const [seo, setSeo] = useState<SeoSettings | null>(null);

  useEffect(() => {
    const fetchSeo = async () => {
      const settings = await getSeoSettings();
      setSeo(settings);
    };
    fetchSeo();
  }, []);

  if (!seo) return null;

  return (
    <Helmet>
      <title>{seo.metaTitle}</title>
      <meta name="description" content={seo.metaDescription} />
      <meta name="keywords" content={seo.metaKeywords} />
      {seo.ogImageUrl && <meta property="og:image" content={seo.ogImageUrl} />}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.metaTitle} />
      <meta property="og:description" content={seo.metaDescription} />
    </Helmet>
  );
};

export default SeoMeta;
