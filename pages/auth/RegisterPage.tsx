
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { signUpPublic } from '../../services/authService';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    website: '' // Honeypot field
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // SECURITY: Honeypot Check
    // If the hidden 'website' field is filled, it's a bot.
    if (formData.website) {
       console.log("Bot detected.");
       return; 
    }

    if (formData.password.length < 6) {
        setError("Şifre en az 6 karakter olmalıdır.");
        return;
    }

    setIsLoading(true);
    setError('');

    const res = await signUpPublic(formData.email, formData.password, formData.fullName, formData.username);
    setIsLoading(false);

    if (res.success) {
      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
      navigate('/login');
    } else {
      setError(res.message || 'Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center animate-fade-in px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl border border-secondary/20 w-full max-w-md space-y-8">
         <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl text-ink">Aramıza Katılın</h2>
            <p className="text-stone-400 text-sm">Kelimelerin büyülü dünyasında yerinizi alın.</p>
         </div>

         {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm border border-red-100 rounded-sm">
               {error}
            </div>
         )}

         <form onSubmit={handleRegister} className="space-y-6">
            
            {/* HONEYPOT FIELD (Hidden) - Anti-bot Security */}
            <div className="hidden">
               <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Ad Soyad</label>
              <input 
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent text-ink"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Kullanıcı Adı</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input 
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent text-ink"
                  placeholder="kullanici_adi"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">E-Posta</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-background border border-secondary/30 rounded-sm focus:outline-none focus:border-accent text-ink"
                  placeholder="En az 6 karakter"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-accent text-white py-3 rounded-sm hover:bg-blue-300 transition-colors uppercase tracking-widest text-sm font-bold flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Kayıt Ol'}
            </button>
         </form>

         <div className="text-center pt-6 border-t border-secondary/10">
            <p className="text-sm text-stone-500">Zaten hesabınız var mı?</p>
            <Link to="/login" className="inline-flex items-center gap-1 text-accent font-bold uppercase text-xs tracking-wider mt-2 hover:underline">
               Giriş Yap <ArrowRight size={14} />
            </Link>
         </div>
      </div>
    </div>
  );
};

export default RegisterPage;
