
import { supabase } from './supabaseClient';

const AUTH_KEY = 'beyazbulut_auth_token';
const USER_INFO_KEY = 'beyazbulut_admin_user';

interface LoginResult {
  success: boolean;
  message?: string;
  debugInfo?: string;
}

export interface AdminUser {
  id: number;
  username: string;
}

export const login = async (username: string, password: string): Promise<LoginResult> => {
  try {
    console.log("Giriş deneniyor...", username);

    // 1. Yöntem: Güvenli RPC Fonksiyonu
    const { data: rpcData, error: rpcError } = await supabase.rpc('login_admin', {
      input_username: username,
      input_password: password
    });

    if (!rpcError && rpcData && rpcData.success) {
       console.log("RPC Giriş Başarılı");
       localStorage.setItem(AUTH_KEY, 'true');
       localStorage.setItem(USER_INFO_KEY, JSON.stringify({ username: rpcData.username, id: rpcData.id }));
       return { success: true };
    }

    // 2. Yöntem: Direkt Tablo Sorgusu (Yedek)
    if (rpcError) {
        console.warn("RPC Login başarısız, direkt tablo sorgusu deneniyor...", rpcError.message);
        
        const { data: selectData, error: selectError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .maybeSingle();

        if (!selectError && selectData) {
            console.log("Direkt Tablo Girişi Başarılı");
            localStorage.setItem(AUTH_KEY, 'true');
            localStorage.setItem(USER_INFO_KEY, JSON.stringify({ username: selectData.username, id: selectData.id }));
            return { success: true };
        }
        
        if (selectError) {
             return { success: false, message: "Veritabanı bağlantı hatası.", debugInfo: selectError.message };
        }

        const { data: userExists } = await supabase.from('admin_users').select('id').eq('username', username).maybeSingle();
        
        if (!userExists) {
            return { 
                success: false, 
                message: "Kullanıcı bulunamadı veya erişim engellendi.", 
                debugInfo: "Eğer kullanıcı adından eminseniz, Supabase panelinden 'admin_users' tablosunun RLS ayarını kapattığınızdan (Disable RLS) emin olun." 
            };
        }
    }

    return { success: false, message: "Şifre hatalı." };

  } catch (err: any) {
    console.error("Login critical error:", err);
    return { success: false, message: "Beklenmeyen bir hata oluştu.", debugInfo: err.message };
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_INFO_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_INFO_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// --- USER MANAGEMENT FUNCTIONS ---

export const getAllAdmins = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, username')
    .order('id');
  
  if (error) {
    console.error("Fetch admins error:", error);
    return [];
  }
  return data as AdminUser[];
};

export const addAdmin = async (username: string, password: string): Promise<{success: boolean, message?: string}> => {
  // Check if exists
  const { data: existing } = await supabase.from('admin_users').select('id').eq('username', username).maybeSingle();
  if (existing) return { success: false, message: "Bu kullanıcı adı zaten kullanılıyor." };

  const { error } = await supabase
    .from('admin_users')
    .insert([{ username, password }]);

  if (error) return { success: false, message: error.message };
  return { success: true };
};

export const deleteAdmin = async (id: number): Promise<boolean> => {
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === id) {
    alert("Kendinizi silemezsiniz!");
    return false;
  }

  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id);

  return !error;
};

export const updateAdminProfile = async (currentUsername: string, newUsername: string, newPassword?: string): Promise<boolean> => {
  const updates: any = { username: newUsername };
  if (newPassword && newPassword.length > 0) {
    updates.password = newPassword;
  }

  const { error } = await supabase
    .from('admin_users')
    .update(updates)
    .eq('username', currentUsername);

  if (error) {
    console.error("Update profile error:", error);
    return false;
  }

  // Update local storage if username changed
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.username === currentUsername) {
     localStorage.setItem(USER_INFO_KEY, JSON.stringify({ ...currentUser, username: newUsername }));
  }

  return true;
};
