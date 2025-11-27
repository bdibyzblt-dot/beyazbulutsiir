
import { supabase } from './supabaseClient';
import { UserProfile } from '../types';

// --- ADMIN AUTH (Custom Table) ---
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
    const { data: rpcData, error: rpcError } = await supabase.rpc('login_admin', {
      input_username: username,
      input_password: password
    });

    if (!rpcError && rpcData && rpcData.success) {
       localStorage.setItem(AUTH_KEY, 'true');
       localStorage.setItem(USER_INFO_KEY, JSON.stringify({ username: rpcData.username, id: rpcData.id }));
       return { success: true };
    }

    if (rpcError) {
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
    }
    return { success: false, message: "Şifre hatalı veya kullanıcı bulunamadı." };

  } catch (err: any) {
    return { success: false, message: "Beklenmeyen hata.", debugInfo: err.message };
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

// --- PUBLIC AUTH (Supabase Native) ---

export const signUpPublic = async (email: string, password: string, fullName: string, username: string): Promise<{success: boolean, message?: string}> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username: username
      }
    }
  });

  if (error) return { success: false, message: error.message };
  return { success: true };
};

export const signInPublic = async (email: string, password: string): Promise<{success: boolean, message?: string}> => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) return { success: false, message: error.message };
  return { success: true };
};

export const signOutPublic = async () => {
  await supabase.auth.signOut();
};

export const getPublicUser = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || '',
    username: user.user_metadata?.username || 'Kullanıcı',
    fullName: user.user_metadata?.full_name || ''
  };
};

// --- ADMIN USER MANAGEMENT ---
export const getAllAdmins = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase.from('admin_users').select('id, username').order('id');
  if (error) return [];
  return data as AdminUser[];
};

export const addAdmin = async (username: string, password: string): Promise<{success: boolean, message?: string}> => {
  const { data: existing } = await supabase.from('admin_users').select('id').eq('username', username).maybeSingle();
  if (existing) return { success: false, message: "Bu kullanıcı adı zaten kullanılıyor." };
  const { error } = await supabase.from('admin_users').insert([{ username, password }]);
  if (error) return { success: false, message: error.message };
  return { success: true };
};

export const deleteAdmin = async (id: number): Promise<boolean> => {
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === id) return false;
  const { error } = await supabase.from('admin_users').delete().eq('id', id);
  return !error;
};

export const updateAdminProfile = async (currentUsername: string, newUsername: string, newPassword?: string): Promise<boolean> => {
  const updates: any = { username: newUsername };
  if (newPassword && newPassword.length > 0) updates.password = newPassword;
  const { error } = await supabase.from('admin_users').update(updates).eq('username', currentUsername);
  if (error) return false;
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.username === currentUsername) {
     localStorage.setItem(USER_INFO_KEY, JSON.stringify({ ...currentUser, username: newUsername }));
  }
  return true;
};
