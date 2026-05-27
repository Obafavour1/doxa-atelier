import { Router } from "express";
import * as productController from "./product.controller.js";
import { protectRoute, adminRoute } from "../../shared/middleware/auth.middleware.js";

/**
 * @openapi
 * /products/featured:
 *   get:
 *     summary: Get all featured products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully fetched featured products.
 */

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new product (Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, category, stock]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *               stock: { type: number }
 *               image: { type: string, description: "Base64 image string" }
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       403:
 *         description: Unauthorized - Admin role required.
 */

const router = Router();

// --- Public Routes ---
router.get("/featured", productController.getFeaturedProducts);

/**
 * @openapi
 * /products/recommendations:
 *   get:
 *     summary: Get recommended products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of recommended products.
 */
router.get("/recommendations", productController.getRecommendedProducts);

/**
 * @openapi
 * /products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query string
 *         required: true
 *     responses:
 *       200:
 *         description: Search results.
 */
router.get("/search", productController.searchProducts);

/**
 * @openapi
 * /products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Products in the specified category.
 */
router.get("/category/:category", productController.getProductsByCategory);

/**
 * @openapi
 * /products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product details.
 *       404:
 *         description: Product not found.
 */
router.get("/slug/:slug", productController.getProductBySlug);

// --- Admin Routes ---
router.use(protectRoute, adminRoute);

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products (Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all products.
 */
router.get("/", productController.getAllProductsAdmin);

/**
 * @openapi
 * /products/low-stock:
 *   get:
 *     summary: Get low stock products (Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of items with low stock.
 */
router.get("/low-stock", productController.getLowStockProducts);
router.post("/", productController.createProduct);

/**
 * @openapi
 * /products/bulk:
 *   patch:
 *     summary: Bulk update products (Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 price: { type: number }
 *                 stock: { type: number }
 *     responses:
 *       200:
 *         description: Products updated.
 */
router.patch("/bulk", productController.bulkUpdateProducts);

/**
 * @openapi
 * /products/bulk:
 *   delete:
 *     summary: Bulk delete products (Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Products deleted.
 */
router.delete("/bulk", productController.bulkDeleteProducts);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get product details (Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Product details.
 */
router.get("/:id", productController.getAdminProductDetails);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update product (Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               stock: { type: number }
 *     responses:
 *       200:
 *         description: Product updated.
 */
router.put("/:id", productController.updateProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete product (Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Product deleted.
 */
router.delete("/:id", productController.deleteProduct);

/**
 * @openapi
 * /products/{id}/featured:
 *   patch:
 *     summary: Toggle product featured status (Admin)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Status toggled.
 */
router.patch("/:id/featured", productController.toggleFeaturedProduct);

export default router;
