
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Users, Shield, UserPlus } from 'lucide-react';
import { isAuthenticated, getAllAdmins, addAdmin, deleteAdmin, AdminUser, getCurrentUser } from '../../services/authService';

const UserManager: React.FC = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  
  // Add State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin');
      return;
    }
    setCurrentUser(getCurrentUser());
    loadAdmins();
  }, [navigate]);

  const loadAdmins = async () => {
    const data = await getAllAdmins();
    setAdmins(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.length < 3 || newPassword.length < 4) {
      alert("Kullanıcı adı en az 3, şifre en az 4 karakter olmalıdır.");
      return;
    }

    setIsAdding(true);
    const result = await addAdmin(newUsername, newPassword);
    setIsAdding(false);

    if (result.success) {
      setNewUsername('');
      setNewPassword('');
      loadAdmins();
      alert("Yeni yönetici eklendi!");
    } else {
      alert("Hata: " + result.message);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (window.confirm(`"${username}" kullanıcısını silmek istediğinize emin misiniz?`)) {
       const success = await deleteAdmin(id);
       if (success) loadAdmins();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 border border-secondary/20 rounded-full hover:bg-white text-stone-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-serif text-3xl text-ink">Kullanıcı Yönetimi</h2>
          <p className="text-stone-400 text-sm">Panel yöneticilerini listeleyin veya ekleyin.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Add New Form */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-sm border border-secondary/20 shadow-sm h-fit sticky top-24">
            <h3 className="font-serif text-lg mb-4 flex items-center gap-2 border-b border-secondary/10 pb-2">
              <UserPlus size={18} className="text-accent" /> Yeni Yönetici Ekle
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                 <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Kullanıcı Adı</label>
                 <input 
                   type="text" 
                   value={newUsername}
                   onChange={(e) => setNewUsername(e.target.value)}
                   className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm"
                   required
                 />
              </div>
              <div>
                 <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Şifre</label>
                 <input 
                   type="password" 
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   className="w-full p-3 bg-background border border-secondary/30 rounded-sm focus:border-accent outline-none text-ink text-sm"
                   required
                 />
              </div>
              <button 
                type="submit" 
                disabled={isAdding}
                className="w-full bg-accent text-white py-3 rounded-sm hover:bg-blue-300 transition-colors uppercase tracking-widest text-xs font-bold"
              >
                {isAdding ? 'Ekleniyor...' : 'Ekle'}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-2">
           <div className="bg-white p-6 rounded-sm border border-secondary/20 shadow-sm">
             <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
               <Users size={18} className="text-accent" /> Yöneticiler ({admins.length})
            </h3>
            <div className="space-y-2">
              {admins.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-background/50 rounded-sm border border-secondary/10 hover:border-accent/30 transition-all">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white rounded-full border border-secondary/10 text-stone-400">
                        <Shield size={16} />
                     </div>
                     <div>
                        <p className="font-serif text-ink">{user.username}</p>
                        {currentUser?.id === user.id && <span className="text-[10px] bg-accent/10 text-accent px-2 rounded-full">Siz</span>}
                     </div>
                  </div>
                  
                  {currentUser?.id !== user.id && (
                    <button 
                      onClick={() => handleDelete(user.id, user.username)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Kullanıcıyı Sil"
                    >
                       <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default UserManager;
