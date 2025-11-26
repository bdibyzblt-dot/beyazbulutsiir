
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
  aboutQuote: "\"Her kelime, ruhun bir yansımasıdır.\"",
  aboutTextPrimary: "Modern dünyanın gürültüsünden ve hızından yorulan ruhlar için sığınacak bir liman arayışıyla yola çıktık. BEYAZBULUT, ismini gökyüzünün en saf, en hafif ve en özgür halinden alır. Burada zaman yavaşlar, duygular derinleşir ve kelimeler hak ettiği değeri bulur.",
  aboutTextSecondary: "Amacımız, sadece şiir okumak değil; şiiri hissetmek, yaşamak ve paylaşmak isteyenleri, kağıt kokulu dijital bir atmosferde buluşturmaktır.",
  geminiApiKey: ""
};

export const getSettings = async (): Promise<SiteSettings> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return DEFAULT_SETTINGS;
    }
    
    // Convert DB keys (snake_case) to App keys (camelCase)
    return {
      siteName: data.site_name || DEFAULT_SETTINGS.siteName,
      heroTitle: data.hero_title || DEFAULT_SETTINGS.heroTitle,
      heroHighlight: data.hero_highlight || DEFAULT_SETTINGS.heroHighlight,
      heroSubtitle: data.hero_subtitle || DEFAULT_SETTINGS.heroSubtitle,
      footerQuote: data.footer_quote || DEFAULT_SETTINGS.footerQuote,
      footerCopyright: data.footer_copyright || DEFAULT_SETTINGS.footerCopyright,
      aboutTitle: data.about_title || DEFAULT_SETTINGS.aboutTitle,
      aboutQuote: data.about_quote || DEFAULT_SETTINGS.aboutQuote,
      aboutTextPrimary: data.about_text_primary || DEFAULT_SETTINGS.aboutTextPrimary,
      aboutTextSecondary: data.about_text_secondary || DEFAULT_SETTINGS.aboutTextSecondary,
      geminiApiKey: data.gemini_api_key || ""
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
    about_quote: settings.aboutQuote,
    about_text_primary: settings.aboutTextPrimary,
    about_text_secondary: settings.aboutTextSecondary,
    gemini_api_key: settings.geminiApiKey
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
