import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  showAuth: boolean;
  setShowAuth: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const loadUser = (): User | null => {
  try { return JSON.parse(localStorage.getItem('b2c_user') || 'null'); }
  catch { return null; }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(loadUser);
  const [showAuth, setShowAuth] = useState(false);

  const login = (email: string, name: string) => {
    const u = { email, name };
    setUser(u);
    localStorage.setItem('b2c_user', JSON.stringify(u));
    setShowAuth(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('b2c_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuth, setShowAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
