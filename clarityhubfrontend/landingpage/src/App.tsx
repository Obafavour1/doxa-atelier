import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { Benefits } from "./components/sections/Benefits";
import { Categories } from "./components/sections/Categories";
import { Editorial } from "./components/sections/Editorial";
import { Experience } from "./components/sections/Experience";
import { GiftCatalog } from "./components/sections/GiftCatalog";
import { Hero } from "./components/sections/Hero";
import { Newsletter } from "./components/sections/Newsletter";
import { Occasions } from "./components/sections/Occasions";
import { Products } from "./components/sections/Products";
import { SocialProof } from "./components/sections/SocialProof";
import { GiftsPage } from "./pages/GiftsPage";

export default function App() {
  const isGiftPage = window.location.pathname === "/gifts";

  return (
    <>
      <Navbar />
      {isGiftPage ? (
        <GiftsPage />
      ) : (
        <main className="overflow-hidden">
          <Hero />
          <Categories />
          <GiftCatalog />
          <Products />
          <Occasions />
          <Benefits />
          <SocialProof />
          <Experience />
          <Editorial />
          <Newsletter />
        </main>
      )}
      <Footer />
    </>
  );
}
