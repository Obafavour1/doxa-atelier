import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, Gift, Heart, PackageCheck, Sparkles, Star, Truck } from "lucide-react";
import "./styles.css";

const collections = [
  {
    title: "Personalized keepsakes",
    text: "Custom name journals, handwritten notes, photo cards, and message pieces that make the recipient feel seen.",
    image: "/assets/personalized-box.jpg",
  },
  {
    title: "Faith and encouragement",
    text: "Scripture cards, prayer journals, affirmation cards, devotional gifts, and uplifting words for the soul.",
    image: "/assets/luxe-box.jpg",
  },
  {
    title: "Lifestyle and wellness",
    text: "Curated self-care, beauty, fashion, comfort, and add-on treats arranged with premium presentation.",
    image: "/assets/beauty-box.jpg",
  },
];

const features = [
  { icon: Gift, title: "Curated with intention", text: "Each box is built around the person, the moment, and the message you want to send." },
  { icon: Heart, title: "Emotion-first gifting", text: "Words, textures, keepsakes, and packaging come together as one memorable experience." },
  { icon: PackageCheck, title: "Personalized finish", text: "Names, notes, cards, colors, ribbons, and add-ons make every order feel specific." },
  { icon: Truck, title: "Standard delivery", text: "Order ahead for carefully prepared packages with delivery options for local moments." },
];

const steps = ["Choose the occasion", "Share the recipient story", "Approve the curated direction", "Send a gift they remember"];

const testimonials = [
  "DOXA Gift Atelier offered a good gift service. My friend was glad to receive the gifts. The delivery service was quick, friendly, and very reasonably priced.",
  "The package felt personal from the card to the ribbon. It said exactly what I wanted to communicate.",
  "Elegant, thoughtful, and beautifully arranged. It felt like more than a box.",
];

function Button({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <a className={`button ${variant}`} href={variant === "primary" ? "#order" : "#collections"}>
      {children}
      <ArrowRight size={18} />
    </a>
  );
}

function App() {
  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#">
          <img src="/assets/logo-wide.png" alt="DOXA Gift Atelier" />
        </a>
        <div className="nav-links">
          <a href="#collections">Collections</a>
          <a href="#experience">Experience</a>
          <a href="#reviews">Reviews</a>
        </div>
        <a className="nav-cta" href="#order">Order</a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Where every gift becomes an experience</p>
          <h1>DOXA Gift Atelier</h1>
          <p className="hero-text">
            Thoughtfully curated gift boxes designed to help you appreciate, celebrate, and truly connect with people.
          </p>
          <div className="hero-actions">
            <Button>Start a gift request</Button>
            <Button variant="secondary">Explore collections</Button>
          </div>
        </div>
        <div className="hero-media" aria-label="Curated DOXA gift presentation">
          <img src="/assets/hero-gift-set.jpg" alt="DOXA gift box with curated items" />
          <div className="floating-note">
            <Sparkles size={18} />
            <span>Curated with love, made to be remembered.</span>
          </div>
        </div>
      </section>

      <section className="feature-strip" aria-label="Brand values">
        {features.map((feature) => (
          <article key={feature.title}>
            <feature.icon size={22} />
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <section className="section" id="collections">
        <div className="section-heading">
          <p className="eyebrow">Gift categories</p>
          <h2>Built for birthdays, celebrations, healing, gratitude, faith, and personal moments.</h2>
        </div>
        <div className="collection-grid">
          {collections.map((item) => (
            <article className="collection-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="experience" id="experience">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>We communicate the words in your heart through gifts and surprises.</h2>
        </div>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="reviews" id="reviews">
        <div className="section-heading">
          <p className="eyebrow">Client reviews</p>
          <h2>Meaningful gifts, memorable reactions.</h2>
        </div>
        <div className="review-grid">
          {testimonials.map((quote) => (
            <blockquote key={quote}>
              <div className="stars" aria-label="Five star rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" />
                ))}
              </div>
              <p>{quote}</p>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="cta" id="order">
        <div>
          <p className="eyebrow">Pre-order available</p>
          <h2>Personalized, beautifully packaged, and prepared with care.</h2>
          <p>Send a message with your occasion, budget, recipient details, and preferred delivery date.</p>
        </div>
        <a className="button primary" href="https://instagram.com/doxa.atelier">
          Message @doxa.atelier
          <ArrowRight size={18} />
        </a>
      </section>

      <footer>
        <img src="/assets/logo-wide.png" alt="DOXA Gift Atelier" />
        <div>
          <a href="#collections">Collections</a>
          <a href="#experience">Experience</a>
          <a href="#order">Order</a>
        </div>
        <p>Regina, Saskatchewan, Canada · +1 306 539 0230</p>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
