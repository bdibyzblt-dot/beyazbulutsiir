
import { supabase } from './supabaseClient';

const AUTH_KEY = 'beyazbulut_auth_token';
const USER_INFO_KEY = 'beyazbulut_admin_user';

interface LoginResult {
  success: boolean;
  message?: string;
  debugInfo?: string;
}

export const login = async (username: string, password: string): Promise<LoginResult> => {
  try {
    console.log("Giriş deneniyor...", username);

    // 1. Yöntem: Güvenli RPC Fonksiyonu
    // Eğer kullanıcı 'login_admin' fonksiyonunu oluşturduysa bu en güvenli yoldur.
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
    // Eğer RPC fonksiyonu yoksa veya hata verdiyse buraya düşer.
    // DİKKAT: Bu yöntemin çalışması için Supabase panelinde 'admin_users' tablosunda RLS (Row Level Security) KAPALI olmalıdır.
    if (rpcError) {
        console.warn("RPC Login başarısız (SQL fonksiyonu eksik olabilir), direkt tablo sorgusu deneniyor...", rpcError.message);
        
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
             console.error("Tablo sorgu hatası:", selectError);
             return { success: false, message: "Veritabanı bağlantı hatası.", debugInfo: selectError.message };
        }

        // Eğer hata yok ama veri de yoksa: Kullanıcı adı/şifre yanlış VEYA RLS engelliyor.
        // Bunu anlamak için kullanıcı adını tek başına sorgulayalım (şifresiz).
        const { data: userExists } = await supabase.from('admin_users').select('id').eq('username', username).maybeSingle();
        
        if (!userExists) {
            // Kullanıcı hiç bulunamadı. Ya yok, ya da RLS engelliyor (çünkü RLS varsa boş döner).
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
