
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Loader2, ArrowRight } from 'lucide-react';
import { signInPublic } from '../../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await signInPublic(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in px-4">
      <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl border border-secondary/20 w-full max-w-md space-y-8">
         <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl text-ink">Hoşgeldiniz</h2>
            <p className="text-stone-400 text-sm">Şiir dünyasına adım atın.</p>
         </div>

         {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm border border-red-100 rounded-sm">
               {error}
            </div>
         )}

         <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">E-Posta</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent text-ink"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Şifre</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent text-ink"
                  placeholder="******"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-accent text-white py-3 rounded-sm hover:bg-blue-300 transition-colors uppercase tracking-widest text-sm font-bold flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Giriş Yap'}
            </button>
         </form>

         <div className="text-center pt-6 border-t border-secondary/10">
            <p className="text-sm text-stone-500">Hesabınız yok mu?</p>
            <Link to="/register" className="inline-flex items-center gap-1 text-accent font-bold uppercase text-xs tracking-wider mt-2 hover:underline">
               Hemen Üye Ol <ArrowRight size={14} />
            </Link>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;
