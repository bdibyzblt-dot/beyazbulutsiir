
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Calendar, Loader2 } from 'lucide-react';
import { getPoemById, toggleLike, checkIsLiked } from '../services/poemService';
import { getPublicUser } from '../services/authService';
import { Poem } from '../types';

const PoemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poem, setPoem] = useState<Poem | undefined>(undefined);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [canInteract, setCanInteract] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
        if (id) {
            setIsLoading(true);
            const data = await getPoemById(id);
            if (data) {
                setPoem(data);
                setLikes(data.likes);
            }
            // Check auth and like status
            const user = await getPublicUser();
            setCanInteract(!!user);
            if(user) {
               const liked = await checkIsLiked(id);
               setIsLiked(liked);
            }
            setIsLoading(false);
        }
    };
    fetch();
  }, [id]);

  const handleLike = async () => {
    if (!poem) return;
    if (!canInteract) {
        alert("Beğenmek için lütfen giriş yapın.");
        return;
    }

    const prevIsLiked = isLiked;
    setIsLiked(!prevIsLiked);
    setLikes(prev => prevIsLiked ? prev - 1 : prev + 1);

    const newCount = await toggleLike(poem.id);
    setLikes(newCount);
  };

  const handleShare = () => {
    if (!canInteract) {
        alert("Paylaşmak için lütfen giriş yapın.");
        return;
    }
    if (navigator.share && poem) {
      navigator.share({
        title: poem.title,
        text: `BeyazBulut - ${poem.title}`,
        url: window.location.href,
      }).catch((error) => console.log('Paylaşım hatası', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Bağlantı kopyalandı!");
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={48} />
        </div>
    );
  }

  if (!poem) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="font-serif text-2xl text-stone-400">Aradığınız şiir bulunamadı.</h2>
        <Link to="/" className="text-ink border-b border-ink pb-1 hover:opacity-70 transition-opacity">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-16 animate-fade-in">
      
      <div className="mb-12">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-stone-500 hover:text-ink transition-colors text-sm tracking-widest uppercase group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Geri Dön
        </button>
      </div>

      <article className="bg-white shadow-xl shadow-stone-200 border border-stone-100 p-8 md:p-16 rounded-sm relative overflow-hidden">
        
        <div className="absolute inset-0 bg-paper opacity-30 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent opacity-100 pointer-events-none rounded-bl-[100px]"></div>

        <div className="relative z-10 text-center">
          
          <div className="flex justify-center items-center gap-4 mb-8 text-xs font-sans tracking-[0.2em] text-stone-400 uppercase">
             <span className="bg-secondary/10 px-2 py-1 rounded">{poem.category}</span>
             <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
             <span className="flex items-center gap-1"><Calendar size={10} /> {poem.date}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-10 leading-tight">
            {poem.title}
          </h1>

          <div className="w-16 h-px bg-secondary/50 mx-auto mb-12"></div>

          <div className="font-body text-xl md:text-2xl text-stone-700 leading-loose whitespace-pre-line italic opacity-90 mb-16">
            {poem.content}
          </div>

          <div className="flex justify-end items-center gap-2 text-stone-500 mb-12">
             <div className="h-px w-8 bg-stone-300"></div>
             <span className="font-serif text-lg italic">{poem.author}</span>
          </div>

          <div className="flex justify-center items-center gap-8 pt-8 border-t border-stone-100">
             {canInteract ? (
               <>
                 <button 
                    onClick={handleLike}
                    className={`flex flex-col items-center gap-2 group transition-all ${isLiked ? 'scale-110' : ''}`}
                 >
                    <div className={`p-4 rounded-full border transition-all duration-300 ${isLiked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-stone-50 border-stone-100 text-stone-400 group-hover:border-red-200 group-hover:text-red-400'}`}>
                       <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
                    </div>
                    <span className="text-xs text-stone-400 font-sans tracking-widest">{likes} Beğeni</span>
                 </button>

                 <button 
                    onClick={handleShare}
                    className="flex flex-col items-center gap-2 group"
                 >
                    <div className="p-4 rounded-full border border-stone-100 bg-stone-50 text-stone-400 transition-all duration-300 group-hover:border-blue-200 group-hover:text-blue-500 group-hover:bg-blue-50">
                       <Share2 size={24} />
                    </div>
                    <span className="text-xs text-stone-400 font-sans tracking-widest">Paylaş</span>
                 </button>
               </>
             ) : (
                <div className="text-center w-full">
                    <p className="text-stone-400 text-sm mb-4">Etkileşimde bulunmak için üye girişi yapın.</p>
                    <Link to="/login" className="bg-accent text-white px-6 py-2 rounded-sm uppercase font-bold text-xs tracking-wider hover:bg-blue-300 transition-colors">Giriş Yap</Link>
                </div>
             )}
          </div>

        </div>
      </article>

    </div>
  );
};

export default PoemDetailPage;
