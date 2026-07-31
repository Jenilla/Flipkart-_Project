import { createContext, useContext, useEffect, useState } from 'react';
import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
  signupRequest,
} from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the backend if we already have a valid session
  // (the JWT lives in an httpOnly cookie, so this is the only way to know).
  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUserRequest();
      setUser(currentUser);
      setLoading(false);
    })();
  }, []);

  const signup = async ({ name, email, password }) => {
    const result = await signupRequest({ name, email, password });
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const login = async ({ email, password }) => {
    const result = await loginRequest({ email, password });
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  const value = { user, isAuthenticated: Boolean(user), loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
