import { supabase } from './supabaseClient';

const AUTH_KEY = 'beyazbulut_auth_token';
const USER_INFO_KEY = 'beyazbulut_admin_user';

// Login now checks the database
export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('password', password) // Note: In a real production app, passwords should be hashed!
      .single();

    if (error || !data) {
      return false;
    }

    // Success
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(USER_INFO_KEY, JSON.stringify({ username: data.username, id: data.id }));
    return true;
  } catch (err) {
    console.error("Login error:", err);
    return false;
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