import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(persist((set, get) => ({
  items: [],
  addItem: (id) => set({ items: [...get().items.filter(i => i !== id), id] }),
  removeItem: (id) => set({ items: get().items.filter(i => i !== id) }),
  toggleItem: (id) => get().items.includes(id) ? get().removeItem(id) : get().addItem(id),
  isInWishlist: (id) => get().items.includes(id),
  clearWishlist: () => set({ items: [] }),
  getCount: () => get().items.length,
}), { name: 'delphine-wishlist', skipHydration: true }));
