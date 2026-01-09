import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  users: Record<string, { password: string; user: User }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_USERS: Record<string, { password: string; user: User }> = {
  'admin@delphine.com': { password: 'admin123', user: { id: 'admin-1', email: 'admin@delphine.com', name: 'Admin User', isAdmin: true, createdAt: '2024-01-01' } },
  'demo@delphine.com': { password: 'demo123', user: { id: 'user-1', email: 'demo@delphine.com', name: 'Demo User', phone: '+355691234567', isAdmin: false, createdAt: '2024-06-01' } },
};

export const useUserStore = create<UserStore>()(persist((set, get) => ({
  user: null, isAuthenticated: false, users: DEFAULT_USERS,
  login: async (email, password) => {
    await new Promise(r => setTimeout(r, 500));
    const entry = get().users[email.toLowerCase()];
    if (entry && entry.password === password) {
      set({ user: entry.user, isAuthenticated: true });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  },
  register: async (data) => {
    await new Promise(r => setTimeout(r, 500));
    if (get().users[data.email.toLowerCase()]) return { success: false, error: 'Email already exists' };
    const newUser: User = { id: `user-${Date.now()}`, email: data.email, name: data.name, phone: data.phone, isAdmin: false, createdAt: new Date().toISOString() };
    set({ users: { ...get().users, [data.email.toLowerCase()]: { password: data.password, user: newUser } }, user: newUser, isAuthenticated: true });
    return { success: true };
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  updateProfile: (data) => {
    const c = get().user;
    if (c) {
      const updated = { ...c, ...data };
      const users = { ...get().users };
      if (users[c.email.toLowerCase()]) {
        users[c.email.toLowerCase()] = { ...users[c.email.toLowerCase()], user: updated };
      }
      set({ user: updated, users });
    }
  },
  changePassword: async (oldPassword, newPassword) => {
    await new Promise(r => setTimeout(r, 500));
    const c = get().user;
    if (!c) return { success: false, error: 'Not logged in' };
    const entry = get().users[c.email.toLowerCase()];
    if (!entry || entry.password !== oldPassword) return { success: false, error: 'Current password is incorrect' };
    const users = { ...get().users };
    users[c.email.toLowerCase()] = { ...entry, password: newPassword };
    set({ users });
    return { success: true };
  },
}), { name: 'delphine-user', skipHydration: true }));
