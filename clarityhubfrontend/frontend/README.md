<!-- PROJECT LOGO -->
<p align="center">
  <h1 align="center">DOXA Atelier Storefront</h1>
  <p align="center">
    A modern, full-featured e-commerce web application built with React, TypeScript, Zustand, and Vite.
    <br />
    <a href="#getting-started"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#features">Features</a>
    ·
    <a href="#project-structure">Project Structure</a>
    ·
    <a href="#deployment">Deployment</a>
    ·
    <a href="#contributing">Contributing</a>
  </p>
</p>

---

## 🚀 Features

- ⚡ **Fast & Modern Stack**: React 19, TypeScript, Vite, Zustand, TailwindCSS
- 🔒 **Authentication**: JWT (httpOnly cookie) login/signup, protected routes, persistent sessions
- 🛒 **Shopping Cart**: Add, remove, update items; coupon support; order summary
- 📦 **Product Management**: Browse, filter by category, featured products, admin product creation
- 📊 **Admin Dashboard**: Analytics (users, sales, revenue), product management, create/edit/delete products
- 💳 **Stripe Integration**: (Planned/Optional) for secure payments
- 🎨 **Responsive UI**: Mobile-first, beautiful design with TailwindCSS and Framer Motion
- 🔥 **Notifications**: Toasts for feedback on actions
- 🧩 **Component-based**: Reusable, maintainable codebase

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Charts**: Recharts
- **UI/UX**: Lucide Icons, Framer Motion, React Hot Toast
- **HTTP**: Axios (with credentials for httpOnly cookies)
- **Testing/Linting**: ESLint, TypeScript

## 📦 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/Obafavour1/claritystorefrontend.git
cd clarityhubfrontend/frontend
npm install
```

### Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or as specified by Vite).

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## 🗂️ Project Structure

```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route pages (Home, Login, Cart, Admin, etc.)
│   ├── stores/            # Zustand stores (user, cart, product)
│   ├── lib/               # Utilities (axios instance, helpers, data)
│   ├── App.tsx            # Main app component, routing, guards
│   └── main.tsx           # Entry point
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🔑 Key Concepts

- **Authentication**: Uses JWT in httpOnly cookies. User state is managed in Zustand and persisted.
- **Route Guards**: `PrivateRoute` and `AdminRoute` components protect sensitive pages.
- **Cart**: Zustand-powered, supports coupons and order summary.
- **Admin**: Create, edit, delete products; view analytics.
- **API**: All requests go through a pre-configured Axios instance (`src/lib/axios.ts`).

## ⚙️ Environment Variables

Create a `.env` file in the `frontend` directory:

```
VITE_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Deploying to Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. Set the environment variable `VITE_URL` in the Vercel dashboard to your backend API URL.
4. Click Deploy. Vercel will handle the build and deployment process.

### Deploying to Netlify

1. Push your code to GitHub.
2. Go to [Netlify](https://www.netlify.com/) and import your repository.
3. Set the environment variable `VITE_URL` in the Netlify dashboard to your backend API URL.
4. Set the build command to `npm run build` and the publish directory to `dist`.
5. Click Deploy.

### Deploying Manually (Static Hosting)

1. Build the app:
   ```bash
   npm run build
   ```
2. Upload the contents of the `dist` folder to your static hosting provider (e.g., Netlify, Vercel, Firebase Hosting, S3, etc).

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## 📄 License

[MIT](LICENSE)
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,

```

```
