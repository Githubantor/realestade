import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('elara_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('elara_token');

  useEffect(() => {
    if (token && !user) {
      setLoading(true);
      api.me()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('elara_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('elara_token', res.token);
    localStorage.setItem('elara_user', JSON.stringify(res.user));
    setUser(res.user);
    return res;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.register({ name, email, password, phone });
    localStorage.setItem('elara_token', res.token);
    localStorage.setItem('elara_user', JSON.stringify(res.user));
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('elara_token');
    localStorage.removeItem('elara_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAgent, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
