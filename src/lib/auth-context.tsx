'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from './types';

interface AuthContextType extends AuthState {
  signup: (email: string, username: string, password: string) => { success: boolean; error?: string };
  login: (emailOrUsername: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateUsername: (username: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface StoredUser {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('vencofit_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAuthState({ user: parsed.user, isAuthenticated: true });
      } catch {
        localStorage.removeItem('vencofit_auth');
      }
    }
  }, []);

  const getUsers = (): StoredUser[] => {
    const data = localStorage.getItem('vencofit_users');
    return data ? JSON.parse(data) : [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem('vencofit_users', JSON.stringify(users));
  };

  const signup = (email: string, username: string, password: string): { success: boolean; error?: string } => {
    if (!email || !username || !password) {
      return { success: false, error: 'All fields are required' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }

    if (/\s/.test(username)) {
      return { success: false, error: 'Username cannot contain spaces' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { success: false, error: 'Password must contain a special character' };
    }

    if (!/\d/.test(password)) {
      return { success: false, error: 'Password must contain a number' };
    }

    const users = getUsers();

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already taken' };
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      username,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    const user: User = userWithoutPassword;

    setAuthState({ user, isAuthenticated: true });
    localStorage.setItem('vencofit_auth', JSON.stringify({ user }));

    return { success: true };
  };

  const login = (emailOrUsername: string, password: string): { success: boolean; error?: string } => {
    if (!emailOrUsername || !password) {
      return { success: false, error: 'All fields are required' };
    }

    const users = getUsers();
    const found = users.find(
      u =>
        (u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
          u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
        u.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid credentials' };
    }

    const { password: _, ...userWithoutPassword } = found;
    const user: User = userWithoutPassword;

    setAuthState({ user, isAuthenticated: true });
    localStorage.setItem('vencofit_auth', JSON.stringify({ user }));

    return { success: true };
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('vencofit_auth');
  };

  const updateUsername = (username: string) => {
    if (!authState.user) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === authState.user!.id);
    if (userIndex === -1) return;

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase() && u.id !== authState.user!.id)) {
      return;
    }

    users[userIndex].username = username;
    saveUsers(users);

    const updatedUser = { ...authState.user, username };
    setAuthState({ user: updatedUser, isAuthenticated: true });
    localStorage.setItem('vencofit_auth', JSON.stringify({ user: updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, signup, login, logout, updateUsername }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
