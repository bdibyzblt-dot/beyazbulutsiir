
import { supabase } from './supabaseClient';
import { SeoSettings } from '../types';

const DEFAULT_SEO: SeoSettings = {
  metaTitle: 'BEYAZBULUT - Estetik Şiir Platformu',
  metaDescription: 'En güzel şiirlerin, huzurlu ve estetik bir ortamda paylaşıldığı dijital edebiyat durağı.',
  metaKeywords: 'şiir, edebiyat, aşk şiirleri, estetik, beyazbulut',
  ogImageUrl: ''
};

export const getSeoSettings = async (): Promise<SeoSettings> => {
  try {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return DEFAULT_SEO;
    }
    
    return {
      metaTitle: data.meta_title || DEFAULT_SEO.metaTitle,
      metaDescription: data.meta_description || DEFAULT_SEO.metaDescription,
      metaKeywords: data.meta_keywords || DEFAULT_SEO.metaKeywords,
      ogImageUrl: data.og_image_url || DEFAULT_SEO.ogImageUrl
    };
  } catch (e) {
    return DEFAULT_SEO;
  }
};

export const saveSeoSettings = async (settings: SeoSettings): Promise<boolean> => {
  const dbPayload = {
    meta_title: settings.metaTitle,
    meta_description: settings.metaDescription,
    meta_keywords: settings.metaKeywords,
    og_image_url: settings.ogImageUrl
  };

  const { data } = await supabase.from('seo_settings').select('id').limit(1);
  
  let error;
  if (data && data.length > 0) {
    const res = await supabase
      .from('seo_settings')
      .update(dbPayload)
      .eq('id', data[0].id);
    error = res.error;
  } else {
    const res = await supabase
      .from('seo_settings')
      .insert([dbPayload]);
    error = res.error;
  }

  if (error) {
    console.error("SEO save error:", error);
    return false;
  }
  return true;
};
