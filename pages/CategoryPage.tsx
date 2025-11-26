import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { Poem } from '../types';
import { getPoems } from '../services/poemService';
import PoemCard from '../components/PoemCard';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
        setIsLoading(true);
        if (categoryName) {
            const allPoems = await getPoems();
            const filtered = allPoems.filter(p => p.category === categoryName);
            setPoems(filtered);
        }
        setIsLoading(false);
    };
    fetch();
    window.scrollTo(0, 0);
  }, [categoryName]);

  if (isLoading) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={48} />
        </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-fade-in py-12 md:py-20">
      
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-accent/10 p-4 rounded-full mb-2">
            <Tag size={32} className="text-accent" />
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-ink capitalize">
          {categoryName} Şiirleri
        </h2>
        <div className="w-24 h-px bg-secondary mx-auto"></div>
        <p className="text-stone-500 font-body italic">
          Bu kategoride toplam {poems.length} şiir listeleniyor.
        </p>
      </div>

      {/* Breadcrumb / Back */}
      <div className="max-w-6xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-ink transition-colors">
             <ArrowLeft size={14} /> Ana Sayfaya Dön
          </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {poems.length > 0 ? (
          poems.map(poem => (
            <PoemCard key={poem.id} poem={poem} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-secondary/30 rounded-sm bg-white/50">
             <p className="font-serif text-xl text-stone-400">Bu kategoride henüz şiir bulunmuyor.</p>
             <Link to="/" className="text-accent hover:underline mt-2 inline-block text-sm">Diğer şiirlere göz at</Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default CategoryPage;