\---



\## PAGES — DETAILED REQUIREMENTS



\### HOME (`/`)

\- \*\*Hero\*\*: Full-width, Playfair Display headline \*"Brisbane's Favourite Banana Bread"\*, two CTAs (Classic Range / Gluten Free \& Vegan), warm cream background with grain overlay

\- \*\*Trust Strip\*\*: 3 columns — 🍌 Local QLD Bananas | 🌿 Gluten Free Options | 🐣 Egg Free \& No Added Sugar

\- \*\*Featured Products\*\*: 3 product cards with add-to-cart button directly on card

\- \*\*Range Promo\*\*: Two large category cards side-by-side

\- \*\*Carton CTA Banner\*\*: "Buying for your cafe or restaurant? Order 10+ for a full carton."

\- \*\*Order Banner\*\*: "Ready to order?" with email button



\### PRODUCTS (`/products`)

Two range category cards — Classic Range + Gluten Free \& Vegan Range



\### RANGE PAGE (`/products/\[range]`)

\- Filter/sort bar (by variety: 600g / 2.4kg)

\- Grid of ProductCards

\- Each card: image, name, features badges, variety selector, quantity selector, "Add to Cart" button, heart icon (favorite)

\- Carton notice: if cart total for this range hits 10, show green banner



\### PRODUCT DETAIL (`/product/\[slug]`)

\- Large image left, details right

\- All product info, feature badges

\- Variety selector (600g / 2.4kg)

\- Quantity selector with carton logic messaging:

&#x20; - 1-9: "Individual purchase"

&#x20; - 10+: "🎉 Full carton — bulk order!"

\- Price display: if user has custom price, show it (no retail price shown)

\- Add to Cart + Add to Favorites buttons

\- Related products at bottom



\### CART (`/cart`)

\- Cart items list with quantity controls

\- Carton grouping: group items, show "X items — Y cartons + Z individual" summary

\- Discount code input field with validation (API call to `/api/discount/validate`)

\- Order summary: subtotal, discount, total

\- "Proceed to Checkout" button (requires login — redirect to /auth/login if not logged in)

\- Price shown per user's resolved price



\### CHECKOUT (`/checkout`)

\- Requires auth

\- Shipping address form (pre-filled from user profile if available)

\- Order notes field

\- Order summary (read-only)

\- "Pay with Stripe" button → calls `/api/stripe/create-checkout`

\- For wholesale users: option to request invoice (net-30) — just marks order as invoice-requested, admin handles manually



\### CHECKOUT SUCCESS (`/checkout/success`)

\- "Thank you for your order!" 

\- Order summary

\- Invoice download button (PDF generated automatically)

\- Link to /account/orders



\### ACCOUNT DASHBOARD (`/account`)

\- Welcome message with user name

\- Quick stats: Total Orders | Total Spent | Active Orders

\- Recent orders list (last 5)

\- Quick links: View All Orders | Edit Profile | Favorites

\- Wholesale badge if user.role === 'wholesale'



\### ACCOUNT ORDERS (`/account/orders`)

\- Paginated orders table: order number, date, items, total, status badge, invoice download

\- Filter by status



\### ORDER DETAIL (`/account/orders/\[orderId]`)

\- Full order breakdown

\- Invoice PDF download button

\- Order status timeline (placed → paid → processing → shipped → delivered)



\### FAVORITES (`/account/favorites`)

\- Grid of favorited products with add-to-cart



\### AUTH PAGES

\- `/auth/login`: Email/password + Google OAuth button, link to register

\- `/auth/register`: Name, email, password, optional: Company Name + ABN (if wholesale account requested), checkbox "I'm registering as a wholesale customer"

&#x20; - If wholesale checkbox: role set to 'wholesale', approved: false — show "Your wholesale account is pending approval"

&#x20; - Regular customers: approved: true immediately

\- `/auth/forgot-password`: Email input, send reset link via Firebase



\---



\## ADMIN PANEL (`/admin`)



Protected by AdminGuard — only users with role: 'admin' can access.



\### Admin Layout

\- Left sidebar with sections:

&#x20; - 📊 Dashboard

&#x20; - 📦 Orders

&#x20; - 🍌 Products

&#x20; - 👥 Users

&#x20; - 🏷️ Discounts

&#x20; - 🧾 Invoices

&#x20; - 📈 Analytics

\- Top bar: admin name, logout button

\- Dark sidebar (warm-brown #5C3317), cream content area



\### Dashboard (`/admin`)

Stats cards:

\- Total Revenue (this month)

\- Orders Today

\- Pending Orders

\- Pending Wholesale Approvals (badge alert if >0)

\- Total Customers

\- Low Stock alerts



Recent orders table (last 10) with quick status update dropdown.



\### Orders (`/admin/orders`)

Full orders table:

\- Columns: Order #, Date, Customer, Company, Items, Total, Discount, Status, Actions

\- Filters: status, date range, wholesale/retail

\- Bulk actions: mark as processing, mark as shipped

\- Click row → order detail



\### Order Detail (`/admin/orders/\[orderId]`)

\- Full order info

\- Status update dropdown (pending → paid → processing → shipped → delivered → cancelled)

\- Customer info with link to user profile

\- Manual invoice generation button

\- Manual invoice email send button

\- Internal notes field (admin only)



\### Products (`/admin/products`)

\- Table: name, range, price (AUD), varieties, stock status, actions

\- Add Product button → `/admin/products/new`

\- Edit / Delete per product



\### Add/Edit Product (`/admin/products/new` and `/admin/products/\[id]`)

Form fields:

\- Name, slug (auto-generated from name), range selector

\- Description, features (multi-input chips)

\- Varieties (checkboxes: 600g, 2.4kg)

\- Base Price (AUD — input in dollars, store as cents)

\- Stripe Price ID (manual input for now)

\- Image upload → Firebase Storage

\- In Stock toggle

\- Save / Cancel buttons



\### Users (`/admin/users`)

Table:

\- Columns: Name, Email, Role badge, Company, ABN, Approved status, Custom Price, Joined, Actions

\- Filter: all / customers / wholesale / pending approval

\- "Approve" button for pending wholesale users (sets approved: true)

\- Click row → user detail



\### User Detail (`/admin/users/\[userId]`)

\- Full user info display

\- Role change dropdown

\- Custom Price Override field (enter AUD price → saved as cents)

\- Toggle wholesale approval

\- Order history for this user

\- Total spent



\### Discounts (`/admin/discounts`)

Table of all discount codes:

\- Code, Type, Value, Min Order, Uses (used/max), Status, Expires, Actions



Create Discount form (inline or modal):

\- Code (uppercase, auto-format)

\- Type: Percentage or Fixed Amount

\- Value

\- Minimum order amount (optional)

\- Max uses (optional, leave blank for unlimited)

\- Expiry date (optional)

\- Active toggle

\- Create button → saves to Firestore `discountCodes` collection



Deactivate / Delete per code.



\### Invoices (`/admin/invoices`)

Table: Invoice #, Order #, Customer, Amount, Generated, Email Sent, Actions

\- Manual regenerate PDF button

\- Resend email button



\### Analytics (`/admin/analytics`)

Charts (use Recharts):

\- Revenue over time (line chart — daily/weekly/monthly toggle)

\- Orders by status (pie chart)

\- Top 5 products by revenue (bar chart)

\- New customers per month (bar chart)

\- Wholesale vs retail revenue split (donut chart)



All data pulled from Firestore, aggregated client-side.



\---



\## API ROUTES



\### `POST /api/stripe/create-checkout`

\- Auth required (verify Firebase ID token in header)

\- Body: `{ items: CartItem\[], shippingAddress: Address, discountCode?: string, notes?: string }`

\- Resolves unit price per user (check Firestore user doc for customPriceOverride)

\- Validates discount code if provided

\- Creates Stripe Checkout Session with line items

\- Returns `{ sessionId, url }`



\### `POST /api/stripe/webhook`

\- Stripe webhook (verify signature with STRIPE\_WEBHOOK\_SECRET)

\- On `checkout.session.completed`:

&#x20; - Create order document in Firestore

&#x20; - Generate invoice PDF → upload to Firebase Storage

&#x20; - Send order confirmation email via Resend (with invoice attached)

&#x20; - Update discount code usedCount + usedBy

\- On `payment\_intent.payment\_failed`:

&#x20; - Update order status to cancelled



\### `POST /api/discount/validate`

\- Body: `{ code: string, orderAmount: number, userId: string }`

\- Check Firestore for code

\- Validate: active, not expired, not exceeded maxUses, user hasn't used it, meets minOrderAmount

\- Returns: `{ valid: boolean, discount: DiscountCodeDoc | null, error?: string }`



\### `POST /api/invoices/generate`

\- Body: `{ orderId: string }`

\- Fetch order from Firestore

\- Generate PDF with @react-pdf/renderer

\- Upload to Firebase Storage

\- Update order doc with invoiceUrl

\- Returns: `{ invoiceUrl: string }`



\### `POST /api/invoices/send`

\- Body: `{ orderId: string }`

\- Fetch invoice PDF from Storage

\- Send via Resend to user email with PDF attachment

\- Returns: `{ success: boolean }`



\---



\## INVOICE PDF TEMPLATE (`lib/invoice.tsx`)



Professional PDF with:

\- Banana Bread King logo/name header

\- Invoice number (BBK-YYYY-XXXXXX format, sequential)

\- Invoice date + due date

\- Bill To: customer name, company, address, ABN (if wholesale)

\- From: Banana Bread King, Brisbane QLD, ABN if available, info@bananabreadking.com.au

\- Items table: Product, Variety, Qty, Unit Price, Total

\- Subtotal, Discount (if any), GST (10% — Australian tax), Grand Total

\- Payment status

\- Footer: "Thank you for your order. Questions? order@bananabreadking.com.au"

\- Brand colors: warm brown header, clean white body



\---



\## EMAIL TEMPLATES (`lib/email.ts`)



Using Resend with HTML emails:



\*\*Order Confirmation\*\*:

\- Subject: "Order Confirmed — Banana Bread King #BBK-YYYY-XXXXXX"

\- Warm branded HTML email

\- Order summary table

\- Invoice PDF attached

\- "View Your Order" button linking to /account/orders/\[orderId]



\*\*Invoice Email\*\* (manual send from admin):

\- Subject: "Invoice #BBK-YYYY-XXXXXX — Banana Bread King"

\- Invoice PDF attached

\- Payment instructions if wholesale/net-30



\*\*Wholesale Approval\*\*:

\- Subject: "Your Wholesale Account Has Been Approved — Banana Bread King"

\- Welcome message, login link



\---



\## CART STORE (`store/cartStore.ts`)



Zustand store:

```typescript

interface CartStore {

&#x20; items: CartItem\[]

&#x20; addItem: (product: ProductDoc, variety: string, quantity: number, unitPrice: number) => void

&#x20; removeItem: (productId: string, variety: string) => void

&#x20; updateQuantity: (productId: string, variety: string, quantity: number) => void

&#x20; clearCart: () => void

&#x20; getTotalItems: () => number

&#x20; getSubtotal: () => number

&#x20; isCarton: () => boolean          // true if getTotalItems() >= 10

&#x20; cartonProgress: () => number     // items towards next carton (0-9)

}

```



Persist cart to localStorage.



\---



\## PRODUCT DATA (`data/products.ts`)



Seed data for all 12 products:



\*\*Classic Range (6 products)\*\*:

1\. Classic Banana Bread — classic loaf, 600g + 2.4kg

2\. Choc Chip Banana Bread — chocolate chips, 600g + 2.4kg

3\. Banana \& Walnut Banana Bread — crunchy walnuts, 600g + 2.4kg

4\. Banana \& Date Banana Bread — naturally sweetened with dates, 600g + 2.4kg

5\. Lemon \& Poppy Seed Banana Bread — zesty citrus, 600g + 2.4kg

6\. Cinnamon \& Raisin Banana Bread — warming cinnamon + raisins, 600g + 2.4kg



\*\*Gluten Free \& Vegan Range (6 products)\*\*:

1\. Raspberry \& Pear Banana Bread — GF coconut + rice flour, 600g + 2.4kg

2\. Blueberry Banana Bread — GF coconut + rice flour, 600g + 2.4kg

3\. Apple \& Cinnamon Banana Bread — GF coconut + rice flour, 600g + 2.4kg

4\. Mango \& Coconut Banana Bread — GF coconut + rice flour, 600g + 2.4kg

5\. Walnut Banana Bread (GF) — GF coconut + rice flour, 600g only

6\. Classic Banana Bread (GF) — GF coconut + rice flour, 600g + 2.4kg



All features: Egg Free, No Added Sugar. GF range also: Gluten Free, Vegan.

Base price: set as placeholder (1000 cents = $10.00 AUD) — admin changes via panel.



\---



\## SECURITY RULES



Create `firestore.rules`:

\- Users can only read/write their own user doc

\- Users can only read/write their own orders

\- Users can only read/write their own favorites

\- Products are publicly readable, admin-only writable

\- Discount codes: users can read (for validation) but not write

\- Admin role check on all admin writes



Create `storage.rules`:

\- Invoice PDFs: only readable by the order's owner + admin

\- Product images: publicly readable, admin-only writable



\---



\## FIREBASE INDEXES



Create `firestore.indexes.json` for:

\- orders: userId + createdAt (desc)

\- orders: status + createdAt (desc)

\- discountCodes: active + expiresAt



\---



\## RESPONSIVE DESIGN



\- Mobile-first

\- Admin panel: collapsible sidebar on mobile

\- Cart: slide-out drawer on all screen sizes

\- Product grid: 1 col mobile / 2 col tablet / 3 col desktop

\- Tables: horizontal scroll on mobile



\---



\## SEED SCRIPT



Create `scripts/seed.ts` — a script to seed Firestore with:

\- All 12 products from data/products.ts

\- One admin user (set role: 'admin' on a specified UID)

\- 3 sample discount codes: WELCOME10 (10% off), BULK5 (5% off, min $50), KINGOFF (fixed $5 off)



Run with: `npx ts-node scripts/seed.ts`



\---



\## FINAL NOTES



\- Use server components wherever possible, client components only where interactivity needed

\- All monetary values stored as integer cents in Firestore, displayed as dollars in UI

\- GST (10%) must be shown separately on invoices (Australian requirement)

\- Invoice numbers format: BBK-YYYY-000001 (padded, sequential — use Firestore counter doc)

\- All admin routes must check role === 'admin' server-side via Firebase Admin SDK

\- Install and configure Firebase Admin SDK separately for server-side auth verification

\- Use Next.js middleware (`middleware.ts`) for route protection: redirect unauthenticated users from /account/\* and /admin/\* to /auth/login

\- Add a `README.md` with setup instructions: Firebase project setup, Stripe webhook config, environment variables guide

