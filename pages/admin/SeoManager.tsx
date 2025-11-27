
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Search } from 'lucide-react';
import { isAuthenticated } from '../../services/authService';
import { getSeoSettings, saveSeoSettings } from '../../services/seoService';
import { SeoSettings } from '../../types';

const SeoManager: React.FC = () => {
  const navigate = useNavigate();
  const [seo, setSeo] = useState<SeoSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
      return;
    }
    const load = async () => {
       const data = await getSeoSettings();
       setSeo(data);
    };
    load();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (seo) {
       setSeo({ ...seo, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seo) return;
    setIsSaving(true);
    await saveSeoSettings(seo);
    setIsSaving(false);
    alert("SEO ayarları güncellendi.");
  };

  if (!seo) return <div className="p-20 text-center"><Loader2 className="animate-spin inline" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 border border-secondary/20 rounded-full hover:bg-white text-stone-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-serif text-3xl text-ink">SEO Yönetimi</h2>
          <p className="text-stone-400 text-sm">Google arama sonuçlarında nasıl göründüğünüzü özelleştirin.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-sm border border-secondary/20 shadow-sm space-y-6">
         
         <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Meta Başlık (Title)</label>
            <input 
              name="metaTitle"
              value={seo.metaTitle}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink font-serif"
            />
            <p className="text-[10px] text-stone-400 mt-1">Tarayıcı sekmesinde ve Google başlığında görünür. (Max 60 karakter önerilir)</p>
         </div>

         <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Meta Açıklama (Description)</label>
            <textarea 
              name="metaDescription"
              value={seo.metaDescription}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm"
            />
             <p className="text-[10px] text-stone-400 mt-1">Arama sonuçlarında başlığın altında çıkan kısa özet. (Max 160 karakter önerilir)</p>
         </div>

         <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Anahtar Kelimeler (Keywords)</label>
            <input 
              name="metaKeywords"
              value={seo.metaKeywords}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm"
              placeholder="şiir, edebiyat, sanat..."
            />
            <p className="text-[10px] text-stone-400 mt-1">Virgülle ayırarak yazın.</p>
         </div>

         <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Sosyal Medya Resmi (OG Image URL)</label>
            <input 
              name="ogImageUrl"
              value={seo.ogImageUrl}
              onChange={handleChange}
              className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm font-mono"
              placeholder="https://..."
            />
            <p className="text-[10px] text-stone-400 mt-1">Link paylaşımında çıkacak kapak görselinin linki.</p>
         </div>

         <div className="pt-4 flex justify-end">
             <button disabled={isSaving} type="submit" className="bg-accent text-white px-8 py-3 rounded-sm hover:bg-blue-300 transition-colors uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                {isSaving ? 'Kaydediliyor...' : 'SEO Ayarlarını Kaydet'}
             </button>
        </div>

      </form>
    </div>
  );
};

export default SeoManager;
