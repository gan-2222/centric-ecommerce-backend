//src/routes/admin.routes.js

const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");
const roleCheck = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin order management APIs
 */

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Admin]
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
  "/orders",
  auth,
  roleCheck(["admin"]),
  adminController.getAllOrders
);

/**
 * @swagger
 * /api/admin/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get(
  "/orders/:id",
  auth,
  roleCheck(["admin"]),
  adminController.getOrderById
);

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_status_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 */
router.put(
  "/orders/:id/status",
  auth,
  roleCheck(["admin"]),
  adminController.updateOrderStatus
);

/**
 * @swagger
 * /api/admin/order-items/{id}/status:
 *   put:
 *     summary: Update order item status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_item_status_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order item status updated
 *       404:
 *         description: Order item not found
 */
router.put(
  "/order-items/:id/status",
  auth,
  roleCheck(["admin"]),
  adminController.updateOrderItemStatus
);

module.exports = router;



