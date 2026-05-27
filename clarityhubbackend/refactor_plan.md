# Refactored Codebase Structure

## 🏗 Architecture Overview
The codebase has been refactored into a modular, layered architecture located within the `src/` directory. This structure promotes separation of concerns, scalability, and ease of maintenance.

### 📂 Directory Structure
```text
src/
├── config/             # Centralized configuration (Env, Cloudinary, Stripe)
├── database/           # DB connections and Mongoose models
│   ├── models/         # Data models (User, Product, Order, etc.)
│   └── *.config.js     # DB/Redis connection setups
├── modules/            # Business modules (Auth, Products, Orders, etc.)
│   └── [module_name]/  # Each module contains:
│       ├── controller.js
│       ├── service.js  # Business logic layer
│       ├── routes.js
│       └── validator.js
├── shared/             # Shared utilities & middleware
│   ├── middleware/     # Auth, Error, RateLimit middlewares
│   ├── utils/          # Standardized response, asyncHandler, email utils
│   ├── routes/         # Main router entry point
│   └── automations/    # Scheduled tasks (CRON jobs)
├── app.js              # Express application setup
└── server.js           # Entry point (Server start)
```

## 🚀 Key Improvements

### 1. Standardized Response Format
All API responses now follow a consistent JSON structure:
```json
{
  "success": boolean,
  "message": "Descriptive message",
  "data": { ... },
  "error": { "code": "ERROR_CODE", "details": { ... } }
}
```

### 2. Robust Error Handling
- **Global Error Middleware**: Handles all thrown errors and formats them consistently.
- **ErrorHandler Utility**: Custom class for throwing operational errors with status codes and specific codes.
- **Async Handler**: Replaces `try-catch` blocks in controllers for cleaner code.

### 3. Service Layer Integration
Business logic has been moved from controllers into dedicated service files (e.g., `product.service.js`). This makes controllers thin and allows for easier unit testing of business logic.

### 4. Admin vs Public Routing
Unified routing within modules using role-based middleware (`protectRoute`, `adminRoute`) to clearly separate public and administrative endpoints.

### 5. Centralized Configuration
Environment variables and third-party service configurations (Stripe, Cloudinary) are managed in a structured way in `src/config/env.config.js`.

---

## 🛠 Next Steps
- [ ] Remove old files from the root and legacy directories (`controllers/`, `routes/`, `models/`, `lib/`, `middleware/`, `automations/`, `utils/`).
- [ ] Update frontend API paths if they differed from the new `/api/[module]` structure (though I kept them identical to the original where possible).
- [ ] Add unit tests for the new service layer.
