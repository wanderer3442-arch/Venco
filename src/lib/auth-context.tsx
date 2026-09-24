'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from './types';
import { hashPassword, verifyPassword, isHashedPassword } from './crypto-utils';
import {
  isLockedOut,
  getLockoutRemainingSeconds,
  getAttemptsRemaining,
  recordFailedAttempt,
  clearAttempts,
} from './rate-limiter';

// ─── Session Configuration ────────────────────────────────────────────────────
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Developer allowlist ──────────────────────────────────────────────────────
// Accounts matching these get role: 'admin' automatically (Dev Console access).
// Comparison is case-insensitive. Password is never stored here.
const DEVELOPER_EMAILS = new Set<string>([
  'gymathome@gmail.com',
]);
const DEVELOPER_USERNAMES = new Set<string>([
  'dev',
]);

function isDeveloperIdentity(email: string, username: string): boolean {
  return (
    DEVELOPER_EMAILS.has(email.trim().toLowerCase()) ||
    DEVELOPER_USERNAMES.has(username.trim().toLowerCase())
  );
}

// ─── Common password blocklist ────────────────────────────────────────────────
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', 'password1234', 'password12345',
  '12345678', '123456789', '1234567890', 'qwerty123', 'qwerty1234',
  'abc12345', 'abc123456', 'letmein1', 'welcome1', 'monkey123',
  'dragon123', 'master123', 'superman1', 'batman123', 'iloveyou1',
]);

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType extends AuthState {
  signup: (email: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string; lockoutSeconds?: number }>;
  logout: () => void;
  updateUsername: (username: string) => void;
  promoteToAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface StoredUser {
  id: string;
  email: string;
  username: string;
  password: string; // PBKDF2 hash: "iterations:salt:hash"
  createdAt: string;
  role?: 'user' | 'admin';
}

interface StoredSession {
  user: User;
  token: string;
  expiresAt: number; // Unix timestamp in ms
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('gymathome_auth');
    if (saved) {
      try {
        const parsed: StoredSession = JSON.parse(saved);
        // Validate session structure and expiry
        if (
          parsed.user &&
          parsed.token &&
          typeof parsed.expiresAt === 'number' &&
          Date.now() < parsed.expiresAt
        ) {
          setAuthState({ user: parsed.user, isAuthenticated: true });
        } else {
          // Session expired or malformed — clear it
          localStorage.removeItem('gymathome_auth');
        }
      } catch {
        localStorage.removeItem('gymathome_auth');
      }
    }
  }, []);

  const getUsers = (): StoredUser[] => {
    const data = localStorage.getItem('gymathome_users');
    if (!data) return [];
    try {
      return JSON.parse(data) as StoredUser[];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem('gymathome_users', JSON.stringify(users));
  };

  const persistSession = (user: User) => {
    const session: StoredSession = {
      user,
      token: crypto.randomUUID(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    localStorage.setItem('gymathome_auth', JSON.stringify(session));
  };

  // ─── Password validation ────────────────────────────────────────────────────

  const validatePassword = (password: string): string | null => {
    if (password.length < 10) {
      return 'Password must be at least 10 characters';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain a special character';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain a number';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain an uppercase letter';
    }
    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
      return 'This password is too common. Please choose a stronger one';
    }
    return null;
  };

  // ─── Signup ─────────────────────────────────────────────────────────────────

  const signup = async (
    email: string,
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
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

    // Reject usernames that could be used for injection
    if (!/^[a-zA-Z0-9_\-]+$/.test(username)) {
      return { success: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return { success: false, error: passwordError };
    }

    const users = getUsers();

    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already taken' };
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      ...(isDeveloperIdentity(email, username) ? { role: 'admin' as const } : {}),
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    const user: User = userWithoutPassword;

    setAuthState({ user, isAuthenticated: true });
    persistSession(user);

    return { success: true };
  };

  // ─── Login ──────────────────────────────────────────────────────────────────

  const login = async (
    emailOrUsername: string,
    password: string
  ): Promise<{ success: boolean; error?: string; lockoutSeconds?: number }> => {
    if (!emailOrUsername || !password) {
      return { success: false, error: 'All fields are required' };
    }

    // Check rate limit BEFORE doing any DB lookup
    if (isLockedOut(emailOrUsername)) {
      const seconds = getLockoutRemainingSeconds(emailOrUsername);
      const minutes = Math.ceil(seconds / 60);
      return {
        success: false,
        error: `Too many failed attempts. Account locked for ${minutes} more minute${minutes !== 1 ? 's' : ''}.`,
        lockoutSeconds: seconds,
      };
    }

    const users = getUsers();
    const found = users.find(
      u =>
        u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
        u.username.toLowerCase() === emailOrUsername.toLowerCase()
    );

    // Always run password verification (even if user not found) to prevent timing attacks
    // that could reveal whether a username/email exists
    const dummyHash = '310000:00000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000';
    const storedHash = found?.password ?? dummyHash;

    let passwordMatch: boolean;

    // Legacy migration: if a legacy plain-text password is stored, compare directly
    // then re-hash and save transparently
    if (found && !isHashedPassword(storedHash)) {
      // Legacy plain-text comparison (migration path only)
      passwordMatch = storedHash === password;
      if (passwordMatch) {
        // Re-hash the password and save it
        const newHash = await hashPassword(password);
        const updatedUsers = users.map(u =>
          u.id === found.id ? { ...u, password: newHash } : u
        );
        saveUsers(updatedUsers);
      }
    } else {
      passwordMatch = await verifyPassword(password, storedHash);
    }

    if (!found || !passwordMatch) {
      recordFailedAttempt(emailOrUsername);
      const remaining = getAttemptsRemaining(emailOrUsername);

      if (isLockedOut(emailOrUsername)) {
        const seconds = getLockoutRemainingSeconds(emailOrUsername);
        const minutes = Math.ceil(seconds / 60);
        return {
          success: false,
          error: `Too many failed attempts. Account locked for ${minutes} minute${minutes !== 1 ? 's' : ''}.`,
          lockoutSeconds: seconds,
        };
      }

      const attemptMsg = remaining > 0
        ? ` (${remaining} attempt${remaining !== 1 ? 's' : ''} remaining)`
        : '';
      return { success: false, error: `Invalid credentials${attemptMsg}` };
    }

    // Successful login — clear rate limit
    clearAttempts(emailOrUsername);

    const { password: _, ...userWithoutPassword } = found;
    let user: User = userWithoutPassword;

    // Developer allowlist — promote on login (covers accounts created before allowlist existed)
    if (isDeveloperIdentity(found.email, found.username) && found.role !== 'admin') {
      found.role = 'admin';
      saveUsers(users);
      user = { ...user, role: 'admin' };
    }

    setAuthState({ user, isAuthenticated: true });
    persistSession(user);

    return { success: true };
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('gymathome_auth');
  };

  // ─── Update Username ─────────────────────────────────────────────────────────

  const updateUsername = (username: string) => {
    if (!authState.user) return;

    if (!/^[a-zA-Z0-9_\-]+$/.test(username)) return;

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
    persistSession(updatedUser);
  };

  const promoteToAdmin = () => {
    if (!authState.user) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === authState.user!.id);
    if (userIndex !== -1) {
      users[userIndex].role = 'admin';
      saveUsers(users);
    }

    const updatedUser = { ...authState.user, role: 'admin' as const };
    setAuthState({ user: updatedUser, isAuthenticated: true });
    persistSession(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ ...authState, signup, login, logout, updateUsername, promoteToAdmin }}>
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
