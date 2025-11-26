
import { supabase } from './supabaseClient';

const AUTH_KEY = 'beyazbulut_auth_token';
const USER_INFO_KEY = 'beyazbulut_admin_user';

interface LoginResult {
  success: boolean;
  message?: string;
}

// Login now attempts both secure RPC and direct table access to ensure admin can get in
export const login = async (username: string, password: string): Promise<LoginResult> => {
  try {
    // 1. Yöntem: Güvenli RPC Fonksiyonu (En İyisi)
    const { data: rpcData, error: rpcError } = await supabase.rpc('login_admin', {
      input_username: username,
      input_password: password
    });

    if (!rpcError && rpcData && rpcData.success) {
       localStorage.setItem(AUTH_KEY, 'true');
       localStorage.setItem(USER_INFO_KEY, JSON.stringify({ username: rpcData.username, id: rpcData.id }));
       return { success: true };
    }

    // 2. Yöntem: Direkt Tablo Sorgusu (Yedek)
    // Eğer kullanıcı RPC fonksiyonunu oluşturmadıysa veya RLS kapalıysa bu çalışır.
    if (rpcError) {
        console.warn("RPC Login başarısız, direkt tablo sorgusu deneniyor...", rpcError.message);
        
        const { data: selectData, error: selectError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .maybeSingle();

        if (!selectError && selectData) {
            localStorage.setItem(AUTH_KEY, 'true');
            localStorage.setItem(USER_INFO_KEY, JSON.stringify({ username: selectData.username, id: selectData.id }));
            return { success: true };
        }
        
        if (selectError) {
             console.error("Tablo sorgu hatası:", selectError);
             return { success: false, message: `Veritabanı Hatası: ${selectError.message}` };
        }
    }

    // İki yöntem de çalıştı ama kullanıcı bulunamadıysa:
    return { success: false, message: "Kullanıcı adı veya şifre hatalı." };

  } catch (err: any) {
    console.error("Login critical error:", err);
    return { success: false, message: `Beklenmeyen Hata: ${err.message || 'Bilinmiyor'}` };
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

export const changePassword = async (newPassword: string): Promise<boolean> => {
  const user = getCurrentUser();
  if (!user || !user.username) return false;

  const { error } = await supabase
    .from('admin_users')
    .update({ password: newPassword })
    .eq('username', user.username);

  if (error) {
    console.error("Change password error:", error);
    return false;
  }
  return true;
};
