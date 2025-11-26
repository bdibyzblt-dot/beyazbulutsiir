import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Check, X, Tag, AlertCircle } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/poemService';
import { isAuthenticated } from '../../services/authService';

const CategoryManager: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Edit State
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryValue, setEditCategoryValue] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
      return;
    }
    refreshList();
  }, [navigate]);

  const refreshList = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      const success = await addCategory(newCategoryName.trim());
      if (success) {
        setNewCategoryName('');
        refreshList();
      } else {
        alert('Bu kategori zaten mevcut veya eklenirken hata oluştu.');
      }
    }
  };

  const startEdit = (cat: string) => {
    setEditingCategory(cat);
    setEditCategoryValue(cat);
  };

  const saveEdit = async (oldName: string) => {
    if (oldName === editCategoryValue) {
      setEditingCategory(null);
      return;
    }
    
    if (window.confirm(`"${oldName}" kategorisini "${editCategoryValue}" olarak değiştirmek üzeresiniz. Bu kategoriye sahip tüm şiirler güncellenecektir. Onaylıyor musunuz?`)) {
       const success = await updateCategory(oldName, editCategoryValue);
       if(success) {
         setEditingCategory(null);
         refreshList();
       } else {
         alert('Güncelleme başarısız (bu isimde başka bir kategori olabilir).');
       }
    }
  };

  const handleRemove = async (cat: string) => {
    if (window.confirm(`Dikkat! "${cat}" kategorisini silmek üzeresiniz.\n\nBu işlem sonucunda bu kategoriye ait şiirler "Kategorisiz" olarak işaretlenecektir.\n\nDevam etmek istiyor musunuz?`)) {
      await deleteCategory(cat);
      refreshList();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 border border-secondary/20 rounded-full hover:bg-white text-stone-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-serif text-3xl text-ink">Kategori Yönetimi</h2>
          <p className="text-stone-400 text-sm">Site genelindeki şiir kategorilerini düzenleyin veya silin.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Add New */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-secondary/20 shadow-sm h-fit">
            <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
              <Plus size={18} className="text-accent" /> Yeni Kategori Ekle
            </h3>
            <form onSubmit={handleAdd} className="flex gap-2">
              <input 
                type="text" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Örn: Umut"
                className="flex-1 p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm"
              />
              <button type="submit" className="bg-accent text-white px-4 rounded-sm hover:bg-blue-300 transition-colors">
                <Plus size={20} />
              </button>
            </form>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 flex gap-3 text-blue-800 text-sm">
             <AlertCircle className="shrink-0" size={20} />
             <p>Bir kategori silindiğinde, o kategori altındaki şiirler silinmez; otomatik olarak <strong>"Kategorisiz"</strong> etiketine taşınır.</p>
          </div>
        </div>

        {/* List */}
        <div className="bg-white p-6 rounded-sm border border-secondary/20 shadow-sm">
           <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
             <Tag size={18} className="text-accent" /> Mevcut Kategoriler
          </h3>
          <ul className="space-y-2">
            {categories.map(cat => (
              <li key={cat} className="flex items-center justify-between p-3 bg-background/50 rounded-sm border border-transparent hover:border-secondary/20 transition-all group">
                {editingCategory === cat ? (
                   <div className="flex items-center gap-2 flex-1 animate-fade-in">
                      <input 
                        value={editCategoryValue}
                        onChange={(e) => setEditCategoryValue(e.target.value)}
                        className="flex-1 p-1 text-sm border border-accent rounded-sm outline-none bg-white"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(cat)} className="text-green-600 hover:bg-green-100 p-1.5 rounded"><Check size={16}/></button>
                      <button onClick={() => setEditingCategory(null)} className="text-stone-400 hover:bg-stone-200 p-1.5 rounded"><X size={16}/></button>
                   </div>
                ) : (
                  <>
                    <span className={`font-medium ${cat === 'Kategorisiz' ? 'text-stone-400 italic' : 'text-ink'}`}>{cat}</span>
                    <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="Düzenle">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleRemove(cat)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Sil">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
            {categories.length === 0 && (
              <li className="text-stone-400 text-sm italic text-center py-4">Henüz kategori bulunmuyor.</li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default CategoryManager;