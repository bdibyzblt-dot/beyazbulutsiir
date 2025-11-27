
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { Poem } from '../types';
import { toggleLike, checkIsLiked } from '../services/poemService';
import { getPublicUser } from '../services/authService';

interface PoemCardProps {
  poem: Poem;
  onLikeUpdate?: (id: string, newLikes: number) => void;
  featured?: boolean;
}

const PoemCard: React.FC<PoemCardProps> = ({ poem, onLikeUpdate, featured = false }) => {
  const [likes, setLikes] = React.useState(poem.likes);
  const [isLiked, setIsLiked] = React.useState(false);
  const [canInteract, setCanInteract] = React.useState(false);

  useEffect(() => {
    // Check if user is logged in to show interaction capability
    const checkAuth = async () => {
        const user = await getPublicUser();
        setCanInteract(!!user);
        if (user) {
            const liked = await checkIsLiked(poem.id);
            setIsLiked(liked);
        }
    };
    checkAuth();
  }, [poem.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canInteract) {
        alert("Beğenmek için lütfen giriş yapın.");
        return;
    }

    // Optimistic Update
    const prevIsLiked = isLiked;
    const prevLikes = likes;

    setIsLiked(!prevIsLiked);
    setLikes(prev => prevIsLiked ? prev - 1 : prev + 1);

    // Server Sync
    const newCount = await toggleLike(poem.id);
    setLikes(newCount);
    
    if (onLikeUpdate) onLikeUpdate(poem.id, newCount);
  };

  return (
    <div className={`group relative bg-white overflow-hidden transition-all duration-500 hover:-translate-y-2 cinematic-shadow border border-secondary/10 ${featured ? 'md:col-span-1 border-t-4 border-t-accent' : 'rounded-sm opacity-100 hover:shadow-xl'}`}>
      
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

      <Link to={`/poem/${poem.id}`} className="block h-full flex flex-col p-8 md:p-10 cursor-pointer">
        <div className="flex justify-between items-start mb-6">
          <span className="text-[10px] tracking-[0.3em] font-bold text-accent uppercase bg-accent/5 px-3 py-1 rounded-sm border border-accent/10">
            {poem.category}
          </span>
          <span className="text-[10px] text-stone-400 font-sans tracking-widest">{poem.date}</span>
        </div>

        <h3 className={`font-serif text-ink mb-6 leading-tight group-hover:text-accent transition-colors duration-300 ${featured ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
          {poem.title}
        </h3>

        <div className={`font-body text-stone-600 whitespace-pre-line leading-loose opacity-90 line-clamp-4 overflow-hidden relative mb-8 flex-grow ${featured ? 'text-lg' : 'text-base'}`}>
          {poem.content}
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-secondary/10 mt-auto relative z-10">
          <div className="flex items-center gap-4">
             {canInteract ? (
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-stone-400 hover:text-red-400'}`}
                >
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                  <span className="font-sans font-bold">{likes}</span>
                </button>
             ) : (
                <div className="flex items-center gap-2 text-sm text-stone-300" title="Beğenmek için giriş yapın">
                   <Heart size={18} />
                   <span className="font-sans font-bold">{likes}</span>
                </div>
             )}
             
             <span className="text-stone-300">|</span>
             <span className="font-serif text-sm text-stone-500 italic">
              {poem.author}
            </span>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-ink group-hover:text-accent transition-colors flex items-center gap-2">
            Oku <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PoemCard;
