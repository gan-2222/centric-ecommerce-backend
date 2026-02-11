//src/routes/address.routes.js


const express = require("express");
const router = express.Router();
const controller = require("../controllers/address.controller");
const auth = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: User address management APIs
 */

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get all addresses of logged-in user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   address_line1:
 *                     type: string
 *                   address_line2:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postal_code:
 *                     type: string
 *                   country:
 *                     type: string
 *                   is_default:
 *                     type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, controller.getMyAddresses);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Add a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_line1
 *               - city
 *               - state
 *               - postal_code
 *               - country
 *             properties:
 *               address_line1:
 *                 type: string
 *                 example: "Flat 201, MG Road"
 *               address_line2:
 *                 type: string
 *                 example: "Near Metro Station"
 *               city:
 *                 type: string
 *                 example: "Hyderabad"
 *               state:
 *                 type: string
 *                 example: "Telangana"
 *               postal_code:
 *                 type: string
 *                 example: "500081"
 *               country:
 *                 type: string
 *                 example: "India"
 *               is_default:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Address created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, controller.createAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an existing address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_line1:
 *                 type: string
 *               address_line2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               country:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", auth, controller.updateAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", auth, controller.deleteAddress);

module.exports = router;
