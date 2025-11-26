import { SiteSettings } from "../types";

const SETTINGS_STORAGE_KEY = 'beyazbulut_settings';

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

export const getSettings = (): SiteSettings => {
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  return JSON.parse(stored);
};

export const saveSettings = (settings: SiteSettings): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  // Dispatch a custom event so components can subscribe to changes immediately if needed
  window.dispatchEvent(new Event('settingsUpdated'));
};
