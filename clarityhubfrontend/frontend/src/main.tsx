import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./shared/components/ScrollToTop.tsx";
import { AppProviders } from "./api/providers/AppProvider.tsx";
// import { AppProviders } from "./app/providers.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <ScrollToTop />
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>
);
