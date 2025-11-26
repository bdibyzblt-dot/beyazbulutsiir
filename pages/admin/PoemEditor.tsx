
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getPoemById, savePoem, getCategories } from '../../services/poemService';
import { isAuthenticated } from '../../services/authService';
import { Poem } from '../../types';

const PoemEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [likes, setLikes] = useState(0);
  const [date, setDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
      return;
    }
    
    const loadData = async () => {
        const cats = await getCategories();
        setCategories(cats);
        if(cats.length > 0) setSelectedCategory(cats[0]);
    
        if (id) {
          const poem = await getPoemById(id);
          if (poem) {
            setTitle(poem.title);
            setContent(poem.content);
            setAuthor(poem.author);
            setSelectedCategory(poem.category);
            setLikes(poem.likes);
            setDate(poem.date);
          } else {
            alert('Şiir bulunamadı.');
            navigate('/admin');
          }
        }
    };
    loadData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const newPoem: Poem = {
        // If it's a new poem, give it a timestamp ID temporarily for the frontend,
        // but the service will handle removing it for DB insertion.
        id: id || Date.now().toString(),
        title,
        content,
        author: author || 'Yönetici',
        category: selectedCategory,
        likes: likes,
        date: date || new Date().toLocaleDateString('tr-TR')
      };
      
      await savePoem(newPoem);
      navigate('/admin');
    } catch (error: any) {
      console.error("Save failed", error);
      alert(`Şiir kaydedilirken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}. Lütfen veritabanı izinlerini kontrol edin.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 border border-secondary/20 rounded-full hover:bg-white text-stone-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-serif text-3xl text-ink">{id ? 'Şiiri Düzenle' : 'Yeni Şiir Ekle'}</h2>
        </div>
      </div>

      <div className="bg-white p-8 rounded-sm shadow-sm border border-secondary/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Başlık</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent font-serif text-lg text-ink"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Kategori</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent text-ink"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Şair</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="İsim girin (Boş bırakılırsa 'Yönetici' yazılır)"
              className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent text-ink"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Şiir İçeriği</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={15}
              className="w-full p-4 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent font-body text-stone-600 leading-relaxed text-lg"
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4 border-t border-secondary/10">
             <button disabled={isSaving} type="submit" className="flex-1 bg-accent text-white py-4 rounded-sm hover:bg-blue-300 transition-colors uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
                {id ? 'Değişiklikleri Kaydet' : 'Şiiri Yayınla'}
             </button>
             <Link to="/admin" className="px-8 py-4 border border-secondary/30 text-stone-500 rounded-sm hover:bg-background uppercase tracking-widest text-xs flex items-center">
                İptal
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PoemEditor;
