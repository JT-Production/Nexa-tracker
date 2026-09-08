# Nexa — Multi-Currency Cash Flow & Portfolio Dashboard

**Project Documentation v1.0**
Author: Joey — Trivon Studio
Stack: Next.js · TypeScript · Tailwind CSS · Firebase

---

## 1. Overview

Nexa is a web dashboard for people who earn and spend across multiple currencies — freelancers, remote workers, and founders juggling USD, GBP, NGN, EUR, and crypto. It gives them one place to see their real net worth (converted live into a home currency), track transactions, visualize cash flow, and query their finances in plain English.

**Core value proposition:** "What's my real financial picture, right now, in one currency I understand?"

**Target demo audience:** recruiters, hiring managers, and founders — so every feature is chosen to demonstrate senior-level frontend skill (real-time data, correct money math, custom data viz, clean state management) as much as to be a good product.

---

## 2. Tech Stack (current stable versions, verified)

| Category | Library | Version | Purpose |
|---|---|---|---|
| Framework | **Next.js** | 16.3.x (App Router) | Routing, server components, streaming |
| Language | **TypeScript** | 5.9.x | Type safety |
| UI runtime | **React** | 19.2.x | Component layer |
| Styling | **Tailwind CSS** | 4.3.x | Utility-first styling (CSS-first config, no `tailwind.config.js` needed in v4) |
| Component primitives | **shadcn/ui** (via CLI, not versioned as a dependency) + **Radix UI** | latest | Accessible unstyled primitives you own the code for |
| Backend / DB | **Firebase** (`firebase` JS SDK) | 12.18.x | Auth, Firestore, Storage |
| Backend admin (server-side) | **firebase-admin** | 14.x | Server-side writes, Cloud Functions |
| Animation | **Motion** (formerly Framer Motion — `npm i motion`, import from `motion/react`) | 13.1.x | Micro-interactions, transitions |
| Charts | **Recharts** | 3.9.x | Base charts (line/bar/pie) — you'll extend/customize these |
| State management | **Zustand** | 5.0.x | Global client state (UI state, filters, command palette) |
| Server state / caching | **TanStack Query** | 5.x | Firestore data fetching, caching, optimistic updates |
| Validation | **Zod** | 4.4.x | Schema validation for forms + Firestore documents |
| Forms | **React Hook Form** | 7.x | Form state, paired with Zod resolver |
| Icons | **Lucide React** | latest | Icon set (also what shadcn/ui uses by default) |
| Command palette | **cmdk** | latest | Powers the Cmd+K search/command interface |
| Currency/date utils | **dinero.js** or **currency.js** (for money math) + **date-fns** | latest | Avoid floating-point errors in money math; date formatting |
| Exchange rates | **exchangerate-api.com** or **Frankfurter API** (free tier) | — | Live FX rates |
| Deployment | **Vercel** | — | Hosting, previews, edge functions |

> **Money math note:** Never store or calculate currency values as raw JavaScript floats. Store amounts as integers in the smallest unit (cents/kobo) or use `dinero.js` / `currency.js` to avoid classic `0.1 + 0.2 !== 0.3` bugs. This is a detail senior engineers specifically check for — get it right and it becomes a talking point in interviews.

---

## 3. Pages & Routes

Using the Next.js App Router (`/app` directory):

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing page | Marketing/pitch page for the product — explains the problem, shows a hero screenshot/animation, has a "Try Demo" button that skips auth and loads seeded data |
| `/login` | Auth | Firebase Auth (email/password + Google sign-in) |
| `/signup` | Auth | Account creation |
| `/dashboard` | Main dashboard | Net worth summary, account cards, recent transactions, mini charts |
| `/dashboard/accounts` | Accounts list | All connected accounts, "+ Connect Account" flow entry point |
| `/dashboard/accounts/[id]` | Account detail | Single account's transaction history and stats |
| `/dashboard/transactions` | Transactions | Full searchable/filterable transaction table + add/edit modal |
| `/dashboard/analytics` | Analytics/Insights | Spending by category, income by source, net worth over time, month-over-month comparison |
| `/dashboard/settings` | Settings | Home currency preference, profile, theme, connected accounts management |
| `/dashboard/settings/currency` | Currency settings | Manage which currencies are tracked, set home/display currency |
| `/demo` | Public demo mode | A read-only, pre-seeded version of the dashboard recruiters/founders can explore without signing up — **this is your most important page for job-hunting purposes** |

### Global UI elements (not standalone pages)
- **Command palette (Cmd+K)** — global search/actions, accessible from any page
- **"Connect Account" modal flow** — triggered from dashboard or accounts page
- **"Add Transaction" modal/drawer** — triggered from dashboard or transactions page
- **Toast notification system** — for save confirmations, errors, sync status

---

## 4. Feature Breakdown

### 4.1 Authentication
- Email/password and Google OAuth via Firebase Auth
- Protected routes via Next.js middleware checking auth state
- A **public demo mode** that bypasses auth entirely and loads a read-only seeded Firestore dataset — this is what you'll link recruiters to, so they never have to sign up to see it working

### 4.2 Dashboard (home)
- **Net worth card**: total balance across all accounts, converted live into the user's home currency, with an animated counter that ticks when values update
- **Account cards**: one card per connected account, showing balance, currency, and a tiny sparkline of recent balance history
- **Recent transactions feed**: last 5–10 transactions with category icons
- **Quick stats**: this month's income vs. spending, in home currency

### 4.3 Connect Account flow (mocked, see earlier discussion)
- Modal: choose institution (bank/crypto logos, searchable)
- Fake "connecting..." sequence (2–3s, mimics Plaid/Mono Link)
- Success state → new account card animates into the dashboard
- Auto-generates realistic seeded transactions for that account so charts/totals update immediately

### 4.4 Manual transaction entry
- Add/edit/delete transactions: amount, currency, category, account, date, note
- Real Firestore writes (this is your real CRUD, not mocked)
- Optimistic UI updates via TanStack Query — transaction appears instantly, rolls back on error
- Zod-validated form via React Hook Form

### 4.5 Multi-currency conversion engine
- Live FX rates fetched from a free exchange rate API, cached and refreshed periodically
- Every amount displayable in the user's chosen "home currency"
- Rate changes animate the net worth number (subtle tick-up/down effect)

### 4.6 Analytics / Insights
- **Spending by category**: custom-built donut/pie chart (extend Recharts, don't just drop it in raw — restyle it to look bespoke)
- **Net worth over time**: line chart, filterable by date range
- **Income by source**: bar chart comparing clients/accounts
- **Month-over-month comparison**: simple up/down indicators

### 4.7 Command palette (Cmd+K)
- Fuzzy search across transactions, accounts, and pages
- Quick actions: "Add transaction," "Connect account," "Go to analytics"
- This single feature makes the whole app feel "pro-grade" instantly (same pattern as Linear/Raycast)

### 4.8 AI query layer (the differentiator)
- A search/chat input where the user types a plain-English question: *"How much did I spend on subscriptions this year?"*
- Backend (Next.js API route or Firebase Cloud Function) sends the question + relevant transaction data to an LLM API, gets back a structured answer
- Renders as a natural-language response, optionally with a small inline chart
- This is the feature to highlight in interviews — it shows you can ship a working AI feature, not just wire up an API call

### 4.9 Settings
- Home currency selector
- Theme toggle (dark/light) with smooth transition
- Profile management
- Manage/disconnect accounts

### 4.10 Polish features (do these — they're cheap and high-impact)
- Skeleton loading states (not spinners) for every data-fetching component
- Empty states with illustration + CTA (e.g., "No transactions yet — add your first one")
- Fully responsive (test on mobile — recruiters often check on their phone)
- Dark mode by default (fintech apps almost always default dark)
- Micro-interactions on every button/card hover via Motion

---

## 5. Data Model (Firestore)

```
/users/{userId}
  - displayName, email, homeCurrency, createdAt

/users/{userId}/accounts/{accountId}
  - name: string           // "Chase Checking"
  - institution: string    // "Chase"
  - currency: string       // "USD"
  - balance: number        // stored in smallest unit (cents)
  - type: "bank" | "crypto" | "cash"
  - connectedAt: timestamp
  - isDemo: boolean

/users/{userId}/transactions/{transactionId}
  - accountId: string
  - amount: number          // smallest unit, signed (+income / -expense)
  - currency: string
  - category: string        // "Rent" | "Subscriptions" | "Income" | etc.
  - description: string
  - date: timestamp
  - createdAt: timestamp

/users/{userId}/fxRatesCache/{currencyPair}
  - rate: number
  - fetchedAt: timestamp
```

**Firestore security rules**: every user can only read/write their own `users/{userId}/**` subtree. The `/demo` mode reads from a separate, publicly-readable `demo/` collection seeded once and never written to by visitors.

---

## 6. Suggested Folder Structure

```
/app
  /(marketing)/page.tsx          → landing page
  /(auth)/login/page.tsx
  /(auth)/signup/page.tsx
  /dashboard/
    layout.tsx
    page.tsx
    accounts/page.tsx
    accounts/[id]/page.tsx
    transactions/page.tsx
    analytics/page.tsx
    settings/page.tsx
  /demo/page.tsx
  /api/
    ai-query/route.ts            → LLM query endpoint
    fx-rates/route.ts            → cached FX rate proxy
/components
  /ui/                           → shadcn/ui generated components
  /dashboard/                    → NetWorthCard, AccountCard, TransactionRow, etc.
  /charts/                       → custom Recharts wrappers
  /command-palette/
  /modals/                       → ConnectAccountModal, AddTransactionModal
/lib
  firebase.ts                    → Firebase client init
  firebase-admin.ts              → server-side init
  money.ts                       → currency formatting + conversion helpers
  validators.ts                  → Zod schemas
/store
  useUIStore.ts                  → Zustand store (modals, command palette state)
/hooks
  useAccounts.ts, useTransactions.ts   → TanStack Query hooks
/types
  index.ts                       → shared TypeScript types (Transaction, Account, etc.)
```

---

## 7. Build Order (recommended)

1. **Foundation**: Next.js + Tailwind + Firebase project setup, auth flow
2. **Core CRUD**: accounts + transactions with real Firestore reads/writes, TanStack Query wiring
3. **Dashboard UI**: net worth card, account cards, transaction feed — static/manual data first
4. **FX conversion**: wire in live exchange rates, animate the net worth number
5. **Charts**: analytics page with custom-styled Recharts
6. **Connect Account mock flow**: the "wow" demo moment
7. **Command palette**: Cmd+K search/actions
8. **AI query layer**: the differentiator feature
9. **Polish pass**: skeletons, empty states, responsive QA, dark mode, micro-interactions
10. **Deploy + demo mode + README with architecture diagram + Loom walkthrough**

---

## 8. What Makes This Portfolio-Ready

- Real Firestore CRUD (not fake data everywhere)
- Correct money-math handling (a known senior-vs-junior tell)
- Custom-styled data viz instead of default chart-library looks
- A working AI feature, not just an API wrapper
- A public `/demo` route recruiters can click into with zero friction
- Clean TypeScript (discriminated unions for transaction types, no `any`)
