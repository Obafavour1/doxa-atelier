import mongoose from "mongoose";
import { env } from "./src/config/env.config.js";
import Product from "./src/database/models/product.model.js";
import { redis } from "./src/database/redis.config.js";

const catalog = [
  ["DOXA-SIG-001", "The Signature Gift Box", "gift-boxes", 89, 36, "A refined edit of keepsakes, treats, and a handwritten note for effortless thoughtful giving.", "/doxa-nav-gift-collection.png", ["bestseller", "curated"]],
  ["DOXA-SIG-002", "Tea, Treats & Gratitude Box", "gift-boxes", 68, 42, "Comforting tea, artisan treats, and gratitude details arranged for a warm, memorable unboxing.", "/doxa-hero.jpg", ["thank-you", "comfort"]],
  ["DOXA-SIG-003", "The Luxe Evening Box", "gift-boxes", 145, 18, "An elevated evening collection with premium details for milestones and meaningful celebrations.", "/doxa-luxe-box.jpg", ["premium", "celebration"]],

  ["DOXA-BDAY-001", "Birthday Glow Box", "birthday-gifts", 76, 30, "A bright birthday edit with celebratory treats, a candle, and a personal message card.", "/doxa-personalized-box.jpg", ["birthday", "celebration"]],
  ["DOXA-BDAY-002", "Make a Wish Celebration Crate", "birthday-gifts", 112, 22, "A generous birthday crate filled with joyful details designed to make their day feel exceptional.", "/doxa-nav-gift-collection.png", ["birthday", "premium"]],
  ["DOXA-BDAY-003", "Little Joy Birthday Parcel", "birthday-gifts", 52, 50, "A compact, joy-filled birthday surprise for a thoughtful gesture that still feels beautifully complete.", "/doxa-beauty-box.jpg", ["birthday", "under-75"]],

  ["DOXA-CARE-001", "The Bloom Self-Care Box", "self-care", 84, 40, "A restorative ritual of calming candlelight, reflection, and gentle everyday care.", "/doxa-beauty-box.jpg", ["self-care", "bestseller"]],
  ["DOXA-CARE-002", "Slow Sunday Wellness Set", "self-care", 72, 34, "Soft comforts curated for an unrushed morning, a quiet reset, and meaningful rest.", "/doxa-hero.jpg", ["wellness", "under-75"]],
  ["DOXA-CARE-003", "Rest & Renew Ritual Box", "self-care", 118, 20, "A premium wellbeing collection created for deep rest, reflection, and renewed energy.", "/doxa-luxe-box.jpg", ["wellness", "premium"]],

  ["DOXA-FAITH-001", "Grace for Today Box", "faith-encouragement", 79, 32, "Faith-filled prompts, a keepsake journal, and uplifting details for everyday encouragement.", "/doxa-hero.jpg", ["faith", "encouragement"]],
  ["DOXA-FAITH-002", "Hope & Healing Care Package", "faith-encouragement", 94, 25, "A tender collection for seasons of healing, offering comfort, hope, and words that stay.", "/doxa-personalized-box.jpg", ["healing", "care-package"]],
  ["DOXA-FAITH-003", "Answered Prayers Journal Set", "faith-encouragement", 58, 46, "A thoughtful journal-led set for gratitude, prayer, and recording meaningful moments.", "/doxa-luxe-box.jpg", ["faith", "journal", "under-75"]],

  ["DOXA-PERS-001", "Personalized Keepsake Box", "personalized-gifts", 105, 24, "A name-personalized keepsake collection designed around the recipient and their story.", "/doxa-personalized-box.jpg", ["personalized", "keepsake"]],
  ["DOXA-PERS-002", "A Note Just for You Box", "personalized-gifts", 64, 38, "A beautifully compact gift made personal with a custom message and thoughtful finishing details.", "/doxa-nav-gift-collection.png", ["personalized", "under-75"]],
  ["DOXA-PERS-003", "The Memory Maker Collection", "personalized-gifts", 132, 16, "A premium personalized collection for milestones, memories, and stories worth preserving.", "/doxa-luxe-box.jpg", ["personalized", "premium"]],

  ["DOXA-CORP-001", "Executive Appreciation Hamper", "corporate-gifting", 165, 28, "An executive-level hamper for client appreciation, leadership milestones, and distinguished thanks.", "/doxa-luxe-box.jpg", ["corporate", "premium"]],
  ["DOXA-CORP-002", "Team Celebration Gift Box", "corporate-gifting", 98, 60, "A polished team gift that makes recognition feel personal, warm, and genuinely considered.", "/doxa-nav-gift-collection.png", ["corporate", "team"]],
  ["DOXA-CORP-003", "Client Welcome Collection", "corporate-gifting", 125, 44, "A memorable welcome gift designed to begin client relationships with care and distinction.", "/doxa-personalized-box.jpg", ["corporate", "client-gift"]],
].map(([sku, name, category, price, stock, description, image, tags], index) => ({
  sku,
  name,
  slug: String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  category,
  price,
  stock,
  description,
  image,
  tags,
  status: "active",
  isFeatured: index % 3 === 0,
  seo: { title: `${name} | DOXA Atelier`, description },
}));

const seedProducts = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    const operations = catalog.map((product) => ({
      updateOne: {
        filter: { sku: product.sku },
        update: { $set: product },
        upsert: true,
      },
    }));
    const result = await Product.bulkWrite(operations);
    await redis.del("featured_products");
    console.log(`Gift catalog ready: ${result.upsertedCount} added, ${result.modifiedCount} updated, ${catalog.length} total.`);
  } catch (error) {
    console.error("Product seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    await redis.quit();
  }
};

seedProducts();
