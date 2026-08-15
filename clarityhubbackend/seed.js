import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, "../.env") });

import { env } from "./src/config/env.config.js";
import User from "./src/database/models/user.model.js";
import Product from "./src/database/models/product.model.js";
import Coupon from "./src/database/models/coupon.model.js";
import Order from "./src/database/models/order.model.js";
import Settings from "./src/database/models/settings.model.js";
import ShippingZone from "./src/database/models/shipping.model.js";

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected.");

    console.log("Clearing existing sample data...");
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Order.deleteMany({});
    await Settings.deleteMany({});
    // Keep the core admin if possible, delete all customers
    await User.deleteMany({ role: "customer" });

    console.log("Seeding Customers...");
    const customerData = [
      { firstName: "Jane", lastName: "Doe", email: "jane@example.com", password: "password123", role: "customer", accountVerified: true },
      { firstName: "John", lastName: "Smith", email: "john@example.com", password: "password123", role: "customer", accountVerified: true },
      { firstName: "Alice", lastName: "Johnson", email: "alice@example.com", password: "password123", role: "customer", accountVerified: true },
      { firstName: "Bob", lastName: "Williams", email: "bob@example.com", password: "password123", role: "customer", accountVerified: true }
    ];
    const customers = await User.insertMany(customerData);
    console.log(`- Inserted ${customers.length} customers.`);

    console.log("Seeding Products...");
    const productsData = [
      {
        name: "Premium Wireless Headphones",
        description: "High fidelity noise-cancelling wireless headphones with 40h battery life.",
        price: 299.99,
        stock: 45,
        category: "Electronics",
        status: "active",
        isFeatured: true,
        image: "https://placehold.co/600x600/png?text=Headphones"
      },
      {
        name: "Ergonomic Office Chair",
        description: "Breathable mesh back with lumbar support and adjustable arms.",
        price: 199.50,
        stock: 12,
        category: "Furniture",
        status: "active",
        image: "https://placehold.co/600x600/png?text=Office+Chair"
      },
      {
        name: "Mechanical Gaming Keyboard",
        description: "RGB backlit mechanical keyboard with cherry MX blue switches.",
        price: 125.00,
        stock: 150,
        category: "Electronics",
        status: "active",
        image: "https://placehold.co/600x600/png?text=Keyboard"
      },
      {
        name: "Organic Cotton T-Shirt",
        description: "100% organic cotton, ethically sourced everyday t-shirt.",
        price: 25.00,
        stock: 300,
        category: "Clothing",
        status: "active",
        image: "https://placehold.co/600x600/png?text=T-Shirt"
      },
      {
        name: "Smartphone Gimbal Stabilizer",
        description: "3-axis gimbal for ultra smooth smartphone video recording.",
        price: 89.99,
        stock: 8,
        category: "Accessories",
        status: "active",
        image: "https://placehold.co/600x600/png?text=Gimbal"
      }
    ];

    const products = [];
    for (let p of productsData) {
      const prod = await Product.create(p);
      products.push(prod);
    }
    console.log(`- Inserted ${products.length} products.`);

    console.log("Seeding Coupons...");
    const couponsData = [
      { code: "WELCOME20", discountPercentage: 20, maxUses: 100, expirationDate: new Date(Date.now() + 30*24*60*60*1000), isActive: true },
      { code: "SUMMER50", discountPercentage: 50, maxUses: 50, expirationDate: new Date(Date.now() + 10*24*60*60*1000), isActive: true },
      { code: "FALL10", discountPercentage: 10, maxUses: 500, expirationDate: new Date(Date.now() - 24*60*60*1000), isActive: false }
    ];
    const coupons = await Coupon.insertMany(couponsData);
    console.log(`- Inserted ${coupons.length} coupons.`);

    console.log("Seeding Settings...");
    await Settings.create({
      storeName: "DOXA Atelier",
      currency: "USD"
    });
    console.log("- Inserted basic store settings.");

    if((await ShippingZone.countDocuments()) === 0) {
      await ShippingZone.insertMany([
        { name: "North America", regions: ["US", "CA", "MX"] },
        { name: "Europe", regions: ["UK", "DE", "FR", "ES"] }
      ]);
      console.log("- Inserted default shipping zones.");
    }

    console.log("Seeding Orders...");
    const ordersData = [];
    const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    
    // Generate 15 fake orders
    for (let i = 0; i < 15; i++) {
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        const total = randomProduct.price * qty;
        
        ordersData.push({
            user: randomCustomer._id,
            products: [{
                product: randomProduct._id,
                quantity: qty,
                price: randomProduct.price
            }],
            totalAmount: total,
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }
    const orders = await Order.insertMany(ordersData);
    console.log(`- Inserted ${orders.length} mock orders.`);

    console.log("✅ Seeding completed perfectly.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
