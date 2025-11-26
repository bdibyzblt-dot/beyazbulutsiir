
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Globe, LayoutTemplate, Quote, Loader2, FileText, Sparkles, Lock, Eye, EyeOff } from 'lucide-react';
import { isAuthenticated } from '../../services/authService';
import { getSettings, saveSettings } from '../../services/settingsService';
import { SiteSettings } from '../../types';

const SettingsManager: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
      return;
    }
    const load = async () => {
      setIsLoading(true);
      const data = await getSettings();
      setSettings(data);
      setIsLoading(false);
    };
    load();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (settings) {
      setSettings({
        ...settings,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      setIsSaving(true);
      const success = await saveSettings(settings);
      setIsSaving(false);
      
      if (success) {
        alert('Site ayarları başarıyla veritabanına kaydedildi!');
      } else {
        alert('Ayarlar kaydedilirken bir hata oluştu.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
         <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 border border-secondary/20 rounded-full hover:bg-white text-stone-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-serif text-3xl text-ink">Genel Ayarlar</h2>
          <p className="text-stone-400 text-sm">Site üzerindeki metinleri ve temel alanları buradan yönetebilirsiniz.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-8">
            {/* Branding */}
            <div className="bg-white p-6 rounded-sm border border-secondary/20 shadow-sm space-y-6 h-fit">
              <h3 className="font-serif text-lg flex items-center gap-2 border-b border-secondary/10 pb-2 mb-4">
                  <Globe size={18} className="text-accent" /> Marka & Logo
              </h3>
              <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Logo Metni</label>
                  <input 
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink font-serif"
                  />
              </div>
              
              <h3 className="font-serif text-lg flex items-center gap-2 border-b border-secondary/10 pb-2 mb-4 mt-8">
                  <LayoutTemplate size={18} className="text-accent" /> Footer Alanı
              </h3>
              <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Footer Alıntısı</label>
                  <input 
                    name="footerQuote"
                    value={settings.footerQuote}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm italic"
                  />
              </div>
              <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Telif Hakkı Metni</label>
                  <input 
                    name="footerCopyright"
                    value={settings.footerCopyright}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm"
                  />
              </div>
            </div>

            {/* AI Settings */}
            <div className="bg-white p-6 rounded-sm border border-accent/20 shadow-md space-y-6 h-fit relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full -z-0"></div>
                <h3 className="font-serif text-lg flex items-center gap-2 border-b border-secondary/10 pb-2 mb-4 relative z-10">
                  <Sparkles size={18} className="text-accent" /> Yapay Zeka Ayarları
                </h3>
                <div className="relative z-10">
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1">
                     <Lock size={10} /> Google Gemini API Key
                  </label>
                  <div className="relative">
                    <input 
                        name="geminiApiKey"
                        type={showApiKey ? "text" : "password"}
                        value={settings.geminiApiKey || ''}
                        onChange={handleChange}
                        placeholder="AI-xxxxxxxxxxxxxxxxxxx"
                        className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink font-mono text-xs pr-10"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-accent transition-colors"
                    >
                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2 leading-relaxed">
                     Şiir üretmek için gerekli olan API anahtarı. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-accent hover:underline">Buradan alabilirsiniz.</a>
                  </p>
                </div>
            </div>
        </div>

        {/* Hero & Pages */}
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-sm border border-secondary/20 shadow-sm space-y-6">
                <h3 className="font-serif text-lg flex items-center gap-2 border-b border-secondary/10 pb-2 mb-4">
                    <LayoutTemplate size={18} className="text-accent" /> Ana Sayfa Banner (Hero)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Başlık (Sol)</label>
                        <input 
                            name="heroTitle"
                            value={settings.heroTitle}
                            onChange={handleChange}
                            className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink font-serif"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Vurgu (Sağ/Renkli)</label>
                        <input 
                            name="heroHighlight"
                            value={settings.heroHighlight}
                            onChange={handleChange}
                            className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-accent font-serif"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Alt Başlık (Slogan)</label>
                    <textarea 
                        name="heroSubtitle"
                        value={settings.heroSubtitle}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm"
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-sm border border-secondary/20 shadow-sm space-y-6">
                <h3 className="font-serif text-lg flex items-center gap-2 border-b border-secondary/10 pb-2 mb-4">
                    <Quote size={18} className="text-accent" /> Hakkımızda Sayfası
                </h3>
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Sayfa Başlığı</label>
                    <input 
                        name="aboutTitle"
                        value={settings.aboutTitle}
                        onChange={handleChange}
                        className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink font-serif"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Giriş Alıntısı</label>
                    <input 
                        name="aboutQuote"
                        value={settings.aboutQuote}
                        onChange={handleChange}
                        className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink italic text-sm"
                    />
                </div>
                
                <h4 className="font-serif text-md flex items-center gap-2 pt-4 text-stone-600">
                   <FileText size={16} /> Metin İçeriği
                </h4>
                
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Paragraf 1 (Giriş)</label>
                    <textarea 
                        name="aboutTextPrimary"
                        value={settings.aboutTextPrimary}
                        onChange={handleChange}
                        rows={5}
                        className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm leading-relaxed"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Paragraf 2 (Amaç)</label>
                    <textarea 
                        name="aboutTextSecondary"
                        value={settings.aboutTextSecondary}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm leading-relaxed"
                    />
                </div>
            </div>
        </div>

        <div className="md:col-span-2 pt-4 flex justify-end">
             <button disabled={isSaving} type="submit" className="bg-accent text-white px-8 py-4 rounded-sm hover:bg-blue-300 transition-colors uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                {isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
             </button>
        </div>

      </form>
    </div>
  );
};

export default SettingsManager;
