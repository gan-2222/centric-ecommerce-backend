//src/seed.js

require("dotenv").config();
const { sequelize, Role, OrderStatus, OrderItemStatus, PaymentStatus } = require("./models");

(async () => {
  try {
    await sequelize.authenticate();

    // ======================
    // ROLES
    // ======================
    await Role.bulkCreate(
      [
        { name: "customer" },
        { name: "seller" },
        { name: "admin" }
      ],
      { ignoreDuplicates: true }
    );

    // ======================
    // ORDER STATUSES
    // ======================
    await OrderStatus.bulkCreate(
      [
        { name: "PENDING" },
        { name: "CONFIRMED" },
        { name: "SHIPPED" },
        { name: "DELIVERED" },
        { name: "CANCELLED" }
      ],
      { ignoreDuplicates: true }
    );

    // ======================
    // ORDER ITEM STATUSES
    // ======================
    await OrderItemStatus.bulkCreate(
      [
        { name: "PLACED" },
        { name: "PROCESSING" },
        { name: "SHIPPED" },
        { name: "DELIVERED" },
        { name: "CANCELLED" }
      ],
      { ignoreDuplicates: true }
    );

    // ======================
    // PAYMENT STATUSES
    // ======================
    await PaymentStatus.bulkCreate(
      [
        { name: "CREATED" },
        { name: "SUCCESS" },
        { name: "FAILED" }
      ],
      { ignoreDuplicates: true }
    );

    console.log("✅ Seed data inserted successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
})();
