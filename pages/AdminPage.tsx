
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, List, Sparkles, Tag, Edit, Trash2, Search, Settings, Loader2, Lock, User, AlertCircle, HelpCircle, Users, ChevronLeft, ChevronRight, BarChart } from 'lucide-react';
import { Poem } from '../types';
import { getPoems, deletePoem, getCategories } from '../services/poemService';
import { login, logout, isAuthenticated, getCurrentUser } from '../services/authService';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<{username: string} | null>(null);
  const [poems, setPoems] = useState<Poem[]>([]);
  const [stats, setStats] = useState({ poemCount: 0, categoryCount: 0 });
  const [loading, setLoading] = useState(false);
  
  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const authStatus = isAuthenticated();
    setIsAuth(authStatus);
    if (authStatus) {
      setCurrentUser(getCurrentUser());
      loadDashboardData();
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadDashboardData = async () => {
    setLoading(true);
    const allPoems = await getPoems();
    const allCats = await getCategories();
    setPoems(allPoems);
    setStats({
      poemCount: allPoems.length,
      categoryCount: allCats.length
    });
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    setDebugInfo('');
    
    const result = await login(username, password);
    
    setIsLoggingIn(false);
    
    if (result.success) {
      setIsAuth(true);
      setCurrentUser(getCurrentUser());
      loadDashboardData();
    } else {
      setLoginError(result.message || 'Giriş başarısız.');
      if (result.debugInfo) setDebugInfo(result.debugInfo);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    setCurrentUser(null);
    navigate('/');
  };

  const handleDeletePoem = async (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm(`"${title}" başlıklı şiiri silmek istediğinize emin misiniz?`)) {
      await deletePoem(id);
      loadDashboardData();
    }
  };

  const handleEditConfirm = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    e.preventDefault();

    if (window.confirm(`"${title}" başlıklı şiiri düzenlemek istiyor musunuz?`)) {
      navigate(`/admin/edit/${id}`);
    }
  };

  const filteredPoems = poems.filter(poem => 
    poem.title.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'))
  );

  const totalPages = Math.ceil(filteredPoems.length / ITEMS_PER_PAGE);
  const currentPoems = filteredPoems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 md:p-10 rounded-sm shadow-xl border border-secondary/20 w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-ink">Yönetici Girişi</h2>
            <div className="h-0.5 w-12 bg-accent mx-auto mt-4"></div>
          </div>
          
          {loginError && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-sm text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold">
                 <AlertCircle size={16} />
                 <span>{loginError}</span>
              </div>
              {debugInfo && (
                <div className="text-xs text-red-500 mt-2 p-2 bg-white/50 rounded border border-red-100">
                   <strong>İpucu:</strong> {debugInfo}
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Kullanıcı Adı</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent text-ink font-sans"
                  placeholder="Kullanıcı adınız"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-400 mb-1">Şifre</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent text-ink font-sans"
                  placeholder="Şifreniz"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-accent text-white py-3 rounded-sm hover:bg-blue-300 transition-colors uppercase tracking-widest text-sm font-bold flex justify-center items-center gap-2"
          >
            {isLoggingIn ? <Loader2 size={16} className="animate-spin" /> : 'Giriş Yap'}
          </button>
          
          <div className="pt-4 border-t border-secondary/10 text-center">
             <p className="text-xs text-stone-400 flex items-center justify-center gap-1">
               <HelpCircle size={12} /> Veritabanı bağlantısı gerektirir
             </p>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-secondary/20 pb-6">
        <div>
           <h2 className="font-serif text-3xl text-ink">Kontrol Paneli</h2>
           <p className="text-stone-400 text-sm mt-1 flex items-center gap-1">
             Hoşgeldiniz, <span className="text-accent font-bold">{currentUser?.username || 'Yönetici'}</span>
           </p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-stone-500 hover:text-red-500 text-sm font-sans uppercase tracking-wider transition-colors">
          <LogOut size={16} /> Çıkış
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={48} />
        </div>
      ) : (
        <>
        {/* Stats & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-sm border border-secondary/20 shadow-sm">
                <h3 className="text-stone-400 text-xs uppercase tracking-widest mb-2">Toplam Şiir</h3>
                <p className="text-4xl font-serif text-ink">{stats.poemCount}</p>
            </div>
            <div className="bg-white p-6 rounded-sm border border-secondary/20 shadow-sm">
                <h3 className="text-stone-400 text-xs uppercase tracking-widest mb-2">Kategoriler</h3>
                <p className="text-4xl font-serif text-ink">{stats.categoryCount}</p>
            </div>

            <Link to="/admin/ai" className="bg-gradient-to-br from-accent/10 to-accent/5 p-6 rounded-sm border border-accent/20 hover:border-accent/50 transition-all group flex flex-col justify-center items-center text-center cursor-pointer">
                <Sparkles className="text-accent mb-2 group-hover:scale-110 transition-transform" size={24} />
                <span className="font-serif text-ink font-medium">Yapay Zeka ile Üret</span>
            </Link>
            
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 flex-1">
                    <Link to="/admin/categories" className="bg-white p-2 rounded-sm border border-secondary/20 hover:border-accent/30 transition-all group flex flex-col items-center justify-center gap-1 text-center cursor-pointer flex-1">
                        <Tag className="text-stone-400 group-hover:text-accent transition-colors" size={16} />
                        <span className="font-serif text-ink text-xs">Kategoriler</span>
                    </Link>
                    <Link to="/admin/settings" className="bg-white p-2 rounded-sm border border-secondary/20 hover:border-accent/30 transition-all group flex flex-col items-center justify-center gap-1 text-center cursor-pointer flex-1">
                        <Settings className="text-stone-400 group-hover:text-accent transition-colors" size={16} />
                        <span className="font-serif text-ink text-xs">Genel Ayarlar</span>
                    </Link>
                </div>
                <div className="flex gap-2 flex-1">
                  <Link to="/admin/seo" className="bg-white p-2 rounded-sm border border-secondary/20 hover:border-accent/30 transition-all group flex items-center justify-center gap-2 text-center cursor-pointer flex-1">
                      <BarChart className="text-stone-400 group-hover:text-accent transition-colors" size={14} />
                      <span className="font-serif text-ink text-xs">SEO</span>
                  </Link>
                  <Link to="/admin/users" className="bg-white p-2 rounded-sm border border-secondary/20 hover:border-accent/30 transition-all group flex items-center justify-center gap-2 text-center cursor-pointer flex-1">
                      <Users className="text-stone-400 group-hover:text-accent transition-colors" size={14} />
                      <span className="font-serif text-ink text-xs">Kullanıcılar</span>
                  </Link>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <h3 className="font-serif text-xl text-ink flex items-center gap-2">
                <List size={20} className="text-accent" /> Şiir Listesi
                </h3>
                
                <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-grow md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Şiir başlığı ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-secondary/30 rounded-sm focus:outline-none focus:border-accent text-sm bg-white"
                    />
                </div>

                <Link to="/admin/new" className="bg-accent text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-blue-300 transition-colors flex items-center gap-2 whitespace-nowrap">
                    <Plus size={16} /> Yeni Şiir
                </Link>
                </div>
            </div>

            <div className="bg-white rounded-sm border border-secondary/20 shadow-sm overflow-hidden min-h-[300px] flex flex-col">
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
                    <thead className="bg-secondary/5 border-b border-secondary/20">
                        <tr>
                            <th className="p-4 font-serif text-ink font-medium">Başlık</th>
                            <th className="p-4 font-serif text-ink font-medium">Kategori</th>
                            <th className="p-4 font-serif text-ink font-medium hidden md:table-cell">Tarih</th>
                            <th className="p-4 font-serif text-ink font-medium text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10">
                        {currentPoems.map(poem => (
                            <tr 
                                key={poem.id} 
                                className={`transition-colors relative z-0 ${searchTerm ? 'bg-stone-100' : 'hover:bg-secondary/5'}`}
                            >
                                <td className="p-4">
                                <div className="font-medium text-ink truncate max-w-[150px] md:max-w-none">{poem.title}</div>
                                <div className="text-xs text-stone-400 truncate max-w-[150px] md:max-w-[200px]">{poem.author}</div>
                                </td>
                                <td className="p-4">
                                <span className="text-[10px] uppercase font-bold text-accent border border-accent/20 px-2 py-0.5 rounded-sm">
                                    {poem.category}
                                </span>
                                </td>
                                <td className="p-4 text-sm text-stone-500 hidden md:table-cell">{poem.date}</td>
                                <td className="p-4 text-right space-x-2 relative z-10">
                                <button 
                                    onClick={(e) => handleEditConfirm(e, poem.id, poem.title)}
                                    className="inline-block p-2 text-blue-400 hover:bg-blue-50 rounded-sm transition-colors cursor-pointer relative z-20" 
                                    title="Düzenle"
                                >
                                    <Edit size={16} />
                                </button>
                                <button 
                                    onClick={(e) => handleDeletePoem(e, poem.id, poem.title)} 
                                    className="inline-block p-2 text-red-400 hover:bg-red-50 rounded-sm transition-colors cursor-pointer relative z-20" 
                                    title="Sil"
                                >
                                    <Trash2 size={16} />
                                </button>
                                </td>
                            </tr>
                        ))}
                        {currentPoems.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-stone-400 italic">
                                {searchTerm ? `"${searchTerm}" aramasına uygun şiir bulunamadı.` : 'Henüz kütüphanede şiir yok.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="border-t border-secondary/10 p-4 flex items-center justify-between mt-auto bg-stone-50/50">
                     <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-secondary/20 rounded-sm hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-stone-500"
                     >
                        <ChevronLeft size={16} />
                     </button>
                     
                     <span className="text-xs text-stone-500 font-sans tracking-widest">
                        Sayfa <span className="font-bold text-ink">{currentPage}</span> / {totalPages}
                     </span>

                     <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-secondary/20 rounded-sm hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-stone-500"
                     >
                        <ChevronRight size={16} />
                     </button>
                  </div>
                )}
            </div>
        </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
