# Clarity Store Test Plan (Backend + Frontend)

## 1. Purpose
This document defines the tests that should be carried out across the backend and frontend, separated by concern, with priorities and recommended automation type.

Legend:
- Priority: P0 (critical), P1 (high), P2 (medium)
- Type: Unit, Integration, API, Component, E2E, Non-functional
- Status: Existing / Needed

---

## 2. Current Coverage Snapshot

### Backend
Existing automated tests in `clarityhubbackend/tests`:
- `auth.test.js`
- `product.test.js`
- `order.test.js`
- `user.test.js`

Coverage is partial and focused on happy paths and selected auth/admin checks.

### Frontend
No test framework/test files detected in `clarityhubfrontend/frontend` (no Vitest/Jest config and no `.test` / `.spec` files).

---

## 3. Backend Test Plan (Concern-Separated)

Scope source:
- Routes mounted in `src/shared/routes/index.js`
- Modules: auth, products, cart, payments, coupons, orders, users, analytics, settings

### 3.1 Auth Concern (`/auth`)
Key routes:
- `POST /auth/sign-up`
- `POST /auth/otp-verification`
- `POST /auth/resend-otp`
- `POST /auth/sign-in`
- `POST /auth/logout`
- `POST /auth/refresh-token`
- `POST /auth/password/forgot`
- `POST /auth/password/resend-reset/:token`
- `PUT /auth/password/reset/:token`
- `GET /auth/profile`
- `PUT /auth/profile`
- `PUT /auth/password/update`

Tests needed:
1. Sign-up validation matrix (missing/invalid firstName, lastName, email, phone, password, verificationMethod). Type: API. Priority: P0. Status: partially existing.
2. OTP verification success and failure (wrong OTP, expired OTP, reused OTP). Type: Integration/API. Priority: P0. Status: partially existing.
3. Resend OTP behavior (active pending verification, nonexistent pending verification, rate-limited resend). Type: API. Priority: P1. Status: needed.
4. Sign-in lockout policy after repeated failed attempts; unlock behavior after window or admin action. Type: Integration/API. Priority: P0. Status: partially existing.
5. Refresh token rotation and revocation (old token invalid after refresh, token replay attack). Type: Integration/API. Priority: P0. Status: partially existing.
6. Logout invalidates refresh/session and blocks further refresh. Type: Integration/API. Priority: P0. Status: needed.
7. Forgot/reset password full flow (valid user, unverified user, invalid token, expired token, mismatched password confirmation). Type: Integration/API. Priority: P0. Status: partially existing.
8. Auth limiter on sign-up/sign-in paths (`10 requests/15 minutes`). Type: API. Priority: P1. Status: needed.
9. Profile routes require auth and reject unauthenticated requests. Type: API. Priority: P1. Status: needed.
10. Update password route validates current password and invalidates old sessions if required by policy. Type: Integration/API. Priority: P1. Status: needed.

### 3.2 Product Catalog Concern (`/products`)
Key routes:
- Public: `/featured`, `/recommendations`, `/search`, `/category/:category`, `/slug/:slug`
- Admin: `/`, `/low-stock`, `/bulk` (patch/delete), `/:id` (get/put/delete)

Tests needed:
1. Public list/search endpoints return correct filtered data and stable schema. Type: API. Priority: P1. Status: partially existing.
2. Admin-only endpoints enforce auth + role (`adminRoute`). Type: API. Priority: P0. Status: partially existing.
3. Product create/update validation (required fields, invalid price/stock/category). Type: API. Priority: P1. Status: partially existing.
4. Slug uniqueness and slug lookup edge cases (case differences, missing slug). Type: Integration/API. Priority: P1. Status: needed.
5. Bulk update/delete atomicity and partial failure handling. Type: Integration/API. Priority: P0. Status: needed.
6. Featured cache correctness and invalidation after create/update/delete. Type: Integration. Priority: P1. Status: needed.
7. Media upload/delete behavior with Cloudinary failures. Type: Integration. Priority: P1. Status: needed.
8. Low-stock endpoint threshold correctness. Type: API. Priority: P2. Status: needed.

### 3.3 Cart Concern (`/cart`)
Key routes:
- `GET /cart`
- `POST /cart`
- `DELETE /cart`
- `PUT /cart/:id`

Tests needed:
1. Add item to cart (new item vs existing item increment). Type: Integration/API. Priority: P1. Status: needed.
2. Quantity updates enforce bounds (no negative, zero behavior clearly defined). Type: Integration/API. Priority: P1. Status: needed.
3. Remove/clear cart consistency and idempotency. Type: API. Priority: P2. Status: needed.
4. Cart behavior when product is deleted/unavailable. Type: Integration. Priority: P1. Status: needed.
5. Unauthorized access rejection for all cart routes. Type: API. Priority: P1. Status: needed.

### 3.4 Coupon Concern (`/coupons`)
Key routes:
- User: `GET /coupons`, `POST /coupons/validate`, `POST /coupons/apply`
- Admin: `GET /coupons/admin`, `POST /coupons/admin`, `DELETE /coupons/admin/:id`

Tests needed:
1. Coupon validation (active, expired, max uses reached, malformed code). Type: Integration/API. Priority: P0. Status: needed.
2. User-specific coupon scope enforcement (user cannot use another user's private coupon). Type: Integration/API. Priority: P0. Status: needed.
3. Coupon apply updates totals/response payload correctly. Type: Integration/API. Priority: P1. Status: needed.
4. Concurrent coupon usage race conditions (max uses correctness under parallel requests). Type: Integration/Non-functional. Priority: P0. Status: needed.
5. Admin CRUD authorization and data validation. Type: API. Priority: P1. Status: needed.

### 3.5 Payments Concern (`/payments`, Stripe)
Key routes:
- `POST /payments/create-checkout-session`
- `POST /payments/checkout-success`

Tests needed:
1. Checkout session creation with valid products and quantities. Type: Integration/API. Priority: P0. Status: needed.
2. Checkout with invalid product/pricing mismatch is rejected safely. Type: Integration/API. Priority: P0. Status: needed.
3. Coupon application in checkout path correctly affects Stripe payload. Type: Integration/API. Priority: P0. Status: needed.
4. Checkout success creates order exactly once (idempotent for repeated session callback). Type: Integration/API. Priority: P0. Status: needed.
5. Stripe service failure handling (network/API exceptions) returns safe actionable errors. Type: Integration/API. Priority: P1. Status: needed.
6. Reward coupon generation logic for qualifying orders (if configured). Type: Integration. Priority: P1. Status: needed.

### 3.6 Orders Concern (`/orders`)
Key routes:
- User: `GET /orders/my-orders`
- Admin: `GET /orders`, `GET /orders/export`, `GET /orders/:id`, `PATCH /orders/:id/status`, `PATCH /orders/:id/shipping`, `POST /orders/:id/refund`

Tests needed:
1. Access isolation: users only see own orders, admins can see all. Type: API. Priority: P0. Status: partially existing.
2. Status transition validity and timeline updates. Type: Integration/API. Priority: P0. Status: partially existing.
3. Shipping update validation and persistence. Type: API. Priority: P1. Status: needed.
4. Refund amount validation (cannot exceed captured amount), partial vs full refund behavior. Type: Integration/API. Priority: P0. Status: needed.
5. Export endpoint format correctness and large dataset handling. Type: Integration/Non-functional. Priority: P1. Status: needed.
6. Order details endpoint security (admin-only). Type: API. Priority: P1. Status: needed.

### 3.7 Users/Admin Concern (`/users`)
Key routes:
- Customer management: `/customers`, `/customers/:id`, `/customers/:id/status`
- Profile/admin ops: `/profile/*` (overview, update, audit-logs, notifications, 2fa, api-keys, sessions)

Tests needed:
1. Full authorization checks for all admin user routes. Type: API. Priority: P0. Status: partially existing.
2. Customer status updates enforce valid status values and audit logging side effects. Type: Integration/API. Priority: P1. Status: partially existing.
3. API key generate/revoke lifecycle and uniqueness. Type: Integration/API. Priority: P1. Status: needed.
4. Session listing/revocation correctness (revoked session cannot refresh). Type: Integration/API. Priority: P1. Status: needed.
5. 2FA toggle and notification preference validation. Type: API. Priority: P2. Status: needed.

### 3.8 Settings Concern (`/settings`)
Key routes:
- Store: `GET/PUT /settings/store`
- Shipping zones: `GET/POST /settings/shipping`, `PUT/DELETE /settings/shipping/:id`

Tests needed:
1. Auth/role enforcement for all settings endpoints. Type: API. Priority: P1. Status: needed.
2. Store settings validation and persistence. Type: API. Priority: P2. Status: needed.
3. Shipping zone CRUD validation (required fields, duplicate zones, invalid region format). Type: Integration/API. Priority: P1. Status: needed.
4. Shipping zone delete impact checks (if linked entities depend on zone). Type: Integration. Priority: P2. Status: needed.

### 3.9 Analytics Concern (`/analytics`)
Key route:
- `GET /analytics?range=7d|30d|90d|12m`

Tests needed:
1. Range parameter validation and defaults. Type: API. Priority: P2. Status: needed.
2. Revenue, AOV, top products aggregation correctness including refunds. Type: Integration. Priority: P1. Status: needed.
3. Empty dataset and sparse date handling. Type: Integration. Priority: P2. Status: needed.
4. Performance baseline for large order collections. Type: Non-functional. Priority: P2. Status: needed.

### 3.10 Cross-Cutting Backend Concerns
Tests needed:
1. Error middleware contract consistency (error shape/status across modules). Type: API. Priority: P1.
2. Auth middleware behavior (`protectRoute`, `adminRoute`) on expired/invalid tokens. Type: API. Priority: P0.
3. Redis failure fallback behavior (session/caching features). Type: Integration. Priority: P1.
4. Database transaction/consistency tests for checkout+order flows. Type: Integration. Priority: P0.
5. Security tests: input sanitization and injection attempts on query/search endpoints. Type: API/Security. Priority: P1.

---

## 4. Frontend Test Plan (Concern-Separated)

Scope source:
- Routing in `frontend/src/App.tsx`
- Features in `frontend/src/features/*`
- Shared/API clients in `frontend/src/shared/lib/*` and `frontend/src/services/*`

### 4.1 Route & Navigation Concern
Routes include:
- Store routes: home, category, product detail, cart, orders, profile, purchase success/cancel
- Auth routes: signup, login, OTP verification, forgot/reset password
- Admin routes: dashboard, products, orders, customers, coupons, analytics, settings, profile

Tests needed:
1. Public routes render correctly for unauthenticated users. Type: Component/Integration. Priority: P1.
2. Protected routes redirect to login when unauthenticated (`/cart`, `/my-orders`, `/profile`, purchase routes). Type: Integration. Priority: P0.
3. Auth routes redirect away for signed-in users (`/login`, `/signup`, `/verify-otp`). Type: Integration. Priority: P1.
4. Wildcard route fallback behavior. Type: Component. Priority: P2.

### 4.2 Auth UI + State Concern
Relevant files:
- Auth pages/components and auth hooks
- ProtectedRoute/RoleRoute components

Tests needed:
1. Login form validation and submission success/failure messaging. Type: Component/Integration. Priority: P0.
2. Signup + OTP verification flow (including resend OTP and expired OTP UX). Type: Integration/E2E. Priority: P0.
3. Forgot/reset password UI behavior for valid/invalid/expired tokens. Type: Integration/E2E. Priority: P0.
4. Session hydration behavior on app boot (`useMe` loading, redirect after completion). Type: Integration. Priority: P1.
5. RoleRoute behavior for non-admin/admin users. Type: Integration. Priority: P1.

### 4.3 Product Discovery Concern
Relevant pages/components:
- Home, Category, ProductDetail, product cards/lists/recommendations

Tests needed:
1. Home page product sections render with fetched data and loading skeletons. Type: Component/Integration. Priority: P1.
2. Category navigation and filtering behavior. Type: Integration/E2E. Priority: P1.
3. Product detail rendering for valid slug and error state for invalid slug. Type: Integration. Priority: P1.
4. Search UX: query input, empty results, error handling. Type: Integration. Priority: P2.
5. Out-of-stock/disabled purchase states in UI. Type: Component. Priority: P1.

### 4.4 Cart Concern
Relevant files:
- Cart page/components
- `useCartStore` actions and total calculations

Tests needed:
1. Add/remove/update quantity flows update UI and totals correctly. Type: Integration. Priority: P0.
2. Coupon apply/remove updates total/subtotal exactly. Type: Unit/Integration. Priority: P0.
3. Quantity edge behavior (0, negative, very large values). Type: Unit/Integration. Priority: P1.
4. Empty cart state and recovery path to shopping. Type: Component/E2E. Priority: P2.
5. API error handling in cart actions (toast and state rollback). Type: Integration. Priority: P1.

### 4.5 Checkout & Purchase Concern
Relevant pages/features:
- Stripe session creation path
- Purchase success/cancel pages

Tests needed:
1. Checkout button creates Stripe session and redirects. Type: Integration/E2E. Priority: P0.
2. Invalid cart or backend checkout error is surfaced clearly. Type: Integration/E2E. Priority: P0.
3. Success page behavior with missing/invalid session query params. Type: Integration. Priority: P1.
4. Refresh/revisit success page does not create duplicate orders. Type: E2E. Priority: P0.
5. Cancel page displays actionable recovery path. Type: Component. Priority: P2.

### 4.6 Orders & Profile Concern
Tests needed:
1. My orders page loads, paginates/expands details correctly, handles empty state. Type: Integration. Priority: P1.
2. Profile page loads current user and updates profile with proper validation/messages. Type: Integration. Priority: P1.
3. Unauthorized response handling (expired session) redirects cleanly to login. Type: Integration. Priority: P1.

### 4.7 Admin Console Concern
Relevant pages:
- Admin dashboard, products, orders, customers, coupons, settings, profile

Tests needed:
1. Admin route guards prevent customer access to `/admin/*`. Type: Integration/E2E. Priority: P0.
2. Product management CRUD flows (create/edit/delete) with form validation. Type: Integration/E2E. Priority: P1.
3. Coupon management flows and error states. Type: Integration/E2E. Priority: P1.
4. Customer status update actions and optimistic/pessimistic update behavior. Type: Integration. Priority: P1.
5. Order admin actions (status, shipping, refund UI actions) and confirmation UX. Type: Integration/E2E. Priority: P0.
6. Dashboard analytics rendering and fallback states on fetch failures. Type: Component/Integration. Priority: P2.

### 4.8 API Client & Data Layer Concern
Relevant files:
- `shared/lib/apiClient.ts`
- feature hooks/services around axios/react-query

Tests needed:
1. Interceptor behavior on `401` and token refresh sequence. Type: Unit/Integration. Priority: P0.
2. Retry and failure behavior avoids infinite refresh loops. Type: Unit. Priority: P0.
3. Request cancellation/unmount safety for page transitions. Type: Integration. Priority: P2.
4. Error normalization shape consumed by UI. Type: Unit/Integration. Priority: P1.

### 4.9 Accessibility & Responsive Concern
Tests needed:
1. Keyboard navigation through auth, cart, and checkout paths. Type: E2E/A11y. Priority: P1.
2. Accessible labels and error associations on forms. Type: Component/A11y. Priority: P1.
3. Mobile layout behavior for critical pages (cart, checkout CTA, admin tables). Type: E2E/Visual. Priority: P1.

### 4.10 Cross-Cutting Frontend Concerns
Tests needed:
1. Loading, empty, and error states for all major data-fetch pages. Type: Component/Integration. Priority: P1.
2. Toast spam prevention and deduplicated error UX under repeated failures. Type: Integration. Priority: P2.
3. Browser storage/session persistence behavior across reloads. Type: Integration/E2E. Priority: P1.

---

## 5. Recommended Execution Order

### Phase 1 (P0, immediate)
1. Backend: Auth token/session security, checkout/order idempotency, coupon validation/scope, refund validation.
2. Frontend: Auth flows, protected routing, checkout success/cancel robustness, cart totals/coupon correctness, admin route protection.

### Phase 2 (P1)
1. Backend: Product bulk ops, cart integrity, user admin operations, order export/security.
2. Frontend: Product discovery edge cases, profile/orders flows, admin CRUD suites, API client error handling.

### Phase 3 (P2)
1. Backend: Analytics performance/edge datasets, shipping settings deep cases.
2. Frontend: Extended accessibility, responsive visual regressions, long-tail error paths.

---

## 6. Suggested Tooling

### Backend
- Keep Jest + Supertest + mongodb-memory-server + ioredis-mock.
- Add targeted mocks for Stripe/Cloudinary/Twilio/Brevo.
- Add dedicated security/rate-limit suites and fixture factories.

### Frontend
- Add Vitest + React Testing Library for unit/component/integration tests.
- Add Playwright for critical E2E journeys (auth, cart, checkout, admin guards).
- Add MSW for API mocking in component/integration tests.

---

## 7. Deliverables Checklist

1. Backend test matrix file per module with case IDs (e.g., AUTH-001, PAY-004).
2. Frontend test matrix per route/feature with case IDs (e.g., FE-AUTH-003, FE-CHK-002).
3. Automated suites for all P0 scenarios.
4. CI gate requiring P0 suite pass before merge.
5. Regression runbook for release candidates.

---

## 8. Definition of Done for Testing

1. All P0 automated tests are implemented and passing in CI.
2. At least 80% of critical business flow paths are covered (auth, checkout, coupon, orders).
3. Manual QA checklist exists for non-automated P1/P2 scenarios.
4. Test data and environment setup are documented for reproducible runs.
