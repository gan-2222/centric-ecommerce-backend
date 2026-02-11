// src/routes/seller-product.routes.js

const express = require("express");
const router = express.Router();

const sellerController = require("../controllers/seller.controller");
const auth = require("../middlewares/auth.middleware");
const roleCheck = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: SellerProducts
 *   description: Seller product management APIs
 */

/**
 * @swagger
 * /api/seller/products:
 *   get:
 *     summary: Get all products for the logged-in seller
 *     tags: [SellerProducts]
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
 *     summary: Add a new product
 *     tags: [SellerProducts]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               sku:
 *                 type: string
 *               discount_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *     summary: Update a product by ID
 *     tags: [SellerProducts]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               discount_price:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *     summary: Delete a product by ID
 *     tags: [SellerProducts]
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
 *         description: Product deleted successfully
 */
router.delete(
  "/products/:id",
  auth,
  roleCheck(["seller"]),
  sellerController.deleteProduct
);

module.exports = router;
