
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { isAuthenticated, updateAdminProfile, getCurrentUser } from '../../services/authService';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
      return;
    }
    const user = getCurrentUser();
    if (user) {
        setUsername(user.username);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate only if password field is touched
    if (newPass && newPass.length < 4) {
      alert('Şifre en az 4 karakter olmalıdır.');
      return;
    }

    if (newPass && newPass !== confirmPass) {
      alert('Şifreler eşleşmiyor!');
      return;
    }

    setIsSaving(true);
    const currentUser = getCurrentUser();
    
    const success = await updateAdminProfile(currentUser.username, username, newPass);
    setIsSaving(false);

    if (success) {
      alert('Profiliniz başarıyla güncellendi.');
      navigate('/admin');
    } else {
      alert('Güncelleme sırasında bir hata oluştu (Kullanıcı adı alınmış olabilir).');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 border border-secondary/20 rounded-full hover:bg-white text-stone-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-serif text-3xl text-ink">Profil Düzenle</h2>
          <p className="text-stone-400 text-sm">Kullanıcı adınızı veya şifrenizi güncelleyin.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-sm border border-secondary/20 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Kullanıcı Adı</label>
              <div className="relative">
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink pr-10"
                  required
                />
                <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>

            <div className="h-px bg-secondary/10 my-4"></div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Yeni Şifre (İsteğe Bağlı)</label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink pr-10"
                  placeholder="Değiştirmek istemiyorsanız boş bırakın"
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-accent transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-2">Şifre Tekrar</label>
              <input 
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink"
                placeholder="Şifreyi tekrar girin"
                disabled={!newPass}
                required={!!newPass}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
             <button disabled={isSaving} type="submit" className="flex-1 bg-accent text-white py-4 rounded-sm hover:bg-blue-300 transition-colors uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={18} />} 
                Kaydet
             </button>
             <Link to="/admin" className="px-6 py-4 border border-secondary/30 text-stone-500 rounded-sm hover:bg-background uppercase tracking-widest text-xs flex items-center">
                İptal
             </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
