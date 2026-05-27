import Stripe from "stripe";
import { env } from "./env.config.js";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);
