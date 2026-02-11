//src/controllers/admin.controller.js

const {
  Order,
  OrderItem,
  OrderStatus,
  OrderItemStatus,
  User,
  Product,
  Payment,
} = require("../models");

// ============================
// GET ALL ORDERS
// ============================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User },
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
// GET ORDER BY ID
// ============================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: OrderStatus },
        {
          model: OrderItem,
          include: [Product, OrderItemStatus],
        },
        { model: Payment },
      ],
    });

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// UPDATE ORDER STATUS
// ============================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_status_id } = req.body;

    const order = await Order.findByPk(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.order_status_id = order_status_id;
    await order.save();

    res.json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// UPDATE ORDER ITEM STATUS
// ============================
exports.updateOrderItemStatus = async (req, res) => {
  try {
    const { order_item_status_id } = req.body;

    const item = await OrderItem.findByPk(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Order item not found" });

    item.order_item_status_id = order_item_status_id;
    await item.save();

    res.json({ message: "Order item status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
