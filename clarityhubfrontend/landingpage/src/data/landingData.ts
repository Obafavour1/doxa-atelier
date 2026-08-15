import type { LucideIcon } from "lucide-react";
import { Gift, PackageCheck, ShieldCheck, Truck } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
};

export type Collection = {
  id: string;
  title: string;
  text: string;
  image: string;
  badge: string;
};

export type Product = {
  title: string;
  category: string;
  categoryId: string;
  image: string;
  rating: string;
  badge: string;
  description: string;
};

export type Benefit = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
};

export const navItems: NavItem[] = [
  { label: "Collections", href: "#collections" },
  { label: "Gift catalog", href: "#gifts" },
  { label: "Best sellers", href: "#products" },
  { label: "Experience", href: "#experience" },
  { label: "Reviews", href: "#reviews" },
];

export const collections: Collection[] = [
  {
    id: "personalized",
    title: "Personalized keepsakes",
    text: "Custom notes, journals, photo cards, name details, and message pieces made for one recipient.",
    image: "/assets/personalized-box.jpg",
    badge: "Signature",
  },
  {
    id: "faith",
    title: "Faith and encouragement",
    text: "Scripture cards, prayer journals, devotionals, affirmation pieces, and gifts that comfort the soul.",
    image: "/assets/luxe-box.jpg",
    badge: "Meaningful",
  },
  {
    id: "wellness",
    title: "Lifestyle and wellness",
    text: "Self-care, beauty, fragrance, comfort, and premium add-ons arranged with atelier-level polish.",
    image: "/assets/beauty-box.jpg",
    badge: "Curated",
  },
];

export const products: Product[] = [
  {
    title: "The Celebration Atelier Box",
    category: "Birthday / milestone",
    categoryId: "celebration",
    image: "/assets/hero-gift-set.jpg",
    rating: "4.9",
    badge: "Fast gift",
    description: "A polished occasion-ready box for birthdays, congratulations, and memorable milestone surprises.",
  },
  {
    title: "Soft Bloom Wellness Set",
    category: "Self-care / beauty",
    categoryId: "wellness",
    image: "/assets/beauty-box.jpg",
    rating: "4.8",
    badge: "Self care",
    description: "A calm, tender edit with beauty, comfort, and thoughtful details for rest-focused gifting.",
  },
  {
    title: "Grace Notes Gift Edit",
    category: "Faith / encouragement",
    categoryId: "faith",
    image: "/assets/luxe-box.jpg",
    rating: "5.0",
    badge: "Encouraging",
    description: "Faith-led gifting with scripture cards, devotion-inspired touches, and warm presentation.",
  },
  {
    title: "Personal Story Keepsake",
    category: "Custom / sentimental",
    categoryId: "personalized",
    image: "/assets/personalized-box.jpg",
    rating: "4.9",
    badge: "Bestseller",
    description: "Personalized notes, names, memories, and keepsake pieces shaped around the recipient story.",
  },
  {
    title: "Quiet Luxury Thank You Box",
    category: "Gratitude / corporate",
    categoryId: "gratitude",
    image: "/assets/luxe-box.jpg",
    rating: "4.9",
    badge: "Corporate",
    description: "A refined appreciation box for clients, hosts, mentors, teams, and meaningful thank-you moments.",
  },
  {
    title: "Blush Birthday Ritual",
    category: "Birthday / celebration",
    categoryId: "celebration",
    image: "/assets/personalized-box.jpg",
    rating: "4.8",
    badge: "Birthday",
    description: "A celebratory gift edit with soft color, premium packaging, and a card-ready emotional finish.",
  },
  {
    title: "Comfort and Care Package",
    category: "Healing / support",
    categoryId: "wellness",
    image: "/assets/beauty-box.jpg",
    rating: "5.0",
    badge: "Support",
    description: "Gentle self-care and encouragement for recovery, loss, distance, or a friend who needs tenderness.",
  },
  {
    title: "The Prayerful Keepsake",
    category: "Faith / personalized",
    categoryId: "faith",
    image: "/assets/hero-gift-set.jpg",
    rating: "4.9",
    badge: "Prayer",
    description: "A faith-centered gift with keepsake notes, prayer prompts, and a deeply personal presentation.",
  },
];

export const giftCategories = [
  { id: "all", label: "All gifts" },
  { id: "celebration", label: "Celebration" },
  { id: "personalized", label: "Personalized" },
  { id: "faith", label: "Faith" },
  { id: "wellness", label: "Wellness" },
  { id: "gratitude", label: "Gratitude" },
];

export const categoryHeroCopy: Record<string, string> = {
  all: "Browse the complete DOXA gift catalog, then continue to the ecommerce store when you are ready to shop.",
  celebration: "Birthday, milestone, congratulations, and joy-filled edits for moments worth marking beautifully.",
  personalized: "Keepsake-led gifts with custom notes, names, memories, and recipient-specific finishing touches.",
  faith: "Scripture, encouragement, prayerful details, and faith-led gifting for the soul.",
  wellness: "Soft self-care, beauty, comfort, and care packages for rest, healing, and tenderness.",
  gratitude: "Refined appreciation gifts for clients, mentors, hosts, friends, teams, and thank-you moments.",
};

export const occasions = [
  "Birthdays",
  "Thank you",
  "Faith encouragement",
  "Self-care",
  "Corporate gifting",
  "Healing support",
];

export const benefits: Benefit[] = [
  { icon: Gift, title: "Curated with intention", text: "Every box is designed around the recipient, occasion, budget, and emotional message." },
  { icon: ShieldCheck, title: "Secure payments", text: "Checkout-ready, trust-first purchasing patterns with clear delivery expectations." },
  { icon: Truck, title: "Fast delivery options", text: "Prepared for local moments, scheduled surprises, and planned celebration windows." },
  { icon: PackageCheck, title: "Premium finish", text: "Layered packaging, ribbons, cards, textures, and thoughtful details in every order." },
];

export const stats = [
  { value: "10k+", label: "Happy recipients" },
  { value: "4.9", label: "Average rating" },
  { value: "24h", label: "Gift request response" },
  { value: "100+", label: "Occasions styled" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "DOXA Atelier offered a good gift service. My friend was glad to receive the gifts. The delivery service was quick, friendly, and reasonably priced.",
    name: "Amara O.",
    detail: "Birthday surprise",
  },
  {
    quote: "The package felt personal from the card to the ribbon. It said exactly what I wanted to communicate.",
    name: "Tobi A.",
    detail: "Appreciation gift",
  },
  {
    quote: "Elegant, thoughtful, and beautifully arranged. It felt like more than a box.",
    name: "Maya C.",
    detail: "Wellness edit",
  },
];
