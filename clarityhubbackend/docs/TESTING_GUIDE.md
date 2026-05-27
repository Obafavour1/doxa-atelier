# Clarity Store API Testing Guide

## 🧪 Testing Philosophy
We utilize **Integration Testing** for the API layer to ensure the interaction between Routes, Controllers, Services, and the Database (MongoDB + Redis) is correct.

## 🛠 Tools
- **Framework**: [Jest](https://jestjs.io/)
- **HTTP Assertions**: [Supertest](https://github.com/ladjs/supertest)
- **Database Mocks**: 
  - `mongodb-memory-server` (Spins up a real ephemeral MongoDB)
  - `ioredis-mock` (Mock for Redis operations)

## 📁 Test Structure
```text
tests/
├── setup.js        # Global setup/teardown & DB cleanup
├── helpers.js      # Shared logic: createTestUser, getAuthTokens
├── auth.test.js    # Security & Verification flows
├── product.test.js # Public search & Admin CRUD
├── user.test.js    # Profile & Admin management
└── order.test.js   # Checkout & Order processing
```

## 📋 QA Checklist per Module

### Auth Module
- [ ] Signup sends verification code (check mock for call).
- [ ] OTP verification fails with incorrect/expired code.
- [ ] Signin handles bcrypt comparison correctly.
- [ ] Account locks after 5 failed attempts (Lockout logic).
- [ ] Access token missing returns 401.
- [ ] Token Rotation: Refreshing 2 times with the same old Refresh Token should revoke session.

### Product Module
- [ ] Public can search without login.
- [ ] Creating product as `customer` returns 403.
- [ ] Creating product with missing name returns 400.
- [ ] Image upload logic is bypassed/mocked in tests.

### Order Module
- [ ] Users can only see their own orders.
- [ ] Admin can update order status and the timeline is updated.
- [ ] Partial/Full refund logic updates `paymentStatus`.

## 🚀 Running Tests

### 1. Installation
Ensure devDependencies are installed:
```bash
npm install
```

### 2. Run All Tests
```bash
npm test
```

### 3. Run Specific Module
```bash
npx jest tests/auth.test.js
```

---

## 💡 Edge Cases to Watch
1. **Concurrency**: Verify that multiple file uploads doesn't hang the worker.
2. **Revocation**: Ensure that after `logout`, the tokens no longer work (checked against Redis).
3. **Session Limit**: `user_sessions` set in Redis should be pruned correctly.
