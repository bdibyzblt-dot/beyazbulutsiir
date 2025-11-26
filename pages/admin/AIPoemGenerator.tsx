
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, Save, Wand2, Settings, AlertTriangle } from 'lucide-react';
import { generatePoemWithAI } from '../../services/geminiService';
import { getCategories, savePoem } from '../../services/poemService';
import { getSettings } from '../../services/settingsService';
import { isAuthenticated } from '../../services/authService';
import { Poem } from '../../types';

const AIPoemGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  
  // Generation State
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<{title: string, content: string} | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [loadingCheck, setLoadingCheck] = useState(true);

  // Editing State (After generation)
  const [finalTitle, setFinalTitle] = useState('');
  const [finalContent, setFinalContent] = useState('');
  const [finalCategory, setFinalCategory] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
      return;
    }
    const loadInit = async () => {
        setLoadingCheck(true);
        const [cats, settings] = await Promise.all([
             getCategories(),
             getSettings()
        ]);
        
        // Check for API Key in settings or Vite env
        const key = settings.geminiApiKey;
        // Safe check for env var in Vite
        // @ts-ignore
        const envKey = (import.meta.env && import.meta.env.VITE_GEMINI_KEY) || '';
        
        if (!key && !envKey) {
            setHasApiKey(false);
        } else {
            setHasApiKey(true);
        }

        setCategories(cats);
        if(cats.length > 0) {
            setSelectedCategory(cats[0]);
            setFinalCategory(cats[0]);
        }
        setLoadingCheck(false);
    }
    loadInit();
  }, [navigate]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedData(null);

    // If prompt is empty, use selected category as prompt
    const useCategory = prompt.trim().length === 0;
    const input = useCategory ? selectedCategory : prompt;

    const result = await generatePoemWithAI(input, useCategory);
    
    setIsGenerating(false);
    if (result) {
      setGeneratedData(result);
      setFinalTitle(result.title);
      setFinalContent(result.content);
      // If user typed a prompt, we stick to selected category for saving, or user can change it
      setFinalCategory(selectedCategory);
    } else {
      alert("Şiir oluşturulamadı. Lütfen tekrar deneyin veya API anahtarınızı kontrol edin.");
    }
  };

  const handleSave = async () => {
    if (!finalTitle || !finalContent) return;

    const newPoem: Poem = {
      id: Date.now().toString(),
      title: finalTitle,
      content: finalContent,
      author: 'Yapay Zeka (Gemini)',
      category: finalCategory,
      likes: 0,
      date: new Date().toLocaleDateString('tr-TR')
    };

    await savePoem(newPoem);
    alert('Şiir başarıyla kaydedildi!');
    navigate('/admin');
  };

  if (loadingCheck) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={48} />
        </div>
      );
  }

  if (!hasApiKey) {
      return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20 pt-20">
            <div className="bg-yellow-50 border border-yellow-100 rounded-sm p-8 text-center space-y-4">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-yellow-200">
                    <AlertTriangle size={32} className="text-yellow-500" />
                </div>
                <h2 className="font-serif text-2xl text-ink">API Anahtarı Eksik</h2>
                <p className="text-stone-500">
                    Yapay zeka özelliğini kullanabilmek için Google Gemini API anahtarına ihtiyacınız var.
                    Lütfen ayarlar sayfasına gidip geçerli bir anahtar girin.
                </p>
                <Link to="/admin/settings" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-sm font-bold uppercase text-xs tracking-wider hover:bg-blue-300 transition-colors">
                    <Settings size={16} /> Ayarlara Git
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 border border-secondary/20 rounded-full hover:bg-white text-stone-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-serif text-3xl text-ink">Yapay Zeka ile Şiir Üret</h2>
          <p className="text-stone-400 text-sm">Bir konu veya hissiyat belirtin, Gemini sizin için yazsın.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left: Input & Controls */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-sm border border-secondary/20 shadow-sm">
              <form onSubmit={handleGenerate} className="space-y-6">
                 <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Hedef Kategori</label>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm"
                    >
                       {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>

                 <div>
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">
                       Özel İstek (İsteğe Bağlı)
                    </label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Örn: Yağmurlu bir günde pencereden bakan bir kedinin hüznü..."
                      rows={4}
                      className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm"
                    ></textarea>
                    <p className="text-[10px] text-stone-400 mt-1">* Boş bırakırsanız seçili kategori temasında yazılacaktır.</p>
                 </div>

                 <button 
                  type="submit" 
                  disabled={isGenerating}
                  className="w-full bg-accent text-white py-3 rounded-sm hover:bg-blue-300 transition-colors uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2"
                 >
                   {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                   {isGenerating ? 'Yazılıyor...' : 'Şiir Oluştur'}
                 </button>
              </form>
           </div>
        </div>

        {/* Right: Result & Edit */}
        <div className="space-y-6">
           {generatedData ? (
             <div className="bg-white p-6 rounded-sm border border-accent/30 shadow-md animate-fade-in relative">
                <div className="absolute top-0 right-0 p-2 bg-accent/10 rounded-bl-lg">
                   <Wand2 size={16} className="text-accent" />
                </div>
                
                <h3 className="font-serif text-lg text-ink mb-4 border-b border-secondary/20 pb-2">Sonuç & Düzenleme</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-stone-400 uppercase">Başlık</label>
                    <input 
                      type="text" 
                      value={finalTitle}
                      onChange={(e) => setFinalTitle(e.target.value)}
                      className="w-full p-2 font-serif text-xl text-ink bg-transparent border-b border-secondary/30 focus:border-accent outline-none"
                    />
                  </div>
                  <div>
                     <label className="text-[10px] text-stone-400 uppercase">İçerik</label>
                     <textarea 
                        value={finalContent}
                        onChange={(e) => setFinalContent(e.target.value)}
                        rows={10}
                        className="w-full p-2 font-body text-stone-600 leading-relaxed bg-transparent border border-secondary/10 rounded-sm focus:border-accent outline-none resize-y"
                     ></textarea>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                     <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm">
                        <Save size={16} /> Kaydet
                     </button>
                     <button onClick={() => setGeneratedData(null)} className="px-4 py-2 border border-secondary/30 text-stone-500 rounded-sm hover:bg-background text-sm">
                        İptal
                     </button>
                  </div>
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-secondary/20 rounded-sm text-stone-400 p-8 text-center">
                <Sparkles size={48} className="mb-4 text-secondary" />
                <p className="font-serif text-lg">İlham bekliyor...</p>
                <p className="text-sm mt-2 max-w-xs">Sol taraftan parametreleri girin ve yapay zekanın sihrini izleyin.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default AIPoemGenerator;
