// src/routes/seller.routes.js

const express = require("express");
const router = express.Router();

const sellerController = require("../controllers/seller.controller");
const auth = require("../middlewares/auth.middleware");
const roleCheck = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Seller
 *   description: Seller order and product management APIs
 */

/* ================================
   SELLER ORDER MANAGEMENT
================================ */

/**
 * @swagger
 * /api/seller/orders:
 *   get:
 *     summary: Get all orders for logged-in seller
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of seller orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/orders",
  auth,
  roleCheck(["seller"]),
  sellerController.getSellerOrders
);

/**
 * @swagger
 * /api/seller/order-items/{id}:
 *   get:
 *     summary: Get a specific order item for seller
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order item ID
 *     responses:
 *       200:
 *         description: Order item details
 *       404:
 *         description: Order item not found
 */
router.get(
  "/order-items/:id",
  auth,
  roleCheck(["seller"]),
  sellerController.getSellerOrderItem
);

/**
 * @swagger
 * /api/seller/order-items/{id}/status:
 *   put:
 *     summary: Update order item status (Seller only)
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_item_status_id
 *             properties:
 *               order_item_status_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Order item status updated
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Order item not found
 */
router.put(
  "/order-items/:id/status",
  auth,
  roleCheck(["seller"]),
  sellerController.updateSellerOrderItemStatus
);

/* ================================
   SELLER PRODUCT MANAGEMENT
================================ */

/**
 * @swagger
 * /api/seller/products:
 *   get:
 *     summary: Get all products created by seller
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of seller products
 */
router.get(
  "/products",
  auth,
  roleCheck(["seller"]),
  sellerController.getSellerProducts
);

/**
 * @swagger
 * /api/seller/products:
 *   post:
 *     summary: Create a new product (Seller)
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 15"
 *               description:
 *                 type: string
 *                 example: "Latest Apple smartphone"
 *               price:
 *                 type: number
 *                 example: 79999
 *               stock:
 *                 type: integer
 *                 example: 10
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               sku:
 *                 type: string
 *                 example: "APL-IP15"
 *               discount_price:
 *                 type: number
 *                 example: 74999
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/products",
  auth,
  roleCheck(["seller"]),
  sellerController.addProduct
);

/**
 * @swagger
 * /api/seller/products/{id}:
 *   put:
 *     summary: Update seller product by ID
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock_quantity:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put(
  "/products/:id",
  auth,
  roleCheck(["seller"]),
  sellerController.updateProduct
);

/**
 * @swagger
 * /api/seller/products/{id}:
 *   delete:
 *     summary: Delete seller product
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(
  "/products/:id",
  auth,
  roleCheck(["seller"]),
  sellerController.deleteProduct
);

module.exports = router;
