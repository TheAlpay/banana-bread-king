# 🍌 Banana Bread King

Brisbane's favourite banana bread e-commerce store. Built with Next.js, Firebase, and Stripe.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth (email/password + Google OAuth)
- **Storage**: Firebase Storage (invoice PDFs, product images)
- **Payments**: Stripe Checkout
- **Email**: Resend
- **PDF**: @react-pdf/renderer
- **State**: Zustand
- **Charts**: Recharts
- **Styling**: Tailwind CSS

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Firebase Project

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore**, **Storage**, and **Authentication** (Email/Password + Google)
3. Create a **Service Account** key (Project Settings → Service Accounts → Generate new private key)

### 3. Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Copy your API keys from the dashboard
3. Set up a webhook endpoint pointing to `https://your-domain.com/api/stripe/webhook`
   - Events to listen for: `checkout.session.completed`, `payment_intent.payment_failed`

### 4. Resend

1. Create an account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Copy your API key

### 5. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`.

### 6. Deploy Firebase Rules and Indexes

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

### 7. Seed Firestore

```bash
# Optional: add your Firebase UID to .env.local as ADMIN_UID=your_uid
npx ts-node scripts/seed.ts
```

This seeds all 12 products and 3 sample discount codes.

### 8. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── (store)/          # Customer-facing store
│   ├── page.tsx      # Home
│   ├── products/     # Product listings
│   ├── product/      # Product detail
│   ├── cart/         # Cart page
│   └── checkout/     # Checkout + success
├── account/          # Customer account
├── auth/             # Login, register, forgot password
├── admin/            # Admin panel
└── api/              # API routes (Stripe, discounts, invoices)
components/
├── layout/           # Header, Footer, AdminSidebar
├── product/          # ProductCard
├── cart/             # CartDrawer
└── ui/               # Badge, Button
lib/
├── firebase.ts       # Firebase client
├── firebase-admin.ts # Firebase Admin SDK
├── firestore.ts      # Firestore helpers
├── invoice.tsx       # PDF invoice generator
└── email.ts          # Email templates via Resend
store/
└── cartStore.ts      # Zustand cart state
data/
└── products.ts       # Product seed data
scripts/
└── seed.ts           # Firestore seed script
```

## Key Features

- **Wholesale system**: Users can register as wholesale customers. Admin approves them and can set custom pricing per user.
- **Carton logic**: 10+ loaves = full carton. Cart and product pages show bulk order progress.
- **PDF Invoices**: Auto-generated on order completion with Australian GST (10%) breakdown.
- **Admin panel**: Full order management, user management, discount codes, product CRUD, and analytics.
- **Discount codes**: Percentage or fixed, with optional expiry, usage limits, and minimum order amounts.

## Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client config |
| `FIREBASE_ADMIN_*` | Firebase Admin SDK credentials |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `RESEND_API_KEY` | Resend API key |
| `NEXT_PUBLIC_APP_URL` | Your app URL (e.g. https://bananabreadking.com.au) |
| `ADMIN_UID` | Firebase UID to grant admin role (seed script only) |

## Australian Tax (GST)

GST (10%) is calculated on the order subtotal after any discounts and shown separately on all invoices, as required by Australian tax law.

Invoice numbers follow the format `BBK-YYYY-000001` (sequential, zero-padded).
