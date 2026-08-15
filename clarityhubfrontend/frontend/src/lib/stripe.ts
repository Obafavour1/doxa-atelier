// src/lib/stripe.ts
import { loadStripe } from "@stripe/stripe-js";

// only use publishable key on frontend
export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
);
