// src/routes/report.routes.js

const express = require("express");
const router = express.Router();

const reportController = require("../controllers/report.controller");

// ✅ middlewares
const auth = require("../middlewares/auth.middleware");
const roleCheck = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Admin reports and analytics
 */

/**
 * @swagger
 * /api/reports/orders:
 *   get:
 *     summary: Get orders report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders report data
 */
router.get(
  "/orders",
  auth,
  roleCheck(["admin"]),
  reportController.ordersReport
);

/**
 * @swagger
 * /api/reports/analytics/sales:
 *   get:
 *     summary: Get sales analytics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales analytics data
 */
router.get(
  "/analytics/sales",
  auth,
  roleCheck(["admin"]),
  reportController.salesAnalytics
);

/**
 * @swagger
 * /api/reports/analytics/top-products:
 *   get:
 *     summary: Get top selling products
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top selling products list
 */
router.get(
  "/analytics/top-products",
  auth,
  roleCheck(["admin"]),
  reportController.topSellingProducts
);

/**
 * @swagger
 * /api/reports/export/pdf:
 *   get:
 *     summary: Export orders report as PDF
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF file generated
 */
router.get(
  "/export/pdf",
  auth,
  roleCheck(["admin"]),
  reportController.ordersReportPDF
);

/**
 * @swagger
 * /api/reports/export/excel:
 *   get:
 *     summary: Export orders report as Excel
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file generated
 */
router.get(
  "/export/excel",
  auth,
  roleCheck(["admin"]),
  reportController.ordersReportExcel
);

module.exports = router;
