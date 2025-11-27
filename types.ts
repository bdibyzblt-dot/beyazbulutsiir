
export type Category = string;

export interface Poem {
  id: string;
  title: string;
  content: string;
  author: string;
  category: Category;
  likes: number;
  date: string; // ISO String or similar sortable date preferred
}

export interface SiteSettings {
  siteName: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  footerQuote: string;
  footerCopyright: string;
  aboutTitle: string;
  aboutQuote: string;
  aboutTextPrimary: string;
  aboutTextSecondary: string;
  geminiApiKey?: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
}

export const DEFAULT_CATEGORIES: Category[] = ['Aşk', 'Hüzün', 'Doğa', 'Özgürlük', 'Nostalji'];
