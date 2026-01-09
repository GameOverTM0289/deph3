# Delphine Swimwear - E-Commerce Store v6.1

A complete e-commerce solution for Delphine Swimwear, built with Next.js 14.

## Features

### Customer Features
- **Homepage** with hero slider, collections grid, editorial photos, and brand story
- **Shop** - Clean product grid with category filters (NO badges, NO quick-add, NO sidebar - per design rules)
- **Product Pages** - Minimalist Zara-style design with image gallery, color swatches (small circles), size selector
- **Collections** - Bikinis and One Pieces with hero images
- **Cart** - Slide-out drawer with quantity controls
- **Wishlist** - Save favorite products
- **Checkout** - Full checkout flow with shipping rates, POK payment
- **Account** - Login/register, order history, profile settings, password change
- **Content Pages** - About, Contact, FAQ, Shipping, Returns, Size Guide, Sustainability, Privacy, Terms, Cookies

### Admin Features
- **Dashboard** - Revenue stats, order overview, recent activity, low stock alerts
- **Orders** - Full order management with status updates, tracking numbers, CSV export
- **Products** - Full CRUD (Create, Read, Update, Delete), stock management, featured/active toggles
- **Customers** - Customer list with order history and total spent
- **Newsletter** - Subscriber management with CSV export
- **Analytics** - Revenue charts, top products, order status breakdown
- **Settings** - Store configuration

## Demo Accounts

```
Admin: admin@delphine.com / admin123
User:  demo@delphine.com / demo123
```

## Design Rules Applied

Following the design analysis document:
- ✅ Colors: Black, gray, beige (sand), dark blue (navy) - NO turquoise
- ✅ Homepage: Banner → Collections → 2 Editorial Photos → Our Story
- ✅ Shop: Clean grid, NO badges, NO quick-add buttons, NO sidebar
- ✅ Product Pages: Minimalist like Zara with small color circles
- ✅ "You May Also Like" section at bottom of product pages
- ✅ Logo properly visible (white on dark, dark on light backgrounds)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Shipping Zones

- **Albania** - Standard €3.99 (1-2 days), Express €6.99 (Next day)
- **Balkans** - Kosovo, N. Macedonia, Greece - €5.99-€14.99
- **Europe** - Italy, Germany, France, UK - €9.99-€27.99
- **International** - USA and others - €19.99-€44.99

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management with persistence)

## Data Persistence

All data (cart, wishlist, orders, products, newsletter) is stored in browser localStorage and persists across sessions.
