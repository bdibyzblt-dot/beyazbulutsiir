import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Globe, LayoutTemplate, Quote } from 'lucide-react';
import { isAuthenticated } from '../../services/authService';
import { getSettings, saveSettings } from '../../services/settingsService';
import { SiteSettings } from '../../types';

const SettingsManager: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
      return;
    }
    setSettings(getSettings());
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (settings) {
      setSettings({
        ...settings,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      saveSettings(settings);
      alert('Site ayarları başarıyla güncellendi!');
    }
  };

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
            </div>
        </div>

        <div className="md:col-span-2 pt-4 flex justify-end">
             <button type="submit" className="bg-accent text-white px-8 py-4 rounded-sm hover:bg-blue-300 transition-colors uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                <Save size={18} /> Ayarları Kaydet
             </button>
        </div>

      </form>
    </div>
  );
};

export default SettingsManager;