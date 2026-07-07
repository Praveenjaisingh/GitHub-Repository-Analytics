import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('gra_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await AuthAPI.me();
      setUser(me);
    } catch (err) {
      // token invalid/expired
      localStorage.removeItem('gra_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = () => {
    window.location.href = AuthAPI.loginUrl;
  };

  const completeLogin = (newToken) => {
    localStorage.setItem('gra_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('gra_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, completeLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
