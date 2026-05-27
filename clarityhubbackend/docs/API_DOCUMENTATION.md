# Clarity Store API Documentation v1.0

## 🚀 Base URL
- Local: `http://localhost:5000/api`
- Production: `https://api.claritystore.com/api` (Placeholder)

---

## 🔐 Authentication Flow

### 1. Account Recovery & OTP Lifecycle
- **Signup**: User provides details. Verification code is sent via email/phone. Account status: `accountVerified: false`.
- **OTP Verification**: User submits the 6-digit code. Status changes to `true`. Tokens are issued.
- **Expiry**: OTPs expire after 10 minutes. Max 3 registration attempts before temporary block.

### 2. JWT Strategy & Refresh Token Rotation
- **Access Token**: Short-lived (15 minutes). Sent in `HttpOnly` cookie or Bearer header.
- **Refresh Token**: Long-lived (7 days). Sent in `HttpOnly` cookie.
- **Rotation**: Every time `POST /auth/refresh-token` is called:
  1. Old refresh token is verified.
  2. Redis session is checked.
  3. **New** Access and **New** Refresh tokens are issued.
  4. Old session is updated with the new refresh token.
  5. If token reuse is detected, the entire session is revoked.

### 3. Account Security
- **Failed Logins**: After 5 failed attempts, the account is locked for 15 minutes (`lockUntil` field).
- **Role Based Access**: Middlewares `protectRoute` (logged in) and `adminRoute` (roles: admin, manager, support) are used consistently.

---

## 📦 Modules

### 1. Auth Module (`/auth`)

#### `POST /auth/sign-up`
Registers a new customer.
- **Auth**: Public
- **Body**: 
  - `firstName` (String, Required)
  - `lastName` (String, Required)
  - `email` (String, Required, Unique)
  - `phone` (String, Required, E.164 format)
  - `password` (String, Required, Min 8 chars)
  - `verificationMethod` (Enum: `email`, `phone`)
- **Success (201)**: `{"success": true, "message": "User registered...", "data": { "user": {...} }}`

#### `POST /auth/otp-verification`
Verifies the 6-digit code.
- **Auth**: Public (Rate limited)
- **Body**: `otp`, `email` OR `phone`
- **Success (200)**: returns tokens and user object.

#### `POST /auth/sign-in`
- **Auth**: Public (Rate limited)
- **Body**: `email`, `password`
- **Logic**: Checks `lockUntil` and updates `loginAttempts` on failure.

#### `POST /auth/refresh-token`
- **Auth**: Requires `refreshToken` cookie.
- **Logic**: Rotates both tokens.

---

### 2. Products Module (`/products`)

#### `GET /products/featured`
Returns all featured products. Using Redis cache (`featured_products`).
- **Auth**: Public

#### `GET /products/search`
- **Query**: `keyword`
- **Logic**: Searches name, description, and category.

#### `POST /products` (Admin)
- **Auth**: `adminRoute`
- **Body**: See `Product` model. Supports Base64 `image` and `images` array for Cloudinary upload.

---

### 3. Orders Module (`/orders`)

#### `GET /orders/my-orders`
- **Auth**: `protectRoute`

#### `PATCH /orders/:id/status` (Admin)
- **Auth**: `adminRoute`
- **Body**: `status` (Enum), `message` (Optional)
- **Logic**: Automatically appends to `timeline` and saves.

---

### 4. Users Module (`/users`)

#### `GET /users/customers` (Admin)
- **Query**: `segment` (Enum: `new`, `repeat`, `high-value`)
- **Logic**: Business logic in `user.service.js` calculates segments based on LTV.

---

## ⚠️ Improvement Suggestions
- **Undocumented Behaviors**: `toggleTwoFactor` in `user.controller.js` generates recovery codes but doesn't yet enforce the 2FA check during `signin`.
- **Validation**: Bulk update/delete endpoints in products lack a strict Joi/Zod validator for the `ids` array structure beyond a basic check.
- **Status Codes**: Most errors return 400 or 401, but some "Not Found" cases might return 500 if not caught early by middleware.

---

## 🛠 Testing Guide
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for Jest/Supertest instructions.
