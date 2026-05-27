import request from "supertest";
import app from "../src/app.js";
import Product from "../src/database/models/product.model.js";
import { createTestUser, getAuthTokens } from "./helpers.js";

describe("Product Module Integration Tests", () => {
  let adminToken;
  let customerToken;

  beforeAll(async () => {
    const admin = await createTestUser({ role: "admin", email: "admin@prod.com" });
    const customer = await createTestUser({ role: "customer", email: "cust@prod.com" });
    
    const adminAuth = await getAuthTokens(admin);
    const customerAuth = await getAuthTokens(customer);
    
    adminToken = adminAuth.accessToken;
    customerToken = customerAuth.accessToken;
  });

  describe("GET /api/products/featured", () => {
    it("should fetch featured products", async () => {
      await Product.create({
        name: "Featured Item",
        price: 100,
        category: "Test",
        isFeatured: true,
        slug: "featured-item",
        image: "test.jpg",
      });

      const res = await request(app).get("/api/products/featured");
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/products (Admin)", () => {
    it("should allow admin to create a product", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send({
          name: "New Gadget",
          price: 299,
          stock: 50,
          category: "Tech",
          sku: "GAD-001",
          image: "gadget.jpg",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.product.name).toBe("New Gadget");
    });

    it("should deny access to customers", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Cookie", [`accessToken=${customerToken}`])
        .send({ name: "Cheat Item" });

      expect(res.status).toBe(403);
    });

    it("should deny access to unauthorized users", async () => {
      const res = await request(app).post("/api/products").send({ name: "Ghost Item" });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/products/search", () => {
    it("should find products by keyword", async () => {
      await Product.create({
        name: "Cool Laptop",
        price: 1500,
        category: "Computers",
        slug: "cool-laptop",
        image: "laptop.jpg",
      });

      const res = await request(app).get("/api/products/search?keyword=laptop");
      expect(res.status).toBe(200);
      expect(res.body.data.products[0].name).toContain("Laptop");
    });
  });
});
