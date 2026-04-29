import { createContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('rental_token'));

  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem('rental_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
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
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
