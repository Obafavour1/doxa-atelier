import request from "supertest";
import app from "../src/app.js";
import Order from "../src/database/models/order.model.js";
import { createTestUser, getAuthTokens } from "./helpers.js";

describe("Order Module Integration Tests", () => {
  let adminToken;
  let customer;
  let customerToken;

  beforeAll(async () => {
    const admin = await createTestUser({ role: "admin", email: "admin@orders.com" });
    customer = await createTestUser({ role: "customer", email: "cust@orders.com" });
    
    adminToken = (await getAuthTokens(admin)).accessToken;
    customerToken = (await getAuthTokens(customer)).accessToken;
  });

  describe("GET /api/orders/my-orders", () => {
    it("should return user orders", async () => {
      await Order.create({
        user: customer._id,
        products: [],
        totalAmount: 5000,
        status: "paid",
        stripeSessionId: "sess_123",
      });

      const res = await request(app)
        .get("/api/orders/my-orders")
        .set("Cookie", [`accessToken=${customerToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.data.orders.length).toBe(1);
    });
  });

  describe("PATCH /api/orders/:id/status (Admin)", () => {
    it("should allow admin to update order status", async () => {
      const order = await Order.create({
        user: customer._id,
        products: [],
        totalAmount: 5000,
        status: "processing",
        stripeSessionId: "sess_456",
      });

      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .set("Cookie", [`accessToken=${adminToken}`])
        .send({ status: "shipped", message: "Out for delivery" });

      expect(res.status).toBe(200);
      const updated = await Order.findById(order._id);
      expect(updated.status).toBe("shipped");
      expect(updated.timeline.length).toBeGreaterThan(0);
    });
  });
});
