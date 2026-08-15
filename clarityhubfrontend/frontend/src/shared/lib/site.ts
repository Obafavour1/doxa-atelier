import { apiBaseUrl } from "../../api/baseUrl";

export const appConfig = {
  name: "DOXAHub Commerce",
  shortName: "DOXAHub",
  description:
    "A premium commerce workspace for discovery, fast purchasing, and operator-grade merchandising.",
  apiBaseUrl,
  authType: "JWT via httpOnly cookie session",
} as const;

export const primaryNavigation = [
  { label: "Catalog", href: "/" },
  { label: "Collections", href: "/category/jeans" },
  { label: "Cart", href: "/cart" },
  { label: "Operator", href: "/secret-dashboard" },
] as const;

export const productCategories = [
  {
    slug: "jeans",
    name: "Structured Denim",
    description: "Everyday staples with elevated finishing and all-day wearability.",
    imageUrl: "/jeans.jpg",
  },
  {
    slug: "t-shirts",
    name: "Core Layers",
    description: "Breathable essentials designed for repeat wear and clean silhouettes.",
    imageUrl: "/tshirts.jpg",
  },
  {
    slug: "shoes",
    name: "Transit Footwear",
    description: "Reliable pairs for commuting, weekend movement, and hybrid workdays.",
    imageUrl: "/shoes.jpg",
  },
  {
    slug: "bags",
    name: "Carry Systems",
    description: "Utility-first bags with polished materials and modular storage.",
    imageUrl: "/bags.jpg",
  },
] as const;

export const dashboardMetrics = [
  { label: "Merchandising accuracy", value: "98.2%", detail: "Feed freshness across high-volume SKUs" },
  { label: "Repeat shopper lift", value: "+27%", detail: "30-day returning customer trend" },
  { label: "Checkout completion", value: "81%", detail: "Sessions completing purchase from cart" },
] as const;
