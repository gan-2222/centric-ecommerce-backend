// src/routes/payment.routes.js

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Razorpay payment APIs
 */

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Create Razorpay order
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1499
 *               currency:
 *                 type: string
 *                 example: INR
 *               receipt:
 *                 type: string
 *                 example: receipt_123
 *     responses:
 *       200:
 *         description: Razorpay order created successfully
 *       400:
 *         description: Invalid request
 */
router.post("/create", paymentController.createRazorpayOrder);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify Razorpay payment signature
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_order_id
 *               - razorpay_payment_id
 *               - razorpay_signature
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *                 example: order_Lsdf8sd9fs
 *               razorpay_payment_id:
 *                 type: string
 *                 example: pay_Lsd9f8sdf
 *               razorpay_signature:
 *                 type: string
 *                 example: 5c9a9d9a9d9a9d
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Payment verification failed
 */
router.post("/verify", paymentController.verifyPayment);

module.exports = router;



