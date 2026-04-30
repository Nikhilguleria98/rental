import { createContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('rental_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('rental_token');
      const storedUser = localStorage.getItem('rental_user');

      if (storedToken && storedUser) {
        try {
          // Verify token with backend
          const response = await axios.get('http://localhost:4000/api/auth/verify', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });

          if (response.status === 200) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('rental_token');
            localStorage.removeItem('rental_user');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          // Token expired or invalid, clear storage
          localStorage.removeItem('rental_token');
          localStorage.removeItem('rental_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login(userData, tokenValue) {
        setUser(userData);
        setToken(tokenValue);
        localStorage.setItem('rental_token', tokenValue);
        localStorage.setItem('rental_user', JSON.stringify(userData));
      },
      async logout() {
        if (token) {
          await axios.post('http://localhost:4000/api/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('rental_token');
        localStorage.removeItem('rental_user');
      },
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
