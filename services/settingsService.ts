
import { supabase } from './supabaseClient';
import { SiteSettings } from "../types";

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "BEYAZBULUT",
  heroTitle: "Ruhun",
  heroHighlight: "Yankısı",
  heroSubtitle: "Kelimelerin en saf hali. Pastel tonların huzurunda, duyguların edebi yolculuğu.",
  footerQuote: "\"Kelimelerin hafifliği, ruhun kanatlarıdır.\"",
  footerCopyright: "© 2024 BeyazBulut. Tüm hakları saklıdır.",
  aboutTitle: "Hikayemiz",
  aboutQuote: "\"Her kelime, ruhun bir yansımasıdır.\""
};

export const getSettings = async (): Promise<SiteSettings> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      console.warn("Settings fetch error or no data, using default.", error);
      return DEFAULT_SETTINGS;
    }
    
    // Convert DB keys (snake_case) to App keys (camelCase) if necessary, 
    // BUT Supabase usually returns column names as defined. 
    // We defined columns as snake_case in SQL: site_name, hero_title...
    // We need to map them to SiteSettings interface.
    
    return {
      siteName: data.site_name || DEFAULT_SETTINGS.siteName,
      heroTitle: data.hero_title || DEFAULT_SETTINGS.heroTitle,
      heroHighlight: data.hero_highlight || DEFAULT_SETTINGS.heroHighlight,
      heroSubtitle: data.hero_subtitle || DEFAULT_SETTINGS.heroSubtitle,
      footerQuote: data.footer_quote || DEFAULT_SETTINGS.footerQuote,
      footerCopyright: data.footer_copyright || DEFAULT_SETTINGS.footerCopyright,
      aboutTitle: data.about_title || DEFAULT_SETTINGS.aboutTitle,
      aboutQuote: data.about_quote || DEFAULT_SETTINGS.aboutQuote,
    };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: SiteSettings): Promise<boolean> => {
  // Map App keys to DB keys
  const dbPayload = {
    site_name: settings.siteName,
    hero_title: settings.heroTitle,
    hero_highlight: settings.heroHighlight,
    hero_subtitle: settings.heroSubtitle,
    footer_quote: settings.footerQuote,
    footer_copyright: settings.footerCopyright,
    about_title: settings.aboutTitle,
    about_quote: settings.aboutQuote
  };

  // Check if a row exists
  const { data } = await supabase.from('site_settings').select('id').limit(1);
  
  let error;
  if (data && data.length > 0) {
    // Update first row
    const res = await supabase
      .from('site_settings')
      .update(dbPayload)
      .eq('id', data[0].id);
    error = res.error;
  } else {
    // Insert new
    const res = await supabase
      .from('site_settings')
      .insert([dbPayload]);
    error = res.error;
  }

  if (error) {
    console.error("Settings save error:", error);
    return false;
  }
  return true;
};
