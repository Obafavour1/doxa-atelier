import request from "supertest";
import app from "../src/app.js";
import User from "../src/database/models/user.model.js";
import { createTestUser, getAuthTokens } from "./helpers.js";

describe("User Module Integration Tests", () => {
  let adminToken;
  let customer;
  let customerToken;

  beforeAll(async () => {
    const admin = await createTestUser({ role: "admin", email: "admin@users.com" });
    customer = await createTestUser({ role: "customer", email: "cust@users.com" });
    
    adminToken = (await getAuthTokens(admin)).accessToken;
    customerToken = (await getAuthTokens(customer)).accessToken;
  });

  describe("GET /api/users/profile", () => {
    it("should return the user's own profile", async () => {
      const res = await request(app)
        .get("/api/users/profile")
        .set("Cookie", [`accessToken=${customerToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.data.user._id.toString()).toBe(customer._id.toString());
    });
  });

  describe("GET /api/users/customers (Admin)", () => {
    it("should allow admin to list all customers", async () => {
      const res = await request(app)
        .get("/api/users/customers")
        .set("Cookie", [`accessToken=${adminToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.data.customers).toBeDefined();
    });

    it("should filter customers by segment (e.g., new)", async () => {
      const res = await request(app)
        .get("/api/users/customers?segment=new")
        .set("Cookie", [`accessToken=${adminToken}`]);

      expect(res.status).toBe(200);
    });
  });

  describe("PATCH /api/users/customers/:id/status (Admin)", () => {
    it("should allow admin to suspend a customer", async () => {
      const res = await request(app)
        .patch(`/api/users/customers/${customer._id}/status`)
        .set("Cookie", [`accessToken=${adminToken}`])
        .send({ status: "suspended" });

      expect(res.status).toBe(200);
      const updated = await User.findById(customer._id);
      expect(updated.status).toBe("suspended");
    });
  });
});
