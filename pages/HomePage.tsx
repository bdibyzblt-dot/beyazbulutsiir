
import React, { useState, useEffect } from 'react';
import { Poem, Category, SiteSettings } from '../types';
import { getPoems, getCategories } from '../services/poemService';
import { getSettings } from '../services/settingsService';
import PoemCard from '../components/PoemCard';
import { Feather, ChevronLeft, ChevronRight, Star, Loader2 } from 'lucide-react';

const HomePage: React.FC = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Tümü'>('Tümü');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State for Latest Poems
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [poemsData, catsData, settingsData] = await Promise.all([
          getPoems(), 
          getCategories(),
          getSettings()
      ]);
      setPoems(poemsData);
      setCategories(catsData);
      setSettings(settingsData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredPoems = selectedCategory === 'Tümü' 
    ? poems 
    : poems.filter(p => p.category === selectedCategory);

  // Top 2 Most Liked (Global)
  const mostLikedPoems = [...poems].sort((a, b) => b.likes - a.likes).slice(0, 2);

  const totalPages = Math.ceil(filteredPoems.length / ITEMS_PER_PAGE);
  const currentLatestPoems = filteredPoems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      document.getElementById('latest-poems')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-20 animate-fade-in w-full">
      
      {/* Hero Section - Light & Airy - Added overflow-hidden to prevent mobile scroll issues */}
      <section className="text-center py-20 md:py-32 space-y-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="inline-flex items-center justify-center p-4 rounded-full border border-secondary/20 bg-white/40 backdrop-blur-sm mb-6 shadow-sm relative z-10">
           <Feather className="text-accent" size={24} />
        </div>
        <h2 className="text-5xl md:text-7xl font-serif text-ink leading-tight tracking-wide relative z-10">
          {settings.heroTitle} <span className="text-accent italic">{settings.heroHighlight}</span>
        </h2>
        <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto font-body leading-relaxed relative z-10">
          {settings.heroSubtitle}
        </p>
      </section>

      {/* SECTION 1: Most Liked (Showcase) */}
      {mostLikedPoems.length > 0 && selectedCategory === 'Tümü' && (
        <section className="space-y-8">
           <div className="flex items-center gap-4 mb-8 px-4">
              <Star className="text-accent" size={20} fill="currentColor" />
              <h3 className="font-serif text-2xl text-ink tracking-widest uppercase">Editörün Seçimi</h3>
              <div className="h-px bg-secondary/30 flex-grow"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {mostLikedPoems.map(poem => (
                <PoemCard key={`liked-${poem.id}`} poem={poem} featured={true} />
              ))}
           </div>
        </section>
      )}

      {/* SECTION 2: Latest Poems with Filter & Pagination */}
      <section id="latest-poems" className="space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-secondary/20 pb-4 mx-4">
           <h3 className="font-serif text-2xl text-ink tracking-widest uppercase">Son Paylaşılanlar</h3>
           
           {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => { setSelectedCategory('Tümü'); setCurrentPage(1); }}
                className={`px-4 py-1 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                  selectedCategory === 'Tümü' 
                    ? 'bg-accent border-accent text-white shadow-md' 
                    : 'bg-transparent border-secondary/30 text-stone-500 hover:border-accent hover:text-accent'
                }`}
              >
                Tümü
              </button>
              {categories.map(cat => (
                <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                className={`px-4 py-1 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                  selectedCategory === cat 
                    ? 'bg-accent border-accent text-white shadow-md' 
                    : 'bg-transparent border-secondary/30 text-stone-500 hover:border-accent hover:text-accent'
                }`}
              >
                {cat}
              </button>
              ))}
            </div>
        </div>

        {/* Poem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {currentLatestPoems.length > 0 ? (
             currentLatestPoems.map(poem => (
               <PoemCard key={poem.id} poem={poem} />
             ))
           ) : (
             <div className="col-span-full text-center py-20 text-stone-400 font-serif border border-dashed border-secondary/30 rounded-sm">
               Bu kategoride henüz şiir bulunmuyor.
             </div>
           )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 border border-secondary/30 rounded-full text-stone-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center font-serif text-sm border rounded-full transition-all ${
                    currentPage === page 
                      ? 'bg-accent border-accent text-white shadow-md' 
                      : 'bg-transparent border-secondary/30 text-stone-500 hover:border-accent/50 hover:bg-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 border border-secondary/30 rounded-full text-stone-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </section>
    </div>
  );
};

export default HomePage;
