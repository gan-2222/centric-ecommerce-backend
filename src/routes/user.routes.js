// src/routes/user.routes.js

const express = require("express");
const router = express.Router();

// ✅ Correct middleware import (NO destructuring)
const auth = require("../middlewares/auth.middleware");

// User controller
const {
  getProfile,
  updateProfile,
  getOrders,
  getOrderById,
} = require("../controllers/user.controller");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and order APIs
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
router.get("/profile", auth, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update logged-in user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: John Doe
 *               email: john@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put("/profile", auth, updateProfile);

/**
 * @swagger
 * /api/users/orders:
 *   get:
 *     summary: Get all orders of logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */
router.get("/orders", auth, getOrders);

/**
 * @swagger
 * /api/users/orders/{id}:
 *   get:
 *     summary: Get order details by ID (logged-in user)
 *     tags: [User]
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
router.get("/orders/:id", auth, getOrderById);

module.exports = router;
