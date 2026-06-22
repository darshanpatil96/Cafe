# PROJECT HANDOVER — Veloura Café
### Full-Stack Restaurant Management Platform

**Version:** 1.0 — Session A Complete  
**Stack:** React 19 · Vite 5 · Supabase · Framer Motion · Tailwind CSS 3  
**Last Updated:** June 2026  
**Status:** ~75% Production Ready  
**Build:** `npm run build` → Exit 0 ✅

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Routing System](#4-routing-system)
5. [Context Architecture](#5-context-architecture)
6. [Component Architecture](#6-component-architecture)
7. [Customer Flow](#7-customer-flow)
8. [Admin Flow](#8-admin-flow)
9. [QR Ordering System](#9-qr-ordering-system)
10. [Database Architecture](#10-database-architecture)
11. [LocalStorage Architecture](#11-localstorage-architecture)
12. [API & Service Layer](#12-api--service-layer)
13. [Build & Deployment](#13-build--deployment)
14. [Dependency List](#14-dependency-list)
15. [Known Issues & Limitations](#15-known-issues--limitations)
16. [File Connectivity Map](#16-file-connectivity-map)
17. [Data Flow Diagram](#17-data-flow-diagram)
18. [Project Status](#18-project-status)
19. [Recovery Guide](#19-recovery-guide)

---

## 1. PROJECT OVERVIEW

**Name:** Veloura Café  
*(Legacy strings in some files still say "Aura Cafe" — these are remnants of the original project name and do not affect functionality)*

**Purpose:** A premium full-stack restaurant management platform. It serves two audiences simultaneously from a single React codebase:

- **Customers** browse a dark-luxury menu, choose a dining mode (Dine In via QR / Takeaway / Delivery), add items to a persistent cart, complete checkout, and track their live order status.
- **Staff** use a protected admin portal with a realtime Kanban order board, Kitchen Display System (KDS), analytics charts, and menu management.

**Design Identity:** Deep espresso backgrounds (`stone-950`), coffee-gold accents (`#C9A84C` / `orange-200`), glassmorphism card surfaces, Framer Motion spring physics throughout, a custom magnetic gold cursor that replaces the native OS pointer, ambient café audio, and a 3D animated coffee cup hero rendered from 136 sequential WebP frames via an HTML canvas animation loop.

**Key Features:**
- 8 menu categories, 32+ items with images, ratings, prep time, veg/non-veg, ingredients, nutrition
- Cart with GST (5%) calculation, localStorage persistence, animated drawer
- 3 ordering modes: Dine In (table via QR), Takeaway, Delivery — mode persists via localStorage
- Supabase-backed order creation with instant realtime push (no refresh) to admin + kitchen
- Customer order tracking page with live animated status timeline
- Customer order history (Supabase by email when logged in; localStorage fallback offline)
- Supabase Auth: customer email/password signup + login, session persistence
- Admin demo auth: 3 hardcoded role accounts, no Supabase required
- **Full offline/demo mode** — entire app works without a single Supabase credential

---

## 2. TECH STACK

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI Framework | React | ^19.2.4 | Component rendering, hooks |
| Build Tool | Vite | ^5.4.11 | Dev server, HMR, production bundler |
| Styling | Tailwind CSS | ^3.4.15 | Utility-first CSS, design tokens |
| Animations | Framer Motion | ^12.38.0 | Transitions, spring physics, AnimatePresence |
| Routing | React Router DOM | ^7.13.2 | SPA routing, nested routes, loaders |
| Backend / DB | Supabase JS | ^2.49.9 | PostgreSQL, Auth, Realtime subscriptions |
| Charts | Recharts | ^3.0.2 | Admin analytics (Area, Bar, Pie charts) |
| Icons | Material Symbols Outlined | Google CDN | All UI icons via CSS font |
| Tilt effect | react-parallax-tilt | ^1.7.320 | Legacy 3D card tilt (FoodCard) |
| Icons (alt) | lucide-react | ^1.6.0 | Supplementary icons |
| 3D | @splinetool/react-spline | ^4.1.0 | Installed but not used in active build |
| Fonts | Newsreader, Plus Jakarta Sans, Inter, Playfair Display | Google CDN | Typography system |
| CSS Pipeline | PostCSS + Autoprefixer | latest | Tailwind compilation |
| Linting | ESLint + react-hooks + react-refresh | ^9 | Code quality |

**Architecture decisions:**
- Pure **JavaScript / JSX** — no TypeScript
- **React Context API** only — no Zustand, Redux, or Jotai
- **No test framework** — no Jest, Vitest, or Testing Library configured
- **No SSR** — pure SPA, served as static files

---

## 3. FOLDER STRUCTURE

```
cafe-3d-menu/                          Root
├── .env                               ⚠️ Supabase keys (PLACEHOLDERS — must replace)
├── index.html                         App shell: fonts, icons, App.css link
├── vite.config.js                     Vite + manual chunk splitting (4 vendor chunks)
├── tailwind.config.js                 Design tokens, colors, font families
├── postcss.config.js                  PostCSS pipeline for Tailwind
├── eslint.config.js                   ESLint rules
├── package.json                       npm scripts + all dependencies
├── PROJECT_HANDOVER.md                This file
│
├── public/                            Static assets (Vite serves as-is, no hashing)
│   ├── favicon.svg                    Site favicon
│   ├── icons.svg                      SVG sprite (currently unused)
│   ├── frames/                        136 × WebP — 3D coffee cup canvas animation
│   └── bg-frames/                     144 × WebP — hero background parallax canvas
│
├── supabase/
│   └── schema.sql                     Full DB schema — run ONCE in Supabase SQL Editor
│
└── src/
    ├── App.jsx                        Root: all Providers + complete route tree
    ├── App.css                        Global styles + hero-animations import
    ├── index.css                      Tailwind base/components/utilities + cursor:none
    ├── main.jsx                       ReactDOM.createRoot entry
    │
    ├── assets/
    │   ├── hero.png                   (Unused legacy image)
    │   └── images/                    Locally-hosted images (deployment-safe)
    │       ├── fallback-coffee.webp   Global <img> error fallback
    │       ├── story-interior.webp    Serenity section image
    │       ├── story-pour.webp        Serenity section image
    │       ├── location-downtown.webp Locations card
    │       ├── location-garden.webp   Locations card
    │       └── location-artisan.webp  Locations card
    │
    ├── components/                    Shared customer-facing UI components
    │   ├── ImageWithFallback.jsx      ⭐ Safe <img> with skeleton + error fallback
    │   ├── Navbar.jsx                 Fixed top bar: audio, cart badge, order mode, auth
    │   ├── Hero.jsx                   Full-screen hero: canvas sequence + parallax mouse
    │   ├── Menu.jsx                   Homepage category icons section
    │   ├── CategoryIcons.jsx          Circular icons → navigate /menu/:slug
    │   ├── MenuCard.jsx               Item card: image, qty stepper, add/order buttons
    │   ├── ProductModal.jsx           Item detail modal: ingredients, nutrition, qty
    │   ├── CartDrawer.jsx             Slide-in cart: items, totals, checkout link
    │   ├── MagneticCursor.jsx         Custom gold cursor, z-index MAX, all pages
    │   ├── FloatingParticles.jsx      Background gold dust + SVG coffee beans
    │   ├── LiquidTransition.jsx       SVG espresso-wipe page transition (1.5s)
    │   ├── Footer.jsx                 Links, social, copyright
    │   ├── Serenity.jsx               "Designed for the pause" story section
    │   ├── Locations.jsx              3 café location cards with local images
    │   ├── AutoSequence.jsx           Reusable canvas frame-sequence player
    │   ├── OrderingModeSelectorModal.jsx  Dine In / Takeaway / Delivery chooser
    │   ├── TryTableOrderingBanner.jsx    QR table ordering promo banner
    │   ├── TrustSection.jsx           Trust badges / quality signals
    │   ├── HowItWorks.jsx             3-step ordering explainer
    │   ├── GuestFavorites.jsx         Featured popular items showcase
    │   ├── WhyGuestsLoveVeloura.jsx   Social proof / reviews
    │   ├── VelouraExperience.jsx      Premium experience marketing
    │   ├── ReservationContact.jsx     Table reservation enquiry form
    │   ├── ScrollSequence.jsx         Scroll-driven canvas sequence (legacy)
    │   ├── Hero3D.jsx                 Ping-pong canvas variant (legacy)
    │   ├── GifPlayer.jsx              Interval frame player (legacy)
    │   ├── FoodCard.jsx               Legacy 3D-viewer card (not in active flow)
    │   ├── FoodGrid.jsx               Legacy grid (not in active flow)
    │   └── CategoryTabs.jsx           Legacy pill tabs (not in active flow)
    │
    ├── pages/                         Route-level page components
    │   ├── CategoryPage.jsx           /menu/:slug — banner + filtered menu grid
    │   ├── CheckoutPage.jsx           /checkout — mode-aware order form + success
    │   ├── OrderTrackingPage.jsx      /track/:orderId — live realtime timeline
    │   ├── OrderHistoryPage.jsx       /orders/history — past orders, expandable
    │   ├── LoginPage.jsx              /login — Supabase email/password
    │   ├── SignupPage.jsx             /signup — register + email confirmation
    │   └── TableRouteHandler.jsx      /table/:tableNum — QR scan entry point
    │
    ├── contexts/                      All global state as Provider + custom hook
    │   ├── AuthContext.jsx            Customer Supabase auth
    │   ├── CartContext.jsx            Cart items, totals, drawer open/close
    │   ├── OrderContext.jsx           Orders, Realtime, notifications, ordering mode
    │   ├── AdminAuthContext.jsx       Admin demo session (no Supabase)
    │   └── TransitionContext.jsx      LiquidTransition trigger system
    │
    ├── admin/
    │   ├── components/
    │   │   ├── AdminLayout.jsx        Collapsible sidebar + topbar + Outlet
    │   │   ├── ProtectedRoute.jsx     Auth guard → /admin/login
    │   │   ├── AdminNotifDrawer.jsx   Notification history slide-in panel
    │   │   ├── NewOrderToast.jsx      Global new-order toast (customer + admin)
    │   │   ├── StatusBadge.jsx        Colored status pill component
    │   │   └── statusStyles.js        Tailwind class map per ORDER_STATUS value
    │   └── pages/
    │       ├── AdminLogin.jsx          /admin/login
    │       ├── AdminDashboard.jsx      /admin/dashboard
    │       ├── AdminOrders.jsx         /admin/orders
    │       ├── AdminOrderDetail.jsx    /admin/order/:id
    │       ├── AdminKitchen.jsx        /admin/kitchen (KDS)
    │       ├── AdminAnalytics.jsx      /admin/analytics
    │       ├── AdminMenuManagement.jsx /admin/menu-management
    │       └── AdminTables.jsx         /admin/tables ⚠️ NOT ROUTED IN App.jsx
    │
    ├── hooks/
    │   └── useMagnet.js               Magnetic hover: motion values + custom events
    │
    ├── data/
    │   └── menuData.js                MENU_DATA + CATEGORY_LIST (single source of truth)
    │
    ├── lib/
    │   └── supabase.js                Supabase client + all DB functions
    │
    ├── routes/
    │   └── MenuRoutes.jsx             Legacy route helper (superseded)
    │
    └── styles/
        └── hero-animations.css        GPU-layer classes, steam keyframes, parallax CSS
```

---

## 4. ROUTING SYSTEM

### 4.1 Provider Wrapping Order

```
AdminAuthProvider           (outermost — admin session, no Supabase)
  AuthProvider              (customer Supabase auth)
    OrderProvider           (orders + realtime + ordering mode state)
      TransitionProvider    (liquid page transition trigger)
        CartProvider        (cart items + drawer)
          Router
            MagneticCursor  ← always mounted outside routes, persists everywhere
            Routes
```

`MagneticCursor` is intentionally placed at `Router` scope so it never unmounts between route changes and works equally on customer and admin pages.

### 4.2 Customer Routes (`CustomerShell` wraps: Navbar, Footer, FloatingParticles, LiquidTransition, CartDrawer, NewOrderToast)

| Path | Component | Notes |
|---|---|---|
| `/` | Hero + TrustSection + HowItWorks + TryTableOrderingBanner + Menu + VelouraExperience + WhyGuestsLoveVeloura + GuestFavorites + Locations + ReservationContact | Full homepage, 10 sections |
| `/menu/:slug` | `CategoryPage` | slug = starters, main-course, drinks, desserts, coffee, pastries, brunch, specials |
| `/checkout` | `CheckoutPage` | Mode-aware form — Dine In hides address, shows table; Delivery shows address fields |
| `/track/:orderId` | `OrderTrackingPage` | Realtime subscription per order; works for UUIDs (Supabase) and `ORD-XXXX` (offline) |
| `/orders/history` | `OrderHistoryPage` | Fetches by email if logged in; shows context orders if offline |
| `/login` | `LoginPage` | Supabase email/password; shows "not configured" banner if .env is placeholder |
| `/signup` | `SignupPage` | Client-side validation + Supabase signUp + email confirmation flow |
| `/table/:tableNum` | `TableRouteHandler` | QR entry point — sets orderType + tableNumber, redirects to `/` |
| `*` | `Navigate to /` | All unknown paths redirect home |

### 4.3 Admin Routes (standalone shell — AdminLayout with Outlet, no Navbar/Footer)

Protected by `ProtectedRoute` which checks `useAdminAuth().admin !== null`. Redirects to `/admin/login` otherwise.

| Path | Component | Accessible by |
|---|---|---|
| `/admin/login` | `AdminLogin` | Public (no auth) |
| `/admin` | `AdminDashboard` | All admin roles |
| `/admin/dashboard` | `AdminDashboard` | All admin roles |
| `/admin/orders` | `AdminOrders` | All admin roles |
| `/admin/order/:id` | `AdminOrderDetail` | All admin roles |
| `/admin/menu-management` | `AdminMenuManagement` | Manager role |
| `/admin/analytics` | `AdminAnalytics` | Manager role |
| `/admin/kitchen` | `AdminKitchen` | Kitchen + all roles |
| `/admin/tables` | `AdminTables` | ⚠️ File exists but NOT in App.jsx routes |

### 4.4 QR Route

| Path | Component | Behaviour |
|---|---|---|
| `/table/:tableNum` | `TableRouteHandler` | Reads `tableNum` from URL params, calls `setTableNumber(tableNum)` and `setOrderType('Dine In')` on `OrderContext`, persists to localStorage, then `navigate('/')` |

---

## 5. CONTEXT ARCHITECTURE

### 5.1 AuthContext (`src/contexts/AuthContext.jsx`)

**Purpose:** Supabase customer authentication. Wraps the entire app so all pages can read user state.

**State managed:**
```
user       — Supabase User object (null if not logged in)
profile    — Reserved for public.profiles table row (currently null)
loading    — true while getSession() resolves on mount
authError  — String error from last signIn/signUp attempt
isLoggedIn — Computed: !!user
```

**Methods exposed:**
```
signIn({ email, password })  → { data } or { error }
signUp({ email, password, name, phone }) → { data } or { error }
signOut()                    → clears user + profile
clearError()                 → resets authError
```

**Behaviour:**
- On mount: calls `supabase.auth.getSession()` to restore session from localStorage
- Subscribes to `onAuthStateChange` to handle tab-focus refresh + sign-out from other tabs
- All methods are no-ops (returning `{ error: true }`) when `isSupabaseReady()` is false

**Used by:** `Navbar.jsx`, `LoginPage.jsx`, `SignupPage.jsx`, `OrderHistoryPage.jsx`

---

### 5.2 CartContext (`src/contexts/CartContext.jsx`)

**Purpose:** Shopping cart. Persists across page refreshes via localStorage.

**State managed:**
```
items[]    — Array of { id, title, price, image, isVeg, quantity }
isOpen     — Boolean — cart drawer open/closed
subtotal   — Computed: sum of price × quantity
itemCount  — Computed: sum of all quantities
gst        — Computed: Math.round(subtotal × 0.05)
grandTotal — subtotal + gst
```

**Methods exposed:**
```
addItem(item)          — adds or increments quantity
removeItem(id)         — removes item entirely
updateQty(id, qty)     — sets qty; removes if qty <= 0
clearCart()            — empties cart (called after order placed)
openDrawer()           — sets isOpen = true
closeDrawer()          — sets isOpen = false
```

**localStorage key:** `veloura-cart` — stores the `items` array only

**Used by:** `Navbar.jsx`, `MenuCard.jsx`, `ProductModal.jsx`, `CartDrawer.jsx`, `CheckoutPage.jsx`

---

### 5.3 OrderContext (`src/contexts/OrderContext.jsx`)

**Purpose:** The largest and most complex context. Manages all orders (Supabase + offline), realtime subscriptions, admin notifications, ordering mode (Dine In/Takeaway/Delivery), and table assignment.

**State managed:**
```
orders[]           — All orders (Supabase or seed data)
loading            — true while initial Supabase fetch runs
notifications[]    — { id, order, read, timestamp }
unreadCount        — count of unread notifications
notifDrawerOpen    — admin notification drawer state
menuItems[]        — admin menu management mirror (local)
isOnline           — isSupabaseReady() result
orderType          — 'Dine In' | 'Takeaway' | 'Delivery'
tableNumber        — string, e.g. "5" (set by QR route)
dineInStatus       — 'Available' | 'Occupied' | 'Reserved'
modeSelectorOpen   — boolean, ordering mode modal visibility
```

**Methods exposed:**
```
placeOrder(orderData)          → saves to Supabase or local; returns order object
updateStatus(id, status)       → optimistic local + async Supabase
getOrder(id)                   → single order from state
getOrdersByStatus(status)      → filtered array
getTodayOrders()               → orders placed today
getTodayRevenue()              → sum of non-cancelled today orders
markNotifRead(id)              → marks one notification read
markAllRead()                  → marks all read
toggleNotifDrawer()            → flip notifDrawerOpen
closeNotifDrawer()             → set false
addMenuItem / updateMenuItem / deleteMenuItem → local menu management
setOrderType(type)             → persists to localStorage
setTableNumber(num)            → persists to localStorage
setDineInStatus(status)        → persists to localStorage
setModeSelectorOpen(bool)      → open/close ordering mode modal
```

**Supabase Realtime:** Subscribes to channel `orders-live` on mount (when Supabase is ready).
- `INSERT` on `orders` → fetches full order with items → `ADD_ORDER` dispatch + sound
- `UPDATE` on `orders` → `UPDATE_STATUS` dispatch (deduped against optimistic update)

**Offline fallback:** Uses 5 seed orders from `SEED_ORDERS`. Persists to `veloura-orders` localStorage when Supabase is not configured.

**localStorage keys:** `veloura-orders`, `veloura-order-type`, `veloura-table-number`, `veloura-dine-in-status`

**Used by:** Almost everything — `CheckoutPage`, `OrderTrackingPage`, `OrderHistoryPage`, `Navbar`, `CartDrawer`, `NewOrderToast`, `AdminDashboard`, `AdminOrders`, `AdminOrderDetail`, `AdminKitchen`, `AdminAnalytics`, `AdminMenuManagement`, `AdminNotifDrawer`

---

### 5.4 AdminAuthContext (`src/contexts/AdminAuthContext.jsx`)

**Purpose:** Simple demo authentication for admin staff. No Supabase involved — credentials are hardcoded. Session stored in `sessionStorage` (clears on tab close).

**Hardcoded credentials:**
```
admin    / veloura2026  → Manager  / Aryan Kapoor
kitchen  / kitchen123  → Kitchen  / Chef Rajan
cashier  / cashier123  → Cashier  / Meera Nair
```

**⚠️ Known inconsistency:** `AdminLogin.jsx` shows the hint text `admin / aura2024` — this is wrong. The correct password is `veloura2026`.

**State:** `admin` (object with username, role, name, loginAt — or null), `loginError`  
**Methods:** `login(username, password)` → boolean, `logout()`  
**sessionStorage key:** `veloura-admin`

**Used by:** `ProtectedRoute.jsx`, `AdminLayout.jsx`, `AdminLogin.jsx`

---

### 5.5 TransitionContext (`src/contexts/TransitionContext.jsx`)

**Purpose:** Coordinates the `LiquidTransition` SVG wipe animation with navigation callbacks.

**State:** `isTransitioning` (boolean), `onTransitionHalfway` (callback function)

**Method:** `startTransition(callback)` — sets `isTransitioning = true`, stores callback (fired at 700ms when screen is fully dark), auto-resets after 1500ms.

**Used by:** `Navbar.jsx`, `Hero.jsx`, `LiquidTransition.jsx`

---

### 5.6 Context Relationships

```
AdminAuthProvider (no deps)
  └── AuthProvider (depends on: supabase.js)
        └── OrderProvider (depends on: supabase.js, localStorage)
              └── TransitionProvider (no external deps)
                    └── CartProvider (depends on: localStorage)
                          └── All components
```

Contexts are **independent** — none import or read from each other. Their only connection is that `OrderContext.placeOrder` is called from `CheckoutPage` which also reads `CartContext`. The cart is cleared (`clearCart()`) after `placeOrder` succeeds.

---
## 6. COMPONENT ARCHITECTURE

### 6.1 Global Persistent Components (mounted at Router root, never unmount)

| Component | Z-Index | Purpose |
|---|---|---|
| `MagneticCursor` | 2147483647 | Custom gold cursor — replaces native pointer on all pages |

### 6.2 CustomerShell Persistent Components (mounted with customer routes)

| Component | Z-Index | Purpose |
|---|---|---|
| `Navbar` | 50 | Fixed top bar — audio, cart, auth links, order mode indicator |
| `FloatingParticles` | 0 (fixed) | Background ambient gold dust + SVG coffee beans, parallax |
| `LiquidTransition` | 9990 | SVG espresso wipe — only renders when `isTransitioning = true` |
| `CartDrawer` | 9975 | Right-side slide-in cart panel |
| `NewOrderToast` | 9990 | Confirmation toast after order placed (adminMode=false) |

### 6.3 Homepage Section Components (rendered at `/` only)

Composed sequentially in `CustomerShell`:

```
Hero               ← Full-screen: canvas 3D coffee cup + bg parallax + CTA buttons
TrustSection       ← Quality/trust badge row
HowItWorks         ← 3-step ordering explainer (Scan → Order → Enjoy)
TryTableOrderingBanner ← QR dine-in promotional banner with CTA
Menu               ← "Our Curation" heading + CategoryIcons
VelouraExperience  ← Premium experience marketing section
WhyGuestsLoveVeloura ← Social proof / star ratings section
GuestFavorites     ← Curated top items showcase
Locations          ← 3 physical location cards (local .webp images)
ReservationContact ← Table reservation enquiry form
Footer             ← Links, social, copyright
```

### 6.4 Reusable UI Components

**`ImageWithFallback`** — Drop-in `<img>` replacement used in all menu/order contexts.
```
Props: src, alt, fallbackSrc (default: fallback-coffee.webp), className,
       wrapperClassName, loading ('lazy'), showSkeleton (true)
States: loading → loaded → [fallback if error] → [dead tile if fallback also fails]
Output: skeleton shimmer → image → "Image Coming Soon" tile (last resort)
```

**`MenuCard`** — Self-contained menu item card.
```
Props: item (full menuData item object), onOpenModal (callback)
Internals: qty useState, addedPulse animation state
Emits: addItem() to CartContext, openDrawer() to CartContext, onOpenModal(item)
```

**`ProductModal`** — Full item detail overlay (AnimatePresence).
```
Props: item, onClose
Features: hero image, ingredients tags, nutrition grid, qty selector
Locks body scroll on open
```

**`StatusBadge`** — Admin order status pill.
```
Props: status (ORDER_STATUS value), size ('sm' | 'lg')
Output: colored dot + label from statusStyles.js map
```

**`AutoSequence`** — Canvas-based frame sequence player.
```
Props: folderPath, frameCount, frameDuration, className, onLoad, loop
Behavior: preloads all frames → requestAnimationFrame loop → drawImageScaled (cover)
Used by: Hero.jsx (2 instances — cup + background)
```

**`useMagnet` hook** — Magnetic button attraction.
```
Returns: { ref, style: {x, y} (motion values), onMouseLeave }
Side effects: dispatches 'magnetic-active' / 'magnetic-inactive' CustomEvents
              which MagneticCursor listens to for lerp attraction
```

### 6.5 Admin Components

**`AdminLayout`** — Two-panel shell wrapping all admin pages via `<Outlet>`.
```
Left: collapsible sidebar (68px collapsed / 220px expanded, spring animated)
      Mobile: slide-in drawer with AnimatePresence
      Nav items: Dashboard, Live Orders, Tables (⚠️ route missing), Analytics, Menu, Kitchen
Top: animated "Live" dot, notification bell with badge, admin avatar + name
```

**`AdminNotifDrawer`** — Right-side notification history panel.
```
Source: OrderContext.notifications[]
Behavior: click → markNotifRead + navigate to /admin/order/:id
```

**`NewOrderToast`** — Fires when orders.length increases (detects new order).
```
Props: adminMode (boolean)
adminMode=false: customer confirmation toast
adminMode=true: admin alert toast with "Click to view →" navigation
Duration: 6s with animated progress bar countdown
```

---

## 7. CUSTOMER FLOW

### 7.1 Homepage (`/`)

```
User lands on /
  → Hero section: 3D coffee cup animation loads (136 WebP frames preloaded)
  → Background parallax animation loads (144 WebP frames)
  → 10 sections render sequentially with scroll-triggered Framer Motion animations
  → Navbar shows: cart badge (0), ordering mode indicator (default: Delivery)
  → "TryTableOrderingBanner" section prompts QR scanning
  → "Menu" section: 8 circular category icons rendered from CATEGORY_LIST
```

### 7.2 Browsing Menu

```
User clicks a category icon (e.g. "Coffee")
  → CategoryIcons calls useNavigate() → navigates to /menu/coffee
  → CategoryPage loads:
      - Reads slug from useParams()
      - Finds category in CATEGORY_LIST by slug
      - Reads items from MENU_DATA[categoryName]
      - Renders: banner image (ImageWithFallback, eager load)
      - Sticky category pill row for quick switching between categories
      - Grid of MenuCard components (stagger animation, spring entrance)
  
User clicks a MenuCard image/body:
  → onOpenModal(item) → setSelectedItem(item)
  → ProductModal renders with AnimatePresence
  → Shows: large image, full description, ingredients, nutrition, qty selector

User clicks "Add to Cart" (on MenuCard or ProductModal):
  → addItem() dispatched to CartContext
  → ItemCount badge on Navbar animates +1
  → Pulse animation on button

User clicks "Order Now" (on MenuCard or ProductModal):
  → addItem() dispatched
  → openDrawer() dispatched → CartDrawer slides in
```

### 7.3 Cart

```
CartDrawer (z-9975) slides in from right:
  → Lists all items with ImageWithFallback thumbnails
  → Qty stepper: updateQty() per item
  → Delete: removeItem() per item
  → Footer: Subtotal / GST 5% / Grand Total
  → "Proceed to Checkout" → navigate('/checkout') + closeDrawer()
```

### 7.4 Checkout (`/checkout`)

```
Page reads from CartContext: items, subtotal, gst, grandTotal
Page reads from OrderContext: orderType, tableNumber

Mode-aware form rendering:
  Dine In:  Table number field (pre-filled from QR), no address fields
  Takeaway: Name + phone only, no address
  Delivery: Full form — name, phone, email, address, city, PIN

User fills form → clicks "Place Order · ₹XXXX" button:
  → setPlacing(true) → spinner shows
  → await placeOrder({ customerName, phone, email, address, tableNumber,
                        items, subtotal, gst, total, notes, orderType })
  → If Supabase ready: saveOrderToSupabase() → gets back { id, order_number }
  → If offline: generates ORD-XXXX with local counter
  → setPlacedOrder(order) → setOrderPlaced(true) → clearCart()

Success screen shows:
  → Animated checkmark
  → Order number #XXXX
  → "Track Order" button → navigate('/track/' + placedOrder.id)
  → "Back to Menu" button
```

### 7.5 Order Tracking (`/track/:orderId`)

```
Page mounts with orderId from URL params

Initial load:
  → getOrder(orderId) from OrderContext (fast path if order is in state)
  → If not found and Supabase ready: fetch from DB
  → If not found and offline: show "Order not found" state

Realtime subscription (Supabase only):
  → supabase.channel('order-' + orderId)
  → Listens for UPDATE on orders WHERE id = orderId
  → On update: re-fetches full order + items → setOrder(normalizeOrder(data))

5-step animated timeline:
  Pending → Confirmed → Preparing → Ready → Delivered
  Done steps: filled colored circle with checkmark
  Active step: pulsing border, "Current" badge
  Future steps: empty grey circle
  Connector lines fill with color as steps complete

Also shows: ETA label, items summary, delivery details, order notes
```

### 7.6 Order History (`/orders/history`)

```
If logged in (Supabase) + Supabase ready:
  → fetchOrdersByEmail(user.email) → remote orders
If not logged in or offline:
  → Shows seed/demo orders from OrderContext with "Showing demo orders" notice

Order cards: expandable accordion
  Header: order number, date, status badge, total
  Expanded: item thumbnails (ImageWithFallback), subtotal, GST, total
  CTAs: "Track" (if active) → /track/:id, "Reorder" → /menu/starters

Filter pills: All / Pending / Preparing / Ready / Completed / Cancelled
```

### 7.7 Authentication Flow

```
Signup (/signup):
  → Client validation: name required, email format, password ≥ 6 chars, confirm match
  → supabase.auth.signUp({ email, password, options: { data: { full_name, phone } } })
  → On success: shows "Check your email" screen (email confirmation required)

Login (/login):
  → supabase.auth.signInWithPassword({ email, password })
  → On success: navigates to 'from' location (preserved via location.state.from)
                or defaults to '/'
  → Navbar updates: shows user avatar, dropdown with "My Orders" + "Sign Out"

Session persistence:
  → supabase.auth.getSession() on mount restores session from Supabase's own localStorage
  → onAuthStateChange handles refresh token rotation automatically
```

---

## 8. ADMIN FLOW

### 8.1 Admin Login (`/admin/login`)

```
Form: username + password fields
Demo credentials (hardcoded in AdminAuthContext):
  admin    / veloura2026  (Manager)
  kitchen  / kitchen123  (Kitchen)
  cashier  / cashier123  (Cashier)

⚠️ The login page shows "Try: admin / aura2024" — THIS IS WRONG.
   Correct password is veloura2026. Fix needed in AdminLogin.jsx.

On success: navigate('/admin/dashboard')
Session: stored in sessionStorage as 'veloura-admin' (clears on tab close)
```

### 8.2 Admin Dashboard (`/admin/dashboard`)

```
Animated count-up StatCard grid (6 cards):
  Today's Revenue (₹) | Today's Orders | Pending (urgent) |
  Completed Today | Avg Order Value | Top Item count

All computed from OrderContext helpers:
  getTodayOrders(), getTodayRevenue(), getOrdersByStatus()

Recent Orders table (last 6, sorted newest-first):
  Order# | Customer | Items | Total | Status badge | Time ago | → link

Status breakdown row (6 clickable tiles → /admin/orders?status=X):
  One tile per ORDER_STATUS showing count
```

### 8.3 Live Orders Board (`/admin/orders`)

```
Toggle: "Board" (Kanban) | "List" view

Kanban view — 4 columns:
  Pending | Confirmed | Preparing | Ready
  Each column: color-coded border, item count badge
  OrderCards: sorted oldest-first within column (FIFO queue)

OrderCard shows:
  Order#, table badge (if dine-in), customer name, phone,
  items list (title + qty), notes (orange italic), total,
  time ago, "→ details" icon link
  Next-status button (→ Confirmed / → Preparing / etc.)
  Cancel button (red text, subtle)

New order pulse: orders created < 90s ago get amber glow border + pulsing dot

List view:
  Search by name or order number
  Filter by status + order type + table
  Completed/Cancelled section below active orders
```

### 8.4 Order Detail (`/admin/order/:id`)

```
Status timeline: numbered steps, green fill for done, amber for active
Customer card: name, phone, address, table, notes
Items card: thumbnails, prices, quantities, totals

Action buttons (context-aware):
  Accept Order (Pending → Confirmed)  [blue gradient]
  Start Preparing (Confirmed → Preparing)  [orange gradient]
  Mark Ready (Preparing → Ready)  [emerald gradient]
  Mark Completed (Ready → Completed)  [stone gradient]
  Cancel Order  [red border]
  Manual status dropdown (any → any, for corrections)

All actions call updateStatus(id, status) → optimistic local + Supabase async
```

### 8.5 Kitchen Display System (`/admin/kitchen`)

```
Full-screen dark mode (bg-[#090806])
Large readable cards (designed for wall-mounted tablets)

Filter tabs: Prep Queue | Ready | All Active
Priority sort: Preparing first → Confirmed → Pending → Ready

KitchenCard shows:
  Order# (large monospace, 4xl)
  Customer name, table badge
  Status badge (animated dot for Preparing)
  Items list (xl font, ×qty in large colored number)
  Notes in orange warning box
  Elapsed timer (live 1s interval) — red "LATE" badge after 10 minutes
  Next-status advance button (color matches status)

Status legend bar: fixed bottom of screen
```

### 8.6 Analytics (`/admin/analytics`)

```
All data sourced from OrderContext.orders[] — no separate Supabase analytics query.
Charts built with Recharts library (v3).

Charts rendered:
  Weekly Revenue — AreaChart (7 days, amber gradient fill)
  Today Hourly Orders — BarChart (8am–10pm buckets, orange bars)
  Category Breakdown — PieChart inner donut (8 segments, colored)
  Top 8 Items — Horizontal BarChart (by quantity sold)
  Order Status Distribution — PieChart with legend

Summary cards: Total Revenue | Total Orders | Avg Order Value | Completion Rate %
```

### 8.7 Menu Management (`/admin/menu-management`)

```
Loads all MENU_DATA items into LOCAL React state on mount (not Supabase).
Changes do NOT persist to DB — menu edits are session-only.

Category pill filter + search input
Item grid cards: image, title, price, category tag, veg indicator
  Availability toggle: "Live" (emerald) / "Off" (red) — immediate local state
  Edit button: opens ItemFormModal pre-filled
  Delete: opens confirmation modal

ItemFormModal:
  Fields: name, price, category, prep time, rating, description, image URL
  Availability + Veg/Non-Veg toggle switches
  Image URL preview below form
  Save → dispatches updateMenuItem/addMenuItem to OrderContext (local mirror)
```

### 8.8 Admin Notification System

```
Bell icon in topbar → toggles AdminNotifDrawer
Badge count: OrderContext.unreadCount (starts at 3 from seed data)

AdminNotifDrawer:
  Lists all notifications newest-first
  Unread: animated amber pulsing dot, amber background tint
  Click: markNotifRead(id) + navigate to /admin/order/:id
  "Mark all read" button

NewOrderToast (adminMode=true):
  Fires whenever orders.length increases (new order arrives via Realtime)
  Top-right glassmorphism card, 6s auto-dismiss
  Click navigates to /admin/order/:id
  Bell sound: Web Audio API triple tone (880/1100/1320 Hz)
```

---

## 9. QR ORDERING SYSTEM

### 9.1 Overview

The QR system turns any table at Veloura into a self-service ordering kiosk. Each table gets a unique QR code that encodes its table number. Scanning opens the full customer website pre-configured for Dine In.

### 9.2 QR Code Generation

QR codes are **not auto-generated by the app** — they must be generated manually (any QR generator tool) pointing to:

```
https://yourdomain.com/table/1     ← Table 1
https://yourdomain.com/table/2     ← Table 2
https://yourdomain.com/table/12    ← Table 12
```

Print and laminate these QR codes, place on tables. No server-side setup needed.

### 9.3 Table Route Handler (`/table/:tableNum`)

```jsx
// TableRouteHandler.jsx behaviour:
const { tableNum } = useParams();
setTableNumber(tableNum);       // → OrderContext (persists localStorage)
setOrderType('Dine In');        // → OrderContext (persists localStorage)
navigate('/');                  // → redirect to homepage
```

After redirect, `OrderContext.orderType = 'Dine In'` and `tableNumber = "X"`.

### 9.4 Dine-In Flow (after QR scan)

```
Customer scans QR → /table/5 → TableRouteHandler
  ↓ Sets orderType = 'Dine In', tableNumber = '5'
  ↓ Redirects to /

Homepage renders with Dine-In mode active:
  → Navbar shows: "Dine In · T-5" indicator
  → TryTableOrderingBanner may be hidden (already dine-in)

Customer browses menu → adds to cart → /checkout

CheckoutPage (Dine In mode):
  → Hides: address, city, PIN code fields
  → Shows: "Table 5" pre-filled, non-editable
  → Form fields: Name, Phone, Special Notes only
  → CTA: "Place Order for Table 5 · ₹XXX"

Order placed:
  → orderType: 'Dine In', tableNumber: '5' sent to Supabase
  → Admin sees table badge "T-5" on order cards
  → Kitchen sees large "T-5" badge
  → Customer sees tracking page with "Serving In" timeline labels
```

### 9.5 Takeaway Flow

```
Customer visits site directly (no QR), or clicks "Takeaway" in modal:
  → Opens OrderingModeSelectorModal
  → Selects "Takeaway"
  → setOrderType('Takeaway')

CheckoutPage (Takeaway mode):
  → Hides: address, table fields
  → Shows: pickup time estimate
  → Fields: Name, Phone only

Admin sees: "Takeaway" badge on order (no table number)
```

### 9.6 Delivery Flow

```
Default mode (no QR, no explicit selection = 'Delivery')

CheckoutPage (Delivery mode):
  → Shows: full address form (address, city, PIN code)
  → Fields: Name, Phone, Email, Address, City, PIN, Notes

Admin sees: address in order detail
```

### 9.7 Mode Persistence

The ordering mode persists in `localStorage` across sessions:
```
veloura-order-type    → 'Dine In' | 'Takeaway' | 'Delivery'
veloura-table-number  → '1' ... '99' (or empty string)
```

If a customer scans a QR at table 5, browses, leaves, and returns — they are still in Dine In mode for table 5 until they change it or clear storage.

### 9.8 Mode Selector Modal (`OrderingModeSelectorModal`)

```
Accessible via Navbar order mode indicator button
Options: Dine In (table input) | Takeaway | Delivery
Dine In option shows: table number text input
Confirm → setOrderType + setTableNumber + close modal
```

### 9.9 Admin Table Management (`/admin/tables`)

```
⚠️ AdminTables.jsx exists but is NOT registered as a route in App.jsx.
The sidebar nav shows "Tables" but clicking it navigates to /admin/tables
which falls through to the customer shell catch-all.

To fix: add <Route path="tables" element={<AdminTables />} />
inside the /admin nested Route in App.jsx.
```

---
## 10. DATABASE ARCHITECTURE

### 10.1 Setup

Run `supabase/schema.sql` **once** in the Supabase SQL Editor at https://app.supabase.com → SQL Editor → New Query → Paste → Run. The schema is idempotent (`IF NOT EXISTS`, `OR REPLACE`, `DROP POLICY IF EXISTS`).

### 10.2 Tables

#### `orders`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, default `uuid_generate_v4()` | Supabase-generated UUID |
| `order_number` | `bigint` | GENERATED ALWAYS AS IDENTITY | Auto-incrementing display number (1, 2, 3…) |
| `user_id` | `uuid` | FK → `auth.users(id)` ON DELETE SET NULL, nullable | NULL for guest orders |
| `customer_name` | `text` | NOT NULL | Customer full name |
| `phone` | `text` | nullable | Customer phone |
| `email` | `text` | nullable | Used to link guest orders to accounts |
| `address` | `text` | nullable | Delivery address (null for Dine In / Takeaway) |
| `table_number` | `text` | nullable | Table number string (null unless Dine In) |
| `subtotal` | `integer` | NOT NULL | Amount in ₹ (integer, no paise) |
| `gst` | `integer` | NOT NULL | 5% of subtotal, rounded |
| `total` | `integer` | NOT NULL | subtotal + gst |
| `status` | `text` | NOT NULL, default `'Pending'`, CHECK IN (...) | Pending/Confirmed/Preparing/Ready/Completed/Cancelled |
| `notes` | `text` | nullable | Customer special instructions |
| `order_type` | `text` | default `'Delivery'`, CHECK IN (...) | `'Dine In'` / `'Takeaway'` / `'Delivery'` |
| `waiter_notes` | `text` | nullable | Internal staff notes |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Order placement timestamp |
| `updated_at` | `timestamptz` | nullable | Set on status change |

#### `order_items`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, default `uuid_generate_v4()` | |
| `order_id` | `uuid` | NOT NULL, FK → `orders(id)` ON DELETE CASCADE | Cascade delete when order deleted |
| `item_id` | `text` | NOT NULL | Matches `id` field in `menuData.js` |
| `title` | `text` | NOT NULL | Snapshot of item name at order time |
| `price` | `integer` | NOT NULL | Snapshot of item price at order time |
| `quantity` | `integer` | NOT NULL | Units ordered |
| `image` | `text` | nullable | Snapshot of image URL at order time |

### 10.3 Relationships

```
auth.users (Supabase managed)
    │ 1
    │ user_id (nullable FK)
    │ ∞
  orders
    │ 1
    │ order_id (FK, CASCADE)
    │ ∞
  order_items
```

One order → many order_items. Each order_item belongs to exactly one order.

### 10.4 Indexes

```sql
idx_orders_status      ON orders(status)          -- Filter by status (admin board)
idx_orders_user_id     ON orders(user_id)          -- Fetch user's orders
idx_orders_email       ON orders(email)            -- Fetch guest orders by email
idx_orders_created     ON orders(created_at DESC)  -- Newest-first sorting
idx_order_items_order  ON order_items(order_id)    -- Join performance
```

### 10.5 Row Level Security (RLS)

All RLS is enabled. Policies:

| Policy | Table | Operation | Condition |
|---|---|---|---|
| `orders_insert_anyone` | orders | INSERT | `true` (anyone can place an order) |
| `order_items_insert_anyone` | order_items | INSERT | `true` |
| `orders_select_own` | orders | SELECT | `user_id = auth.uid()` OR `email = auth.users.email` OR `auth.uid() IS NULL` |
| `order_items_select_own` | order_items | SELECT | `order_id IN (SELECT id FROM orders WHERE [above conditions])` |
| `orders_update_own` | orders | UPDATE | `user_id = auth.uid()` OR `email = auth.users.email` |

> **Admin dashboard note:** The admin portal uses the **anon key** from the browser. The `orders_select_own` policy allows `auth.uid() IS NULL` (anon reads), so the admin dashboard CAN read all orders with the current schema. For production security, switch admin operations to a server-side Edge Function using the `service_role` key.

### 10.6 Realtime Configuration

```sql
alter publication supabase_realtime add table orders;
```

This adds `orders` to Supabase's built-in replication publication. The frontend subscribes via:

```js
supabase.channel('orders-live')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, ...)
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, ...)
  .subscribe()
```

`order_items` is **not** in the realtime publication — item details are fetched via a separate query when an INSERT event fires.

### 10.7 Helper View

```sql
CREATE VIEW orders_with_items AS
  SELECT o.*, json_agg(json_build_object(
    'id', i.item_id, 'title', i.title,
    'price', i.price, 'quantity', i.quantity, 'image', i.image
  ) ORDER BY i.id) FILTER (WHERE i.id IS NOT NULL) AS items_json
  FROM orders o LEFT JOIN order_items i ON i.order_id = o.id
  GROUP BY o.id;
```

Not currently used by frontend queries (direct `.select('*, order_items(...)')` is used instead), but available for future reporting.

### 10.8 Supabase Auth Tables (managed by Supabase)

- `auth.users` — Supabase internal table. Email, encrypted password, user metadata.
- User metadata stored in `auth.users.raw_user_meta_data`: `{ full_name, phone }`
- No `public.profiles` table exists yet — profile field in `AuthContext` is reserved for future use.

---

## 11. LOCALSTORAGE ARCHITECTURE

All keys are prefixed `veloura-` to avoid collisions. The app works entirely offline using this storage when Supabase is not configured.

| Key | Set by | Read by | Content | Cleared when |
|---|---|---|---|---|
| `veloura-cart` | `CartContext` | `CartContext` | JSON array of `{id, title, price, image, isVeg, quantity}` | `clearCart()` after order placed |
| `veloura-orders` | `OrderContext` | `OrderContext` | JSON array of full order objects (offline mode only) | Never (accumulates) |
| `veloura-order-type` | `OrderContext` | `OrderContext` | `'Dine In'` / `'Takeaway'` / `'Delivery'` | Never (persists session) |
| `veloura-table-number` | `OrderContext` / `TableRouteHandler` | `OrderContext` / `CheckoutPage` | Table number string e.g. `"5"` | User changes mode or clears storage |
| `veloura-dine-in-status` | `OrderContext` | `OrderContext` / `AdminTables` | `'Available'` / `'Occupied'` / `'Reserved'` | Never (persists session) |
| `sb-*-auth-token` | Supabase client | Supabase client | JWT access + refresh token (Supabase manages key name) | `supabase.auth.signOut()` |

**Supabase auth tokens** are stored automatically by the Supabase client in localStorage (key name varies by project URL, format `sb-{project-ref}-auth-token`). These are managed entirely by Supabase — do not touch manually.

### 11.1 sessionStorage

| Key | Set by | Content | Cleared when |
|---|---|---|---|
| `veloura-admin` | `AdminAuthContext` | `{username, role, name, loginAt}` JSON | Browser tab closes, or `logout()` |

### 11.2 Fallback Behaviour

When `isSupabaseReady()` returns false (placeholder .env values):

1. `OrderContext` loads `SEED_ORDERS` (5 demo orders) from the hardcoded constant, or from `veloura-orders` if it exists.
2. Orders placed locally get IDs like `ORD-1024`, `ORD-1025`, etc.
3. All writes go to `veloura-orders` in localStorage.
4. `OrderTrackingPage` finds orders via `getOrder(id)` in context state — works for `ORD-XXXX` IDs.
5. `OrderHistoryPage` shows context orders with "Showing demo orders" notice.
6. Realtime channel is never opened — no WebSocket connection made.
7. Auth pages (`/login`, `/signup`) show the "Supabase not configured" warning banner and disable the submit button.

---

## 12. API & SERVICE LAYER

All Supabase interactions are centralised in `src/lib/supabase.js`. No component talks to Supabase directly — they all call these exported functions or the Supabase client for auth.

### 12.1 Supabase Client

```js
// src/lib/supabase.js
export const supabase = createClient(URL, ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
  realtime: { params: { eventsPerSecond: 10 } },
});
```

If `.env` keys are placeholders, the client is created with `'https://placeholder.supabase.co'` — all queries fail silently and the app falls back to offline mode.

### 12.2 `isSupabaseReady()`

```js
export const isSupabaseReady = () =>
  Boolean(VITE_SUPABASE_URL && VITE_SUPABASE_URL !== 'https://your-project.supabase.co');
```

Used as a guard in `AuthContext`, `OrderContext`, `OrderTrackingPage`, `OrderHistoryPage`, `LoginPage`, `SignupPage`. All Supabase calls are wrapped: `if (!isSupabaseReady()) return fallback;`

### 12.3 Order Functions

| Function | Signature | DB Operation | Returns |
|---|---|---|---|
| `saveOrderToSupabase` | `(orderData)` | INSERT into orders + order_items | saved order row `{id, order_number, created_at, ...}` |
| `updateOrderStatusInSupabase` | `(orderId, status)` | UPDATE orders SET status, updated_at | void (throws on error) |
| `fetchAllOrders` | `()` | SELECT orders + order_items, DESC created_at | `NormalizedOrder[]` |
| `fetchOrdersByEmail` | `(email)` | SELECT orders + order_items WHERE email = ?, DESC | `NormalizedOrder[]` |
| `normalizeOrder` | `(row)` | Pure transform | `NormalizedOrder` object |

### 12.4 `normalizeOrder(row)` — DB → App Shape

```js
// DB column names → camelCase internal names
{
  id, orderNumber, customerName, phone, email, address,
  tableNumber, subtotal, gst, total, status, notes,
  orderType, waiterNotes, createdAt, updatedAt,
  items: [{ id, title, price, quantity, image }]
}
```

Every `order_items` row maps `item_id` → `id` in the items array. This is the shape used everywhere in the app — context state, admin pages, tracking page, order history.

### 12.5 Authentication API

All auth flows use the Supabase JS client directly in `AuthContext`:

| Action | Supabase Call |
|---|---|
| Sign up | `supabase.auth.signUp({ email, password, options: { data: { full_name, phone } } })` |
| Sign in | `supabase.auth.signInWithPassword({ email, password })` |
| Sign out | `supabase.auth.signOut()` |
| Restore session | `supabase.auth.getSession()` (on mount) |
| Listen changes | `supabase.auth.onAuthStateChange(callback)` |

### 12.6 Realtime Subscriptions

Two subscriptions are opened by `OrderContext` when Supabase is ready:

```
Channel: 'orders-live'
  Event 1: postgres_changes INSERT on orders
    → Fetches full order with items (separate query)
    → dispatch ADD_ORDER
    → playOrderSound() (Web Audio API)

  Event 2: postgres_changes UPDATE on orders
    → dispatch UPDATE_STATUS (id, status from payload.new)
    → Deduped by reducer (if already same status, no visible change)
```

```
Channel: 'order-{orderId}' (per-order, opened by OrderTrackingPage)
  Event: postgres_changes UPDATE on orders WHERE id = orderId
    → Refetches full order + items
    → setOrder(normalizeOrder(data))
    → Updates timeline UI without refresh
```

### 12.7 External APIs

| Service | Purpose | URL pattern | Notes |
|---|---|---|---|
| Unsplash CDN | All menu item images | `images.unsplash.com/photo-*?w=800...` | External CDN — fallback triggers if down |
| Google Fonts CDN | Newsreader, Plus Jakarta Sans | `fonts.googleapis.com` | Loaded in index.html; app still renders if unavailable (fallback system fonts) |
| Material Symbols | All UI icons | `fonts.googleapis.com` (icon font) | If CDN fails, icons show as blank text |
| SoundHelix | Ambient audio track | `soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3` | Optional; audio fails silently |

### 12.8 `npm run image-audit`

A Node.js script (`scripts/image-audit.js`) scans `menuData.js` and reports duplicate URLs, missing local assets, and potential broken references.

```bash
npm run image-audit
# Reports: duplicate URLs, local path validity, URL count per category
```

---
## 13. BUILD & DEPLOYMENT

### 13.1 Environment Variables

Create a `.env` file in the project root. The file already exists with placeholder values — replace them.

```bash
# .env
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

| Variable | Where to find it | Required for |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL | All backend features |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon / public key | All backend features |

> The `VITE_` prefix is mandatory — Vite only exposes env vars with this prefix to the browser bundle. Never put the `service_role` key in `.env` — it would be exposed in the built JS.

The app runs fully without these values (offline/demo mode). Set them only when connecting to a real Supabase project.

### 13.2 Database Setup (one-time)

Before the first deployment:

1. Create a Supabase project at https://app.supabase.com
2. Copy Project URL and anon key into `.env`
3. Go to SQL Editor → New Query
4. Paste the entire contents of `supabase/schema.sql`
5. Click Run
6. Verify: Tables `orders` and `order_items` appear in the Table Editor
7. Verify: Realtime is enabled — go to Database → Replication → `supabase_realtime` publication shows `orders`

### 13.3 Local Development

```bash
# Install dependencies
npm install

# Start dev server (Vite HMR on http://localhost:5173)
npm run dev

# Run image audit (scans menuData.js for duplicate/missing images)
npm run image-audit

# Lint (ESLint with react-hooks rules)
npm run lint
```

### 13.4 Production Build

```bash
npm run build
# Output: dist/ folder
# Current output sizes:
#   index.html              ~1.2 kB
#   index.css               ~69 kB (gzip: ~11 kB)
#   vendor-react.js         ~50 kB (gzip: ~17 kB)   React + ReactDOM + React Router
#   vendor-motion.js        ~131 kB (gzip: ~43 kB)  Framer Motion
#   vendor-charts.js        ~358 kB (gzip: ~106 kB) Recharts
#   index.js                ~520 kB (gzip: ~140 kB) App code
```

The build uses manual Rollup chunking (`vite.config.js`) to split the bundle into 4 vendor chunks + app chunk for better long-term caching.

```bash
# Preview the production build locally
npm run preview
# Serves dist/ on http://localhost:4173
```

### 13.5 Deployment — Vercel (recommended)

```bash
# Option A: Vercel CLI
npm i -g vercel
vercel

# Option B: GitHub integration
# 1. Push to GitHub
# 2. Import project at https://vercel.com/new
# 3. Framework: Vite (auto-detected)
# 4. Build command: npm run build  (auto-detected)
# 5. Output directory: dist  (auto-detected)
# 6. Add environment variables in Vercel Dashboard:
#    VITE_SUPABASE_URL = your-url
#    VITE_SUPABASE_ANON_KEY = your-anon-key
# 7. Deploy
```

Vercel handles SPA routing automatically — all paths serve `index.html`.

### 13.6 Deployment — Netlify

```bash
# 1. Build command:  npm run build
# 2. Publish directory: dist
# 3. Add env vars in Netlify → Site Settings → Environment Variables
# 4. Create dist/_redirects file for SPA routing:
echo "/*    /index.html    200" > dist/_redirects
# Or add a netlify.toml:
```

```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 13.7 Deployment — Render (Static Site)

```
Build Command:  npm run build
Publish Directory: dist
Environment Variables: add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
Rewrite rule: /* → /index.html (200)
```

### 13.8 Production Checklist

- [ ] Replace `.env` placeholder values with real Supabase credentials
- [ ] Run `supabase/schema.sql` in Supabase SQL Editor
- [ ] Verify Supabase Realtime is enabled for the `orders` table
- [ ] Set environment variables on the hosting provider
- [ ] Run `npm run build` locally — confirm zero errors, exit code 0
- [ ] Run `npm run image-audit` — confirm zero broken/duplicate image URLs
- [ ] Test QR flow: visit `/table/1` on deployed URL, confirm redirect + mode set
- [ ] Test admin login with `admin / veloura2026`
- [ ] Test customer order flow end-to-end in two windows (customer + admin)
- [ ] Confirm realtime: place order in customer window → appears in admin without refresh
- [ ] Update `AdminLogin.jsx` demo hint from `aura2024` to `veloura2026`
- [ ] Add `/admin/tables` route in `App.jsx` (currently missing)
- [ ] (Optional) Set up Supabase Email SMTP for auth confirmation emails
- [ ] (Optional) Configure custom domain on Supabase Auth settings

### 13.9 `index.html` Title

The `<title>` tag still reads `Aura Cafe | Signature Blend`. Update to `Veloura Café` for production.

---

## 14. DEPENDENCY LIST

### 14.1 Production Dependencies

| Package | Version | Purpose | Used in |
|---|---|---|---|
| `react` | ^19.2.4 | Core UI framework | Everything |
| `react-dom` | ^19.2.4 | DOM renderer | `main.jsx` |
| `react-router-dom` | ^7.13.2 | Client-side routing, nested routes, `useParams`, `useNavigate`, `useLocation` | `App.jsx`, all pages |
| `framer-motion` | ^12.38.0 | Animations: `motion.*`, `AnimatePresence`, `useSpring`, `useMotionValue`, `useScroll` | Most components |
| `@supabase/supabase-js` | ^2.49.9 | PostgreSQL DB, Auth, Realtime subscriptions | `supabase.js`, `AuthContext`, `OrderContext` |
| `recharts` | ^3.0.2 | Charts: `AreaChart`, `BarChart`, `PieChart`, `Cell`, `Tooltip`, `Legend` | `AdminAnalytics.jsx` |
| `lucide-react` | ^1.6.0 | SVG icon components (supplementary to Material Symbols) | Scattered usage |
| `react-parallax-tilt` | ^1.7.320 | 3D mouse-tilt effect | `FoodCard.jsx` (legacy, not in main flow) |
| `@splinetool/react-spline` | ^4.1.0 | 3D Spline scene embedding | **Installed but unused** — safe to remove |

### 14.2 Development Dependencies

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^5.4.11 | Build tool, dev server, HMR, bundle optimisation |
| `@vitejs/plugin-react` | ^4.3.4 | Vite plugin for React JSX + Fast Refresh |
| `tailwindcss` | ^3.4.15 | Utility-first CSS framework |
| `postcss` | ^8.4.49 | CSS transformation pipeline |
| `autoprefixer` | ^10.4.20 | Automatically adds vendor prefixes to CSS |
| `eslint` | ^9.39.4 | JavaScript linter |
| `@eslint/js` | ^9.39.4 | ESLint core JS rules |
| `eslint-plugin-react-hooks` | ^7.0.1 | Enforces Rules of Hooks (`react-hooks/exhaustive-deps`, etc.) |
| `eslint-plugin-react-refresh` | ^0.5.2 | Ensures Fast Refresh compatibility |
| `globals` | ^17.4.0 | Global variable definitions for ESLint browser/node environments |
| `@types/react` | ^19.2.14 | TypeScript types for React (used by IDE even in JS projects) |
| `@types/react-dom` | ^19.2.3 | TypeScript types for ReactDOM |

### 14.3 Font & Icon CDN (loaded in `index.html`)

| Resource | URL | Purpose |
|---|---|---|
| Newsreader | Google Fonts | `font-headline` class — headings, italic display text |
| Plus Jakarta Sans | Google Fonts | `font-body` / `font-label` — body copy, labels, buttons |
| Material Symbols Outlined | Google Fonts (icon font) | All `<span class="material-symbols-outlined">` icons |

CDN resources are loaded at runtime — not bundled. If offline or blocked, icons show as text characters, fonts fall back to system serif/sans-serif.

### 14.4 Chunk Sizes (production build)

```
vendor-react  (react + react-dom + react-router-dom)   ~50 kB gzipped
vendor-motion (framer-motion)                           ~43 kB gzipped
vendor-charts (recharts)                               ~106 kB gzipped  ← largest
vendor-ui     (lucide-react + react-parallax-tilt)      ~0.1 kB gzipped
index         (all app code)                           ~140 kB gzipped
index.css     (Tailwind purged)                         ~11 kB gzipped
```

The recharts chunk is large because the full library is imported. If analytics are removed, this chunk disappears entirely and total bundle drops by ~106 kB gzipped.

---

## 15. KNOWN ISSUES & LIMITATIONS

### 15.1 Bugs (require fixing before production)

| # | Severity | Location | Description | Fix |
|---|---|---|---|---|
| 1 | 🔴 High | `AdminLogin.jsx` | Demo hint shows `admin / aura2024` but actual password in `AdminAuthContext` is `veloura2026` | Update the hint text in `AdminLogin.jsx` |
| 2 | 🔴 High | `App.jsx` | `/admin/tables` route is missing — `AdminTables.jsx` exists but clicking "Tables" in the sidebar navigates to the customer catch-all | Add `<Route path="tables" element={<AdminTables />} />` inside the admin nested Route |
| 3 | 🟡 Medium | `index.html` | Page `<title>` still reads `Aura Cafe | Signature Blend` | Update to `Veloura Café | Premium Restaurant` |
| 4 | 🟡 Medium | `AdminMenuManagement.jsx` | Menu edits are session-only (local React state). Changes do not persist to Supabase or `menuData.js` — cleared on page refresh | Wire to Supabase `menu_items` table, or persist to localStorage |
| 5 | 🟡 Medium | `AdminAuthContext.jsx` | Admin auth uses hardcoded credentials. Any developer with codebase access knows the passwords | Replace with Supabase Admin roles or a server-side session check |
| 6 | 🟡 Medium | `OrderContext` | The `menuItems[]` state in OrderContext is unused in the current Supabase flow — it mirrors local menu management state only | Either wire to Supabase or remove from context if not needed |
| 7 | 🟢 Low | `CartContext` | GST is `Math.round(subtotal * 0.05)` — can cause ₹1 discrepancy between cart display and checkout display for certain amounts | Use consistent rounding or floor throughout |
| 8 | 🟢 Low | `FloatingParticles.jsx`, `AdminLogin.jsx`, `AdminKitchen.jsx` | ESLint `react-hooks/purity` warnings for `Math.random()` / `Date.now()` in render. Does not affect runtime behaviour | Move random values into `useMemo` with stable seed |

### 15.2 Missing Features (incomplete work)

| Feature | Status | Notes |
|---|---|---|
| Razorpay / Payment Gateway | ❌ Not started | Architecture planned. Requires Supabase Edge Function for signature verification |
| Table Reservation System | ❌ Not started | `ReservationContact.jsx` renders a form UI only — no backend |
| `AdminTables.jsx` routing | ❌ File exists, not routed | Route missing in `App.jsx` |
| Admin role-based access control | ❌ Not implemented | All admin roles see all pages — no per-role restrictions enforced |
| Push Notifications | ❌ Not started | Web Push API / Supabase + service worker needed |
| PWA / Offline Support | ❌ Not started | `vite-plugin-pwa` not installed |
| QR Code Generation UI | ❌ Not implemented | QR codes must be generated externally. No admin QR generator page |
| `public.profiles` table | ❌ Not created | `AuthContext.profile` is always null — reserved for future use |
| Menu persistence | ❌ Session-only | Admin menu edits reset on refresh |
| Email SMTP for Auth | ⚠️ Depends on Supabase config | Supabase sends confirmation emails via default SMTP — configure custom SMTP for production |

### 15.3 Performance Limitations

- **280 WebP frames** in `/public/frames/` (136) and `/public/bg-frames/` (144) are loaded as `new Image()` preloads on Hero component mount. On slow connections, the hero shows a loading spinner until all frames are ready. No lazy loading or progressive loading implemented for frames.
- **Recharts** is ~106 kB gzipped. If analytics are not needed, remove the package and `AdminAnalytics.jsx` to significantly reduce bundle.
- **`@splinetool/react-spline`** (installed, unused) adds dependency weight — safe to uninstall with `npm uninstall @splinetool/react-spline`.
- No **image CDN / resizing** — all menu images are hotlinked from Unsplash at 800px width. No WebP conversion pipeline exists for dynamically-uploaded images.

### 15.4 Security Notes

- The **anon key** is exposed in the browser bundle — this is by design for Supabase. RLS policies protect the data; the anon key alone cannot bypass RLS.
- The **admin portal has no server-side auth** — only a client-side sessionStorage check. Someone with DevTools can bypass `ProtectedRoute` by setting `sessionStorage['veloura-admin']` manually. Acceptable for demo; not production-grade.
- No **CSRF protection** (not applicable for SPA + Supabase JWT auth).
- No **rate limiting** on order placement — a malicious user could flood the orders table.

---

## 16. FILE CONNECTIVITY MAP

### 16.1 Context Usage Map

Which components consume each context:

```
AuthContext (useAuth)
├── Navbar.jsx              — shows login/signup links or user avatar dropdown
├── LoginPage.jsx           — signIn(), authError, isLoggedIn
├── SignupPage.jsx          — signUp(), authError, isLoggedIn
└── OrderHistoryPage.jsx    — user.email for Supabase fetch, isLoggedIn for notice

CartContext (useCart)
├── Navbar.jsx              — itemCount badge, openDrawer()
├── MenuCard.jsx            — addItem(), openDrawer()
├── ProductModal.jsx        — addItem(), openDrawer()
├── CartDrawer.jsx          — items, updateQty(), removeItem(), subtotal, gst, grandTotal, closeDrawer()
└── CheckoutPage.jsx        — items, subtotal, gst, grandTotal, itemCount, clearCart(), updateQty(), removeItem()

OrderContext (useOrders)
├── CheckoutPage.jsx        — placeOrder(), orderType, tableNumber
├── OrderTrackingPage.jsx   — getOrder()
├── OrderHistoryPage.jsx    — orders (fallback)
├── Navbar.jsx              — orderType, tableNumber, modeSelectorOpen, setModeSelectorOpen
├── CartDrawer.jsx          — (indirect via CheckoutPage link)
├── NewOrderToast.jsx       — orders (watches length)
├── AdminDashboard.jsx      — orders, getOrdersByStatus(), getTodayOrders(), getTodayRevenue()
├── AdminOrders.jsx         — orders, getOrdersByStatus(), updateStatus()
├── AdminOrderDetail.jsx    — orders (find by id), updateStatus()
├── AdminKitchen.jsx        — orders, updateStatus()
├── AdminAnalytics.jsx      — orders (all analytics computed here)
├── AdminMenuManagement.jsx — addMenuItem(), updateMenuItem(), deleteMenuItem()
└── AdminNotifDrawer.jsx    — notifications, unreadCount, markNotifRead(), closeNotifDrawer()

AdminAuthContext (useAdminAuth)
├── ProtectedRoute.jsx      — admin (null check)
├── AdminLayout.jsx         — admin (name, role display), logout()
└── AdminLogin.jsx          — login(), loginError

TransitionContext (useTransition)
├── Navbar.jsx              — startTransition()
├── Hero.jsx                — startTransition()
└── LiquidTransition.jsx    — isTransitioning, onTransitionHalfway
```

### 16.2 Page → Component Map

```
/ (Homepage, CustomerShell)
├── Navbar
├── Hero
│   └── AutoSequence (cup frames: /frames/)
│   └── AutoSequence (bg frames: /bg-frames/)
├── TrustSection
├── HowItWorks
├── TryTableOrderingBanner
├── Menu
│   └── CategoryIcons  →  navigate('/menu/:slug')
├── VelouraExperience
├── WhyGuestsLoveVeloura
├── GuestFavorites
│   └── [MenuCard items]
│       └── ImageWithFallback
├── Locations
│   └── ImageWithFallback (local .webp assets)
├── ReservationContact
└── Footer

/menu/:slug (CategoryPage)
├── Navbar
├── ImageWithFallback  (banner)
├── [MenuCard × N]
│   └── ImageWithFallback
│   └── ProductModal (on click)
│       └── ImageWithFallback
└── Footer

/checkout (CheckoutPage)
└── Navbar

/track/:orderId (OrderTrackingPage)
└── Navbar (+ ImageWithFallback for item thumbnails)

/orders/history (OrderHistoryPage)
├── Navbar
└── ImageWithFallback (item thumbnails)

/login (LoginPage)
/signup (SignupPage)
/table/:tableNum (TableRouteHandler → redirect)

/admin/* (AdminLayout + Outlet)
├── AdminLayout
│   ├── SidebarContent (static sub-component)
│   └── AdminNotifDrawer
├── AdminDashboard
│   └── StatusBadge
├── AdminOrders
│   └── StatusBadge
├── AdminOrderDetail
│   └── StatusBadge
│   └── ImageWithFallback (item thumbnails)
├── AdminKitchen
├── AdminAnalytics
│   └── [Recharts components]
└── AdminMenuManagement
    └── ImageWithFallback (item grid + preview)
```

### 16.3 Key Import Chains

```
App.jsx
  imports ALL contexts, ALL pages, ALL admin pages
  → renders CustomerShell (customer routes) or AdminLayout (admin routes)

supabase.js
  ← imported by: AuthContext, OrderContext, OrderTrackingPage, OrderHistoryPage

menuData.js
  ← imported by: Menu.jsx, CategoryIcons.jsx, CategoryPage.jsx,
                  AdminMenuManagement.jsx, AdminAnalytics.jsx (category names)

statusStyles.js
  ← imported by: StatusBadge.jsx

ORDER_STATUS (from OrderContext.jsx)
  ← imported by: StatusBadge.jsx, statusStyles.js, AdminOrders.jsx,
                  AdminKitchen.jsx, AdminOrderDetail.jsx, AdminDashboard.jsx,
                  OrderHistoryPage.jsx, OrderTrackingPage.jsx

ImageWithFallback.jsx
  ← imported by: MenuCard.jsx, ProductModal.jsx, CategoryPage.jsx,
                  OrderHistoryPage.jsx, OrderTrackingPage.jsx,
                  AdminOrderDetail.jsx, AdminMenuManagement.jsx,
                  Serenity.jsx, Locations.jsx

useMagnet.js
  ← imported by: Hero.jsx, Navbar.jsx, Hero3D.jsx
  → dispatches 'magnetic-active'/'magnetic-inactive' CustomEvents
  → MagneticCursor listens to these events on window
```

---

## 17. DATA FLOW DIAGRAM

### 17.1 Customer Order Flow (Supabase mode)

```
[Customer browses /menu/:slug]
        │
        ▼
[Clicks "Add to Cart" on MenuCard]
        │  addItem({ id, title, price, image, isVeg })
        ▼
[CartContext.items[] updated]
[Navbar badge animates +1]
[localStorage 'veloura-cart' updated]
        │
        ▼
[Customer opens CartDrawer → /checkout]
        │
        ▼
[CheckoutPage reads CartContext + OrderContext.orderType]
[Customer fills form → clicks "Place Order · ₹XXX"]
        │  placeOrder(orderData)
        ▼
[OrderContext.placeOrder()]
        │
        ├─ isSupabaseReady? YES ──► saveOrderToSupabase(orderData)
        │                                │
        │                                ▼
        │                         [Supabase: INSERT into orders]
        │                         [Supabase: INSERT into order_items]
        │                                │
        │                                ▼
        │                         [Supabase Realtime fires INSERT event]
        │                                │
        │                         ┌──────┴──────────────────────────┐
        │                         ▼                                  ▼
        │                  [OrderContext on                   [All other open
        │                   same client:                       browser windows:
        │                   ADD_ORDER dispatch]                ADD_ORDER dispatch]
        │                         │                                  │
        │                         ▼                                  ▼
        │                  [Admin Dashboard              [Admin Kitchen,
        │                   updates instantly]            Orders board update]
        │
        └─ isSupabaseReady? NO ──► local ORD-XXXX created
                                   ADD_ORDER dispatch (local only)

        [clearCart()]
        [navigate('/track/' + order.id)]
```

### 17.2 Status Update Flow (Admin → Customer)

```
[Admin clicks "Start Preparing" on order card]
        │  updateStatus(id, 'Preparing')
        ▼
[OrderContext: optimistic dispatch UPDATE_STATUS]
[UI updates immediately — no lag]
        │
        └─ isSupabaseReady? YES ──► updateOrderStatusInSupabase(id, 'Preparing')
                                           │
                                           ▼
                                    [Supabase: UPDATE orders SET status='Preparing']
                                           │
                                           ▼
                               [Realtime UPDATE event fires on all channels]
                                           │
                              ┌────────────┴─────────────────────┐
                              ▼                                   ▼
                     ['orders-live' channel]              ['order-{id}' channel]
                      (all admin clients)                  (customer tracking page)
                              │                                   │
                              ▼                                   ▼
                     [UPDATE_STATUS dispatch]            [Re-fetch order from DB]
                     [Kanban card moves column]          [Timeline step activates]
                     [Kitchen card status updates]       [ETA label changes]
```

### 17.3 QR → Order Flow

```
[Table QR code scanned]
        │  URL: /table/5
        ▼
[TableRouteHandler]
        │  setOrderType('Dine In')
        │  setTableNumber('5')
        │  localStorage updated
        │  navigate('/')
        ▼
[Homepage renders, Navbar shows "Dine In · T-5"]
        │
        ▼
[Customer adds items, goes to /checkout]
        │  CheckoutPage detects orderType === 'Dine In'
        │  Shows table number field (pre-filled '5'), hides address fields
        ▼
[Order placed with tableNumber='5', orderType='Dine In']
        │
        ▼
[Admin sees "T-5" badge on Kanban card]
[Kitchen sees large "T-5" badge on KDS card]
[Customer tracking shows "Serving" labels instead of "Delivery" labels]
```

### 17.4 Authentication Flow

```
[Customer visits /signup]
        │  supabase.auth.signUp({ email, password, options: { data: { full_name } } })
        ▼
[Supabase sends confirmation email]
[Customer sees "Check your email" screen]
        │  Customer clicks email link → confirmed
        ▼
[Customer visits /login]
        │  supabase.auth.signInWithPassword({ email, password })
        ▼
[Supabase returns { user, session }]
[AuthContext.user populated]
[Supabase stores JWT in localStorage (sb-*-auth-token)]
        │
        ▼
[onAuthStateChange fires across all tabs]
[Navbar updates: shows avatar, "My Orders", "Sign Out"]
[/orders/history now fetches from Supabase by email]
[/checkout sends email with order for future history lookup]
```

---

## 18. PROJECT STATUS

### 18.1 Completed Features ✅

| Feature | Notes |
|---|---|
| Premium customer-facing website | Dark luxury theme, glassmorphism, gold accents |
| 3D animated hero (canvas frame sequence) | 136 WebP frames, ping-pong loop, parallax mouse |
| Background frame animation | 144 WebP frames, mix-blend-luminosity |
| 8-category menu with 32+ items | Full item data: image, price, rating, veg, nutrition, ingredients |
| `ImageWithFallback` component | Skeleton, fallback URL, "Image Coming Soon" tile |
| Cart system | Persistent localStorage, GST, animated drawer |
| 3 ordering modes | Dine In / Takeaway / Delivery — persisted, QR-aware |
| QR table routing | `/table/:tableNum` sets context + redirects |
| Checkout page (all 3 modes) | Mode-aware form, loading state, success screen |
| Order tracking page | 5-step animated timeline, Supabase realtime subscription |
| Order history page | Supabase fetch by email, localStorage fallback |
| Customer auth | Supabase signup/login/logout, session persistence |
| Admin login | Demo credentials, sessionStorage session |
| Admin dashboard | KPIs, animated counters, recent orders table |
| Admin Kanban board | 4 columns, new-order pulse, next-status buttons |
| Admin list view | Search, filter by status/type/table |
| Admin order detail | Full info, status timeline, action buttons |
| Kitchen Display System | Large cards, live timers, urgency flags, priority sort |
| Admin analytics | 6 charts (Recharts), weekly/hourly/category/items |
| Admin menu management | CRUD grid, availability toggle (session-only persistence) |
| Supabase Realtime | INSERT + UPDATE on orders → all open clients update instantly |
| Custom magnetic cursor | Gold cursor, variant morphing, all pages, max z-index |
| Floating particles | Gold dust + SVG coffee beans, parallax mouse depth |
| Liquid transition | SVG espresso wipe (1.5s) between page navigations |
| Ambient audio system | Toggle button, animated equaliser bars, loop |
| Image reliability | All Google AIDA URLs replaced, unique Unsplash images, local assets |
| Build splitting | 4 vendor chunks, clean build, zero errors |
| `npm run image-audit` | Script to check duplicates and broken URLs |
| Full offline/demo mode | Entire app functional without Supabase credentials |

### 18.2 Pending / Missing Features ❌

| Feature | Priority | Effort |
|---|---|---|
| Razorpay payment integration | 🔴 High | 3–5 days (Edge Function needed) |
| `/admin/tables` route registration | 🔴 High | 5 minutes |
| Admin login hint fix (aura2024 → veloura2026) | 🔴 High | 1 minute |
| `index.html` title update | 🟡 Medium | 1 minute |
| Menu persistence to Supabase | 🟡 Medium | 1–2 days |
| Admin role-based access control | 🟡 Medium | 1 day |
| Table reservation backend | 🟡 Medium | 2 days |
| QR code generation admin UI | 🟡 Medium | 1 day |
| `public.profiles` table + user profile page | 🟡 Medium | 1 day |
| PWA manifest + service worker | 🟢 Low | Half day |
| Push notifications | 🟢 Low | 2 days |
| ESLint purity warning cleanup | 🟢 Low | 2 hours |
| `@splinetool/react-spline` removal (unused) | 🟢 Low | 5 minutes |

### 18.3 Production Readiness Score

| Area | Score | Notes |
|---|---|---|
| Customer menu experience | 95% | Complete, polished, image-safe |
| Cart & checkout | 90% | Works; no payment gateway |
| Order tracking & realtime | 90% | Complete once Supabase is connected |
| Customer auth | 85% | Complete; email SMTP config needed |
| Admin dashboard & orders | 90% | Complete; routes/hint fixes needed |
| Kitchen display | 90% | Fully functional |
| Analytics | 85% | All charts working; no date filtering |
| Menu management | 60% | UI complete; no DB persistence |
| QR ordering | 80% | Flow works; no admin QR generator |
| Payment | 0% | Not started |
| Security | 50% | RLS in place; admin auth is demo-grade |
| Testing | 0% | No test framework |
| **Overall** | **~75%** | |

---

## 19. RECOVERY GUIDE

This section is written for a developer or AI receiving this codebase for the first time.

### 19.1 First 10 Minutes — Get It Running

```bash
# 1. Clone / unzip the project
cd cafe-3d-menu

# 2. Install dependencies
npm install

# 3. Run in development mode (offline/demo — no Supabase needed)
npm run dev
# → http://localhost:5173

# 4. Open http://localhost:5173 — you should see the full homepage
# 5. Open http://localhost:5173/admin/login
#    Login: admin / veloura2026
# 6. Explore the admin dashboard with 5 seed orders
```

The app works 100% without any Supabase configuration. All orders go to localStorage.

### 19.2 Connect Supabase (15 minutes)

```bash
# 1. Create a free Supabase project at https://app.supabase.com
# 2. Copy your Project URL and anon key
# 3. Edit .env in the project root:
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# 4. In Supabase Dashboard → SQL Editor → New Query
#    Paste entire supabase/schema.sql → Run
# 5. Restart dev server: npm run dev
# 6. Place a test order — check Supabase Table Editor for the row
# 7. Open admin dashboard in another tab — order appears without refresh
```

### 19.3 Understanding the Codebase (30 minutes)

**Start here in this order:**

1. **`src/App.jsx`** — Understand the provider nesting and all routes. This is the skeleton.
2. **`src/contexts/OrderContext.jsx`** — The largest file. Read the state shape, `placeOrder`, `updateStatus`, and the Realtime subscription setup.
3. **`src/lib/supabase.js`** — All DB functions. Understand `normalizeOrder` — this is the shape every component expects.
4. **`src/data/menuData.js`** — The menu data. All images, categories, items live here.
5. **`src/components/Navbar.jsx`** — Understand how auth state, cart, and ordering mode are surfaced to the user.
6. **`src/pages/CheckoutPage.jsx`** — Understand the 3-mode form logic and how `placeOrder` is called.

### 19.4 Making Common Changes

**Add a new menu item:**
```js
// src/data/menuData.js — add to the relevant category array
{
  id: 'new-item',          // unique, kebab-case
  title: 'New Item',
  description: 'Short description',
  fullDescription: 'Long description for modal',
  price: 350,              // integer ₹
  image: 'https://images.unsplash.com/photo-XXXX?w=800&auto=format&fit=crop&q=80',
  rating: 4.5,
  prepTime: '10 mins',
  isVeg: true,
  isAvailable: true,
  ingredients: ['Ingredient A', 'Ingredient B'],
  nutrition: { calories: 300, protein: '10g', carbs: '40g', fat: '12g' },
}
```

**Add a new admin page:**
```jsx
// 1. Create src/admin/pages/AdminNewPage.jsx
// 2. Import in src/App.jsx
// 3. Add route inside the /admin Route:
<Route path="new-page" element={<AdminNewPage />} />
// 4. Add nav item in src/admin/components/AdminLayout.jsx:
{ label: 'New Page', icon: 'icon_name', path: '/admin/new-page' }
```

**Change the ordering mode default:**
```js
// src/contexts/OrderContext.jsx — line ~190
const [orderType, setOrderType] = useState(
  () => localStorage.getItem('veloura-order-type') || 'Delivery'  // ← change 'Delivery'
);
```

**Update admin credentials:**
```js
// src/contexts/AdminAuthContext.jsx
const DEMO_CREDENTIALS = [
  { username: 'admin', password: 'NEW_PASSWORD', role: 'Manager', name: 'Name' },
  // ...
];
// Also update the hint in src/admin/pages/AdminLogin.jsx
```

**Change GST rate:**
```js
// src/contexts/CartContext.jsx — one line
const gst = Math.round(subtotal * 0.05);  // ← change 0.05 to desired rate
```

### 19.5 Adding Razorpay (Next Major Feature)

The architecture is prepared. The steps are:

1. Create a Supabase Edge Function `create-razorpay-order` that:
   - Accepts `{ amount, currency, receipt }` from frontend
   - Calls Razorpay API using secret key (stored as Supabase secret)
   - Returns `{ razorpay_order_id }`

2. Create another Edge Function `verify-razorpay-payment` that:
   - Accepts `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
   - Verifies HMAC signature
   - On success: inserts into Supabase `orders` table + returns order

3. In `CheckoutPage.jsx`:
   - On form submit → call `create-razorpay-order` Edge Function
   - Open Razorpay checkout modal (`window.Razorpay`)
   - On payment success → call `verify-razorpay-payment`
   - On verification success → `placeOrder()` → navigate to tracking

4. The Realtime flow then works as normal — order inserted → admin notified.

### 19.6 Deployment Checklist (Quick Reference)

```
□ .env — real Supabase URL + anon key
□ supabase/schema.sql — run in Supabase SQL Editor
□ npm run build — exits 0
□ npm run image-audit — no broken URLs
□ Fix AdminLogin hint (aura2024 → veloura2026)
□ Add /admin/tables route in App.jsx
□ Update <title> in index.html
□ Push to GitHub → deploy on Vercel/Netlify/Render
□ Add env vars to hosting provider
□ Test full order flow in production
□ Test realtime (two browser windows)
```

### 19.7 Project Naming Note

The project was built as "Aura Cafe" and renamed to "Veloura Café" mid-development. Legacy "Aura" strings remain in:
- `index.html` title (`Aura Cafe | Signature Blend`)
- `AdminLogin.jsx` hint text (`admin / aura2024`)
- Some console.log messages (`[Aura]` prefix — benign)
- `src/components/cafe-3d-menu.code-workspace` (stray workspace file in components folder)

None of these affect functionality. Update them before public launch.

### 19.8 File to Delete

`src/components/cafe-3d-menu.code-workspace` — a VS Code workspace file accidentally placed inside the components directory. It should be at the project root or deleted. It has no effect on the build.

---

*End of PROJECT_HANDOVER.md*  
*Generated June 2026 — Veloura Café v1.0 Session A*
