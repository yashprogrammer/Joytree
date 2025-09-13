## Corporate Gifting MVP — Frontend-First Build Plan (Cursor Guide)

This document is the authoritative, step-by-step plan to build a Day-1 MVP, front-end first, with MSW mocks and a stable API contract ready for a future Node/Express + Prisma backend. It includes milestone checklists (tickable todos) so Cursor can verify progress and continue from the current state.

### Scope recap (Day-1)
- Frontend app in Next.js (App Router, TS) + Tailwind + Zod + React Hook Form.
- MSW mocks for all APIs; thin Next.js route handlers for stable URLs.
- Flow: `/c/[slug]` stepper → Auth (mobile OTP + company email) → Form → Mandatory Video → Gift selection (modal confirm) → Confirm Details modal → Place Order → Summary page.
- Business rules: address required for physical gifts; one order per employee per campaign (409 on duplicate); video step mandatory.
- Admin page: list mock orders + Download CSV.
- Deploy to Vercel (no DB today). Keep contracts stable for future backend.

---

## Milestone 0 — Pre-reqs & current repo state

You currently have only `flow.excalidraw` in the workspace. Start fresh from this state.

Todos
- [x] Confirm Node 18+ (prefer Node 20+) and pnpm or npm installed.
- [x] Confirm working directory: `/Users/yashpatil/Developer/WebDev/Joytree`.
- [ ] Create a new git branch for the MVP (or continue on `dev`).
- [x] Decide package manager: `pnpm` (preferred) or `npm`.

---

## Milestone 1 — Project scaffold (Next.js + Tailwind)

Goal: Create a Next.js 14+ App Router TypeScript project with Tailwind configured.

Steps
1) Initialize Next.js app.
2) Add Tailwind CSS and basic config.
3) Ensure `app` directory is enabled (App Router) and TS is on.
4) Add base scripts (dev, build, start, lint, type-check).

Todos
- [x] Initialize Next app (TS, App Router).
- [x] Install Tailwind, PostCSS, Autoprefixer; init Tailwind config.
- [x] Configure `tailwind.config` content paths for `app`, `components`, `lib`.
- [x] Import Tailwind base/components/utilities in `globals.css`.
- [x] Verify `npm run dev` renders the starter page.

---

## Milestone 2 — Base project structure

Goal: Create directories and placeholders to match the agreed structure.

Target structure
```
/app
  /c/[slug]/page.tsx
  /order/[id]/summary/page.tsx
  /admin/orders/page.tsx
  /api
    /auth/request-otp/route.ts
    /auth/verify-otp/route.ts
    /auth/verify-email/route.ts
    /campaigns/[slug]/gifts/route.ts
    /orders/route.ts
    /orders/[id]/route.ts
/components
  Stepper.tsx
  PhoneInput.tsx
  OtpInput.tsx
  AddressForm.tsx
  GiftCard.tsx
  GiftModal.tsx
  ConfirmDetailsModal.tsx
  VideoPlayer.tsx
/lib
  api.ts
  validators.ts
  csv.ts
  session.ts
  steps.ts
/mocks
  handlers.ts
  db.ts
  seed.ts
  browser.ts
/types
  index.ts
/styles
  globals.css (already present)
```

Todos
- [x] Create all directories above.
- [x] Add empty placeholder files as listed (no implementation yet).
- [x] Ensure imports will resolve with relative paths (or configure path aliases later).

---

## Milestone 3 — Shared types and validators

Goal: Define app-wide types (close to future Prisma) and Zod validators.

Types (TS)
- `Company { id, name, slug }`
- `Campaign { id, slug, title, companyId, videoUrl?, startsAt?, endsAt? }`
- `GiftOption { id, campaignId, title, imageUrl, description?, type: 'physical' | 'digital' }`
- `Employee { id, mobile, name?, email?, empId? }`
- `Address { line1, line2?, city, state, pincode }`
- `Order { id, campaignId, employeeId, giftId, address?, status: 'PLACED', createdAt }`

Validators (Zod)
- `mobile`: Indian 10-digit.
- `email`: RFC-compliant.
- `pincode`: 6-digit.
- Cross-field rule: address required iff `selectedGift.type === 'physical'`.

Todos
- [x] Implement `/types/index.ts` with the above types.
- [x] Implement `/lib/validators.ts` with Zod schemas and cross-field validation.
- [ ] Add unit-level sanity checks for schemas (optional today).

---

## Milestone 4 — MSW mocks (in-memory store)

Goal: Mock all APIs with MSW; seed an in-memory DB.

Store
- `companies`, `campaigns`, `gifts`, `employees`, `orders` in `/mocks/db.ts`.
- Seed in `/mocks/seed.ts` (e.g., campaign `diwali-2025` with 4 gifts: mix of physical & digital).

Handlers (mock responses)
- `POST /api/auth/request-otp` → `{ success: true }`.
- `POST /api/auth/verify-otp` → accept `123456`; return `{ token }` and map token→employeeId.
- `POST /api/auth/verify-email` → `{ success: true }` (allow any domain for demo).
- `GET /api/campaigns/[slug]/gifts` → `{ gifts, campaign }`.
- `POST /api/orders` → enforce single order per (employeeId,campaignId); 409 on duplicates.
- `GET /api/orders/[id]` → return joined Order + Gift + Campaign.

Bootstrapping MSW
- Place service worker in `public/` and initialize from `/mocks/browser.ts`.
- Ensure MSW runs in both dev and on Vercel (prod) for demo.

Todos
- [x] Install MSW and init worker in `public/`.
- [x] Create `/mocks/db.ts` and `/mocks/seed.ts`.
- [x] Create `/mocks/handlers.ts` for all endpoints.
- [x] Create `/mocks/browser.ts` to start the worker conditionally.
- [x] Verify mocks respond via fetch from the browser.

---

## Milestone 5 — Next.js route handlers (thin wrappers)

Goal: Add App Router route handlers that keep URLs stable and can later hit the real backend.

Endpoints
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/verify-email`
- `GET /api/campaigns/[slug]/gifts`
- `POST /api/orders`
- `GET /api/orders/[id]`

Behavior today
- Minimal handlers that forward to mocks (same request/response shape) and set correct status codes.

Todos
- [x] Implement each route handler file with correct method and status handling.
- [ ] Verify responses match contract and errors propagate (409 for duplicate).

---

## Milestone 6 — Lib utilities

Goal: Provide shared clients/utilities used across the app.

Files
- `/lib/api.ts`: typed fetch wrappers; inject `Authorization: Bearer <token>` from session when present.
- `/lib/session.ts`: localStorage token read/write helpers.
- `/lib/csv.ts`: stringify orders to CSV (columns per spec).
- `/lib/steps.ts`: step constants and an optional state machine helper.

Todos
- [x] Implement `api.ts` with safe JSON parsing and typed responses.
- [x] Implement `session.ts` for token persistence.
- [x] Implement `csv.ts` per admin export spec.
- [x] Implement `steps.ts` constants and helpers.

---

## Milestone 7 — Stepper state and providers

Goal: Centralize step control to enforce order and gate transitions.

Requirements
- Steps: Auth → Form → Video (mandatory) → Gifts → Confirm → Place → Summary.
- Provide `StepperContext` to navigate next/prev with guards (e.g., cannot skip Video).

Todos
- [x] Create a client-side `StepperContext` provider.
- [x] Add guard logic for required steps (video watched flag, selected gift, valid form data).
- [x] Wire context in `/app/c/[slug]/page.tsx`.

---

## Milestone 8 — Components

Goal: Implement reusable components with accessibility in mind.

Components
- `Stepper`: visual stepper with current step.
- `PhoneInput`: normalized Indian mobile input.
- `OtpInput`: 6-digit OTP input.
- `AddressForm`: conditional validation (physical gifts only).
- `GiftCard`: show image + title; click opens modal.
- `GiftModal`: image, title, description, confirm selects gift.
- `ConfirmDetailsModal`: show/edit Emp ID, Email; show Address if physical; Mobile read-only.
- `VideoPlayer`: play/embed `campaign.videoUrl`; expose “I’ve watched”/Continue.

Todos
- [ ] Build each component with props and aria attributes.
- [ ] Ensure keyboard navigation and focus trap in modals.
- [ ] Integrate with RHF + Zod for inline errors.

---

## Milestone 9 — Pages & flow wiring

Goal: Implement pages and wire them to the mocks and stepper.

Pages
- `/c/[slug]`: hosts the stepper and all steps.
- `/order/[id]/summary`: shows Order + Gift + Campaign info.
- `/admin/orders`: table of mock orders + Download CSV using `/lib/csv.ts`.

Todos
- [ ] Implement `/c/[slug]` page with the stepper steps in order.
- [ ] Fetch campaign + gifts for slug; handle loading/empty states.
- [ ] Implement summary page fetching `/api/orders/[id]`.
- [ ] Implement admin page listing orders with a “Download CSV” button.

---

## Milestone 10 — Business rules enforcement

Goal: Enforce core rules both client-side and in mocks.

Rules
- One order per employee per campaign: block on client; server mock returns 409.
- Address required only if gift.type === 'physical'.
- Video step is mandatory before moving forward.

Todos
- [ ] Client-side duplicate prevention (disable Place Order if already placed in session).
- [ ] Mock handler returns 409 for duplicate; surface error in UI.
- [ ] Conditional address validation wired to selected gift type.
- [ ] Video must be acknowledged before enabling next step.

---

## Milestone 11 — Accessibility & UX polish

Goal: Ensure a11y and smooth UX.

Todos
- [ ] All interactive elements have labels and roles.
- [ ] Modals have focus trap and ESC/overlay close behavior (where appropriate).
- [ ] Forms have inline error messages and aria-describedby.
- [ ] Images have alt text; Video has accessible controls.
- [ ] Keyboard-only flow validated end-to-end.

---

## Milestone 12 — QA: functional smoke tests (manual)

Goal: Verify the end-to-end happy path and key edge cases.

Happy path
- [ ] Visit `/c/diwali-2025`; request OTP; verify with `123456`.
- [ ] Provide company email (any domain ok today).
- [ ] Fill form (address only if physical gift selected later).
- [ ] Watch/acknowledge video; proceed.
- [ ] Select a gift; confirm in modal.
- [ ] Confirm details; place order; reach summary page.

Edge cases
- [ ] Try placing second order in same campaign with same mobile → 409 shown.
- [ ] Select physical gift without address → validation blocks.
- [ ] Try skipping video → blocked.

---

## Milestone 13 — Deployment to Vercel

Goal: Deploy with mocks enabled; no DB required.

Steps
1) Push repo to GitHub/GitLab; connect Vercel project.
2) Ensure `public/mockServiceWorker.js` included in build output.
3) Ensure MSW bootstraps on client in production (opt-in env, e.g., `NEXT_PUBLIC_API_MOCKING=enabled`).
4) Verify mocks work on deployed URL.

Todos
- [ ] Configure Vercel project and environment variable if needed.
- [ ] First deploy succeeds; home page loads.
- [ ] Full flow works on Vercel deployment.

---

## Milestone 14 — Future backend integration (scaffold-only guidance)

Goal: Prepare for a real Node/Express + Prisma backend without breaking the FE.

Plan
- Keep current REST contracts intact (as documented in this plan).
- Implement BE endpoints with same request/response and status codes.
- When ready, disable MSW via env and point FE `api.ts` to real base URL if external.
- Replace in-memory logic with DB (SQLite→Postgres) and real OTP/email verification.

Todos
- [ ] Document BE contracts and DTOs (already in this plan).
- [ ] Add `.env` switching to disable mocks later.
- [ ] Verify BE parity by running FE against the real endpoints locally.

---

## API contracts (frozen for Day-1 and future BE)

- `POST /api/auth/request-otp` → body `{ mobile, campaignSlug }` → `{ success: true }`.
- `POST /api/auth/verify-otp` → body `{ mobile, code }` → `{ token }` (mock accepts `123456`).
- `POST /api/auth/verify-email` → body `{ email, campaignSlug }` → `{ success: true }`.
- `GET /api/campaigns/[slug]/gifts` → `{ gifts: GiftOption[], campaign: Campaign }`.
- `POST /api/orders` → body `{ campaignSlug, giftId, employee: { name, email, empId?, mobile }, address? }` → `{ orderId }` or 409 `{ error: 'DUPLICATE_ORDER' }`.
- `GET /api/orders/[id]` → returns `Order` + joined `Gift` + `Campaign`.

---

## Acceptance gates (tick to progress)

Gate A — Skeleton ready
- [x] Next.js + Tailwind scaffolding complete; dev server runs.
- [x] Base directories and placeholder files created.

Gate B — Types & validators
- [x] Types in `/types/index.ts` implemented.
- [x] Zod schemas in `/lib/validators.ts` implemented.

Gate C — Mocks up
- [ ] MSW worker running (dev & prod).
- [ ] In-memory DB seeded.
- [ ] Handlers return correct responses & errors.

Gate D — API wrappers & session
- [x] `api.ts` fetch wrappers working.
- [x] `session.ts` stores/reads token.

Gate E — Stepper & components
- [x] `StepperContext` enforces order.
- [ ] Core components functional and accessible.

Gate F — Pages wired
- [ ] `/c/[slug]` flows through all steps.
- [ ] `/order/[id]/summary` displays joined data.
- [ ] `/admin/orders` lists orders and exports CSV.

Gate G — Rules enforced
- [ ] Duplicate order blocked (client + 409 UI error).
- [ ] Address required for physical gifts.
- [ ] Video step mandatory.

Gate H — Deploy
- [ ] App deployed on Vercel; flow works end-to-end.

---

## How Cursor should use this plan

1) Work milestone by milestone in order. Avoid skipping Gates.
2) After each milestone, tick the Todos and Gates above inside this file.
3) Keep API contracts unchanged; mocks and FE must match them exactly.
4) When switching to real BE later, keep the same routes and DTOs.

---

## Backlog (scaffold now, implement later)

- Pincode verification service integration.
- Eligibility allowlist and campaign deadline enforcement.
- Real OTP and email providers (behind interfaces).
- Image optimizations and caching.
- Persisted sessions and rate limiting.
- Robust error states, loading skeletons, and analytics.


