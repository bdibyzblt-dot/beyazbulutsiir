
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cloud, Menu, X, User, ChevronDown, LogOut } from 'lucide-react';
import { getCategories } from '../services/poemService';
import { getSettings } from '../services/settingsService';
import { getPublicUser, signOutPublic } from '../services/authService';
import { Category, SiteSettings, UserProfile } from '../types';
import SeoMeta from './SeoMeta';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publicUser, setPublicUser] = useState<UserProfile | null>(null);
  
  const [settings, setSettings] = useState<SiteSettings>({
      siteName: "BEYAZBULUT",
      heroTitle: "",
      heroHighlight: "",
      heroSubtitle: "",
      footerQuote: "",
      footerCopyright: "",
      aboutTitle: "",
      aboutQuote: "",
      aboutTextPrimary: "",
      aboutTextSecondary: ""
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const [cats, s, u] = await Promise.all([
          getCategories(),
          getSettings(),
          getPublicUser()
      ]);
      setCategories(cats);
      setSettings(s);
      setPublicUser(u);
    };
    init();
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSignOut = async () => {
    await signOutPublic();
    setPublicUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white overflow-x-hidden w-full relative">
      <SeoMeta />
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-secondary/20 transition-all duration-300 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <div className="p-2 bg-accent/10 rounded-full border border-accent/20 group-hover:bg-accent group-hover:text-white transition-colors text-accent">
              <Cloud size={24} />
            </div>
            <h1 className="font-serif text-2xl tracking-[0.1em] text-ink group-hover:text-accent transition-colors truncate max-w-[200px] md:max-w-none">
              {settings.siteName}
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            <Link to="/" className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:text-accent ${location.pathname === '/' ? 'text-accent font-bold' : 'text-stone-500'}`}>Ana Sayfa</Link>
            
            {/* Dropdown Menu for Poems */}
            <div className="relative group h-full flex items-center">
              <button className={`h-full text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:text-accent flex items-center gap-1 focus:outline-none ${location.pathname.includes('/category/') ? 'text-accent font-bold' : 'text-stone-500'}`}>
                Şiirler <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              <div className="absolute top-[90%] left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block w-56 animate-fade-in z-50">
                 <div className="bg-white/95 backdrop-blur-md border border-secondary/20 shadow-xl rounded-sm py-2 flex flex-col relative">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-secondary/20 rotate-45 transform"></div>
                    {categories.map(cat => (
                      <Link 
                        key={cat} 
                        to={`/category/${cat}`}
                        className="px-6 py-3 text-sm text-stone-600 hover:bg-secondary/10 hover:text-accent text-center font-serif transition-colors relative z-10"
                      >
                        {cat}
                      </Link>
                    ))}
                 </div>
              </div>
            </div>

            <Link to="/about" className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:text-accent ${location.pathname === '/about' ? 'text-accent font-bold' : 'text-stone-500'}`}>Hakkımızda</Link>
            
            {publicUser ? (
              <div className="relative group h-full flex items-center">
                 <button className="flex items-center gap-2 text-stone-600 hover:text-accent font-serif text-sm">
                    <User size={16} /> {publicUser.username}
                 </button>
                 <div className="absolute top-[90%] right-0 pt-4 hidden group-hover:block w-48 animate-fade-in z-50">
                     <div className="bg-white/95 backdrop-blur-md border border-secondary/20 shadow-xl rounded-sm py-2 flex flex-col relative">
                        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-secondary/20 rotate-45 transform"></div>
                        <button onClick={handleSignOut} className="px-6 py-3 text-sm text-red-500 hover:bg-red-50 text-left w-full flex items-center gap-2">
                           <LogOut size={14} /> Çıkış Yap
                        </button>
                     </div>
                 </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-secondary/20 pl-6">
                <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-ink hover:text-accent transition-colors">Giriş Yap</Link>
                <Link to="/register" className="bg-accent text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-blue-300 transition-colors">Üye Ol</Link>
              </div>
            )}
          </nav>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleMenu} className="text-ink hover:text-accent transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 pt-32 px-6 md:hidden animate-fade-in overflow-y-auto w-full h-full">
          <nav className="flex flex-col gap-6 text-center pb-20">
             {publicUser ? (
               <div className="py-4 border-b border-secondary/20 mb-4">
                  <p className="font-serif text-lg text-ink">Merhaba, {publicUser.username}</p>
                  <button onClick={handleSignOut} className="text-sm text-red-500 mt-2 font-bold uppercase">Çıkış Yap</button>
               </div>
             ) : (
               <div className="flex flex-col gap-4 border-b border-secondary/20 pb-6 mb-4">
                  <Link to="/login" onClick={closeMenu} className="bg-white border border-secondary/20 py-3 text-ink font-bold uppercase text-sm rounded-sm">Giriş Yap</Link>
                  <Link to="/register" onClick={closeMenu} className="bg-accent text-white py-3 font-bold uppercase text-sm rounded-sm">Üye Ol</Link>
               </div>
             )}
          
            <Link to="/" onClick={closeMenu} className="text-2xl font-serif text-ink hover:text-accent py-2 border-b border-secondary/20">Ana Sayfa</Link>
            
            <div className="py-2 border-b border-secondary/20 space-y-4">
               <span className="text-2xl font-serif text-ink block mb-4">Şiir Kategorileri</span>
               <div className="flex flex-col gap-3 pl-4 border-l-2 border-accent/20 ml-4">
                  {categories.map(cat => (
                    <Link 
                      key={cat} 
                      to={`/category/${cat}`} 
                      onClick={closeMenu}
                      className="text-lg font-serif text-stone-500 hover:text-accent"
                    >
                      {cat}
                    </Link>
                  ))}
               </div>
            </div>

            <Link to="/about" onClick={closeMenu} className="text-2xl font-serif text-ink hover:text-accent py-2 border-b border-secondary/20">Hakkımızda</Link>
            <Link to="/admin" onClick={closeMenu} className="text-lg font-serif text-stone-400 hover:text-accent py-2 pt-10">Yönetici Paneli</Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow pt-32 px-4 sm:px-6 relative z-10 w-full max-w-full">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-16 border-t border-secondary/20 text-center bg-white/40 w-full">
        <div className="max-w-xl mx-auto px-6">
          <div className="flex justify-center mb-8">
            <Cloud className="text-accent/50" size={32} />
          </div>
          <p className="font-serif text-xl text-ink mb-6 italic opacity-80">{settings.footerQuote}</p>
          <div className="w-12 h-px bg-accent/50 mx-auto mb-6"></div>
          <p className="text-[10px] text-stone-400 uppercase tracking-[0.3em]">{settings.footerCopyright}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
