// src/controllers/user.controller.js

const {
  User,
  Order,
  OrderItem,
  Product,
  OrderStatus,
  OrderItemStatus,
  Payment,
} = require("../models");

// ============================
// GET LOGGED-IN USER PROFILE
// ============================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// UPDATE USER PROFILE
// ============================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// GET LOGGED-IN USER ORDERS
// ============================
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: OrderStatus },
        {
          model: OrderItem,
          include: [Product, OrderItemStatus],
        },
        { model: Payment },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// GET USER ORDER BY ID
// ============================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      include: [
        { model: OrderStatus },
        {
          model: OrderItem,
          include: [Product, OrderItemStatus],
        },
        { model: Payment },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
