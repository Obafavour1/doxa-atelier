import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import { StoreLayout } from "./layout/StoreLayout";

// Types
import { useMe } from "./features/auth/api/hooks/hooks";

// Store Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const PurchaseSuccessPage = lazy(() => import("./pages/PurchaseSuccessPage"));
const PurchaseCancelPage = lazy(() => import("./pages/PurchaseCancelPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

// Auth Pages
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OtpVerificationPage = lazy(() => import("./pages/auth/OtpVerificationPage"));
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

const App = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;

  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>}>
        <Routes>
          {/* Store Routes */}
          <Route element={<StoreLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" replace />} />
            <Route path="/my-orders" element={user ? <OrdersPage /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" replace />} />
            <Route path="/purchase-success" element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" replace />} />
            <Route path="/purchase-cancel" element={user ? <PurchaseCancelPage /> : <Navigate to="/login" replace />} />
            
            {/* Auth Routes inside Store Layout for consistent header/footer or outside if preferred */}
            <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" replace />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
            <Route path="/verify-otp" element={!user ? <OtpVerificationPage /> : <Navigate to="/" replace />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
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
