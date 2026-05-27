import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

export const StoreLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] selection:bg-rose-500/20 font-sans">
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="grow pt-16">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
};
