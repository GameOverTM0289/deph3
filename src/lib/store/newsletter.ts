import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NewsletterSubscriber } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface NewsletterStore {
  subscribers: NewsletterSubscriber[];
  subscribe: (email: string) => { success: boolean; error?: string };
  unsubscribe: (id: string) => void;
  getActiveSubscribers: () => NewsletterSubscriber[];
  getSubscriberCount: () => number;
  isSubscribed: (email: string) => boolean;
  exportSubscribers: () => string;
}

const DEMO_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: '1', email: 'fashion@example.com', subscribedAt: '2024-11-15T10:30:00Z', status: 'active' },
  { id: '2', email: 'beach.lover@example.com', subscribedAt: '2024-11-20T14:45:00Z', status: 'active' },
  { id: '3', email: 'summer.style@example.com', subscribedAt: '2024-12-01T09:15:00Z', status: 'active' },
  { id: '4', email: 'mediterranean@example.com', subscribedAt: '2024-12-10T16:20:00Z', status: 'active' },
  { id: '5', email: 'old.subscriber@example.com', subscribedAt: '2024-10-05T11:00:00Z', status: 'unsubscribed' },
];

export const useNewsletterStore = create<NewsletterStore>()(persist((set, get) => ({
  subscribers: DEMO_SUBSCRIBERS,
  subscribe: (email) => {
    const normalized = email.toLowerCase().trim();
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return { success: false, error: 'Invalid email address' };
    }
    const existing = get().subscribers.find(s => s.email.toLowerCase() === normalized);
    if (existing) {
      if (existing.status === 'active') return { success: false, error: 'Already subscribed' };
      // Reactivate
      set({ subscribers: get().subscribers.map(s => s.id === existing.id ? { ...s, status: 'active' as const, subscribedAt: new Date().toISOString() } : s) });
      return { success: true };
    }
    const newSub: NewsletterSubscriber = { id: generateId(), email: normalized, subscribedAt: new Date().toISOString(), status: 'active' };
    set({ subscribers: [newSub, ...get().subscribers] });
    return { success: true };
  },
  unsubscribe: (id) => set({ subscribers: get().subscribers.map(s => s.id === id ? { ...s, status: 'unsubscribed' as const } : s) }),
  getActiveSubscribers: () => get().subscribers.filter(s => s.status === 'active'),
  getSubscriberCount: () => get().subscribers.filter(s => s.status === 'active').length,
  isSubscribed: (email) => get().subscribers.some(s => s.email.toLowerCase() === email.toLowerCase() && s.status === 'active'),
  exportSubscribers: () => {
    const active = get().getActiveSubscribers();
    const headers = ['Email', 'Subscribed Date'];
    const rows = active.map(s => [s.email, new Date(s.subscribedAt).toLocaleDateString()]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },
}), { name: 'delphine-newsletter', skipHydration: true }));
