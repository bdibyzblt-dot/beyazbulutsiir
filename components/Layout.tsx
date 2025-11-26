import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Menu, X, User, ChevronDown } from 'lucide-react';
import { getCategories } from '../services/poemService';
import { getSettings } from '../services/settingsService';
import { Category, SiteSettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getSettings());
  const location = useLocation();

  useEffect(() => {
    // Async load categories
    const fetchCats = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetchCats();
    
    // Initial fetch of settings (Still local)
    setSettings(getSettings());

    const handleSettingsUpdate = () => {
       setSettings(getSettings());
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
      {/* Header - Glassmorphism Light */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-secondary/20 transition-all duration-300 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <div className="p-2 bg-accent/10 rounded-full border border-accent/20 group-hover:bg-accent group-hover:text-white transition-colors text-accent">
              <Cloud size={24} />
            </div>
            <h1 className="font-serif text-2xl tracking-[0.1em] text-ink group-hover:text-accent transition-colors">
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
                    
                    {/* CSS Triangle Pointer */}
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
                    {categories.length === 0 && (
                      <span className="px-6 py-3 text-xs text-stone-400 text-center italic">Kategori yok</span>
                    )}
                 </div>
              </div>
            </div>

            <Link to="/about" className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:text-accent ${location.pathname === '/about' ? 'text-accent font-bold' : 'text-stone-500'}`}>Hakkımızda</Link>
            <Link to="/admin" className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:text-accent flex items-center gap-2 ${location.pathname.startsWith('/admin') ? 'text-accent font-bold' : 'text-stone-500'}`}>
               <User size={14} /> Giriş
            </Link>
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
        <div className="fixed inset-0 z-40 bg-white/95 pt-32 px-6 md:hidden animate-fade-in overflow-y-auto">
          <nav className="flex flex-col gap-6 text-center pb-20">
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
            <Link to="/admin" onClick={closeMenu} className="text-2xl font-serif text-ink hover:text-accent py-2 border-b border-secondary/20">Admin Girişi</Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow pt-32 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-16 border-t border-secondary/20 text-center bg-white/40">
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