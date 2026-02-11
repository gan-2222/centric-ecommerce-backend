// src/routes/order.routes.js

const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const roleCheck = require("../middlewares/role.middleware");

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/order.controller");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * /api/orders/place:
 *   post:
 *     summary: Place a new order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_id:
 *                 type: integer
 *                 example: 1
 *                 description: Address ID (optional – default address will be used if omitted)
 *               payment_method:
 *                 type: string
 *                 example: "COD"
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid request / cart empty / invalid address
 *       401:
 *         description: Unauthorized
 */
router.post("/place", auth, placeOrder);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get orders of logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Unauthorized
 */
router.get("/my-orders", auth, getMyOrders);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  auth,
  roleCheck(["admin"]),
  getAllOrders
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_status_id
 *             properties:
 *               order_status_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Invalid status transition
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.put(
  "/:id/status",
  auth,
  roleCheck(["admin"]),
  updateOrderStatus
);

module.exports = router;

