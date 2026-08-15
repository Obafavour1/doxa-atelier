import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import Footer from "./Footer";
import LoadingSpinner from "../shared/components/LoadingSpinner";

export const StoreLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] selection:bg-rose-500/20 font-sans">
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="grow pt-[72px]">
          <Suspense fallback={<LoadingSpinner label="Preparing this page" />}>
            <Outlet />
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
};
