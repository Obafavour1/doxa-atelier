import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AdminLayout } from "./layout/AdminLayout";
import { useMe } from "./features/auth/api/hooks/hooks";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminCoupons = lazy(() => import("./pages/admin/Coupons"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminAnalytics = lazy(() => import("./pages/admin/Dashboard"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));

const LoadingScreen = () => (
  <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-primary)]">
    Loading...
  </div>
);

const App = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/password/reset/:token" element={<ResetPasswordPage />} />

          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />
    </>
  );
};

export default App;
