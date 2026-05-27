// src/shared/lib/stripe.ts
import { loadStripe } from "@stripe/stripe-js";

// only use publishable key on frontend
export const stripePromise = loadStripe(
  import.meta.env.STRIPE_PUBLISHABLE_KEY as string
);
