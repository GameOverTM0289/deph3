import { CountryShipping, ShippingRate } from './types';

export const formatPrice = (price: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
export const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
export const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
export const formatDateTime = (date: string) => new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

export const validateEmail = (email: string) => {
  if (!email) return { valid: false, error: 'Email required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, error: 'Invalid email' };
  return { valid: true };
};

export const validatePhone = (phone: string) => {
  if (!phone) return { valid: false, error: 'Phone required' };
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (!/^\d{7,15}$/.test(cleaned)) return { valid: false, error: 'Invalid phone' };
  return { valid: true };
};

export const validateRequired = (value: string, field: string) => {
  if (!value?.trim()) return { valid: false, error: `${field} required` };
  return { valid: true };
};

export const validatePassword = (password: string) => {
  if (!password) return { valid: false, error: 'Password required' };
  if (password.length < 8) return { valid: false, error: 'Minimum 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, error: 'Need uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Need lowercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Need a number' };
  return { valid: true };
};

export const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
};

export const PHONE_PREFIXES = [
  { code: 'AL', prefix: '+355', name: 'Albania', flag: '🇦🇱' },
  { code: 'XK', prefix: '+383', name: 'Kosovo', flag: '🇽🇰' },
  { code: 'MK', prefix: '+389', name: 'N. Macedonia', flag: '🇲🇰' },
  { code: 'ME', prefix: '+382', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'GR', prefix: '+30', name: 'Greece', flag: '🇬🇷' },
  { code: 'IT', prefix: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: 'DE', prefix: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', prefix: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'GB', prefix: '+44', name: 'UK', flag: '🇬🇧' },
  { code: 'US', prefix: '+1', name: 'USA', flag: '🇺🇸' },
];

export const SHIPPING_ZONES: CountryShipping[] = [
  { code: 'AL', name: 'Albania', flag: '🇦🇱', zone: 'domestic', rates: [
    { id: 'al-std', name: 'Standard', days: '1-2 days', price: 3.99, carrier: 'Albanian Post' },
    { id: 'al-exp', name: 'Express', days: 'Next day', price: 6.99, carrier: 'DHL Express' },
  ]},
  { code: 'XK', name: 'Kosovo', flag: '🇽🇰', zone: 'balkans', rates: [
    { id: 'xk-std', name: 'Standard', days: '2-3 days', price: 5.99, carrier: 'DHL' },
    { id: 'xk-exp', name: 'Express', days: '1-2 days', price: 9.99, carrier: 'DHL Express' },
  ]},
  { code: 'MK', name: 'N. Macedonia', flag: '🇲🇰', zone: 'balkans', rates: [
    { id: 'mk-std', name: 'Standard', days: '2-4 days', price: 6.99, carrier: 'DHL' },
    { id: 'mk-exp', name: 'Express', days: '1-2 days', price: 12.99, carrier: 'DHL Express' },
  ]},
  { code: 'GR', name: 'Greece', flag: '🇬🇷', zone: 'balkans', rates: [
    { id: 'gr-std', name: 'Standard', days: '3-5 days', price: 7.99, carrier: 'DHL' },
    { id: 'gr-exp', name: 'Express', days: '2-3 days', price: 14.99, carrier: 'DHL Express' },
  ]},
  { code: 'IT', name: 'Italy', flag: '🇮🇹', zone: 'europe', rates: [
    { id: 'it-std', name: 'Standard', days: '5-7 days', price: 9.99, carrier: 'DHL' },
    { id: 'it-exp', name: 'Express', days: '3-4 days', price: 18.99, carrier: 'DHL Express' },
  ]},
  { code: 'DE', name: 'Germany', flag: '🇩🇪', zone: 'europe', rates: [
    { id: 'de-std', name: 'Standard', days: '5-7 days', price: 11.99, carrier: 'DHL' },
    { id: 'de-exp', name: 'Express', days: '3-4 days', price: 21.99, carrier: 'DHL Express' },
  ]},
  { code: 'FR', name: 'France', flag: '🇫🇷', zone: 'europe', rates: [
    { id: 'fr-std', name: 'Standard', days: '5-8 days', price: 12.99, carrier: 'DHL' },
    { id: 'fr-exp', name: 'Express', days: '3-5 days', price: 23.99, carrier: 'DHL Express' },
  ]},
  { code: 'GB', name: 'UK', flag: '🇬🇧', zone: 'europe', rates: [
    { id: 'gb-std', name: 'Standard', days: '7-10 days', price: 15.99, carrier: 'DHL' },
    { id: 'gb-exp', name: 'Express', days: '4-5 days', price: 27.99, carrier: 'DHL Express' },
  ]},
  { code: 'US', name: 'USA', flag: '🇺🇸', zone: 'international', rates: [
    { id: 'us-std', name: 'Standard', days: '10-15 days', price: 24.99, carrier: 'DHL Intl' },
    { id: 'us-exp', name: 'Express', days: '5-7 days', price: 44.99, carrier: 'DHL Express' },
  ]},
];

export const getShippingRates = (countryCode: string): ShippingRate[] => {
  const country = SHIPPING_ZONES.find(c => c.code === countryCode);
  if (country) return country.rates;
  return [
    { id: 'intl-std', name: 'International', days: '10-15 days', price: 19.99, carrier: 'DHL' },
    { id: 'intl-exp', name: 'Express', days: '5-7 days', price: 39.99, carrier: 'DHL Express' },
  ];
};

export const generateOrderId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DLP-${ts}-${rand}`;
};

export const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const CONTACT = {
  email: 'hello@delphineswimwear.com',
  phone: '+355 69 444 4818',
  phoneRaw: '+355694444818',
  address: 'Tirana, Albania',
  instagram: '@delphineswimwear',
  facebook: 'delphineswimwear',
};

export const HERO_SLIDES = [
  { image: '/images/hero/slide-1.jpg', title: 'Summer 2025', subtitle: 'New Collection', cta: 'Discover' },
  { image: '/images/hero/slide-2.jpg', title: 'Mediterranean', subtitle: 'Elegance', cta: 'Explore' },
  { image: '/images/hero/slide-3.jpg', title: 'Sustainable', subtitle: 'Luxury', cta: 'Shop Now' },
];

export const GALLERY_IMAGES = [
  '/images/hero/slide-1.jpg', '/images/hero/slide-2.jpg', '/images/hero/slide-3.jpg',
  '/images/collections/bikinis.jpg', '/images/collections/one-pieces.jpg',
  '/images/products/yellow-simple-1.jpg', '/images/products/red-body-1.jpg', '/images/products/blue-button-1.jpg',
];
