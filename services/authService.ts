
const AUTH_KEY = 'beyazbulut_auth_token';

export const login = (password: string): boolean => {
  if (password === 'admin123') {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};
