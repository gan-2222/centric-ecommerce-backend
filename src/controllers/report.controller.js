//src/controllers/report.controller.js

const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Order, OrderItem, User, Product, Payment, OrderStatus, PaymentStatus } = require("../models");
const { Op } = require("sequelize");

// ============================
// GET ALL ORDERS REPORT
// ============================
exports.ordersReport = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: User },
      { model: OrderItem, include: [Product] },
      { model: Payment, include: [PaymentStatus] },
      { model: OrderStatus }
    ],
    order: [["createdAt", "DESC"]]
  });

  res.json({ data: orders });
};

// ============================
// SALES ANALYTICS
// ============================
exports.salesAnalytics = async (req, res) => {
  // Example: total sales per day
  const analytics = await Order.findAll({
    attributes: [
      [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
      [sequelize.fn("SUM", sequelize.col("total_amount")), "total_sales"],
      [sequelize.fn("COUNT", sequelize.col("id")), "total_orders"]
    ],
    group: ["date"],
    order: [["date", "DESC"]]
  });

  res.json({ data: analytics });
};

// ============================
// TOP SELLING PRODUCTS
// ============================
exports.topSellingProducts = async (req, res) => {
  const products = await OrderItem.findAll({
    attributes: [
      "product_id",
      [sequelize.fn("SUM", sequelize.col("quantity")), "total_sold"]
    ],
    group: ["product_id"],
    order: [[sequelize.fn("SUM", sequelize.col("quantity")), "DESC"]],
    include: [Product]
  });

  res.json({ data: products });
};


// ============================
// PDF Export - Orders
// ============================
exports.ordersReportPDF = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: User },
      { model: OrderItem, include: [Product] },
      { model: Payment, include: [PaymentStatus] },
      { model: OrderStatus }
    ],
    order: [["createdAt", "DESC"]]
  });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=orders_report.pdf");

  doc.pipe(res);

  doc.fontSize(20).text("Orders Report", { align: "center" });
  doc.moveDown();

  orders.forEach((order) => {
    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`User: ${order.User.full_name} (${order.User.email})`);
    doc.text(`Total Amount: ${order.total_amount}`);
    doc.text(`Status: ${order.OrderStatus.name}`);
    doc.text("Items:");
    order.OrderItems.forEach((item) => {
      doc.text(` - ${item.Product.name} x${item.quantity} @ ${item.price}`);
    });
    doc.moveDown();
  });

  doc.end();
};

// ============================
// Excel Export - Orders
// ============================
exports.ordersReportExcel = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: User },
      { model: OrderItem, include: [Product] },
      { model: Payment, include: [PaymentStatus] },
      { model: OrderStatus }
    ],
    order: [["createdAt", "DESC"]]
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Orders Report");

  sheet.columns = [
    { header: "Order ID", key: "order_id", width: 10 },
    { header: "User Name", key: "user_name", width: 20 },
    { header: "User Email", key: "user_email", width: 25 },
    { header: "Total Amount", key: "total_amount", width: 15 },
    { header: "Order Status", key: "order_status", width: 15 },
    { header: "Items", key: "items", width: 50 }
  ];

  orders.forEach((order) => {
    const itemsText = order.OrderItems.map((i) => `${i.Product.name} x${i.quantity}`).join(", ");
    sheet.addRow({
      order_id: order.id,
      user_name: order.User.full_name,
      user_email: order.User.email,
      total_amount: order.total_amount,
      order_status: order.OrderStatus.name,
      items: itemsText
    });
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=orders_report.xlsx");

  await workbook.xlsx.write(res);
  res.end();
};
