// src/controllers/seller.controller.js

const {
  Order,
  OrderItem,
  OrderStatus,
  OrderItemStatus,
  Product,
  User,
  Payment,
  Category
} = require("../models");

// Seller order-item status transitions
const ORDER_ITEM_STATUS_FLOW = {
  1: [2, 5], // PLACED -> PROCESSING / CANCELLED
  2: [3],    // PROCESSING -> SHIPPED
  3: [4],    // SHIPPED -> DELIVERED
  4: [],     // DELIVERED
  5: []      // CANCELLED
};

// ---------------- SELLER ORDERS ----------------
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await Order.findAll({
      include: [
        { model: User },
        OrderStatus,
        {
          model: OrderItem,
          where: { seller_id: sellerId },
          include: [Product, OrderItemStatus]
        },
        Payment
      ],
      order: [["created_at", "DESC"]]
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSellerOrderItem = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const item = await OrderItem.findOne({
      where: { id: req.params.id, seller_id: sellerId },
      include: [
        Product,
        OrderItemStatus,
        { model: Order, include: [User, OrderStatus] }
      ]
    });

    if (!item) {
      return res.status(404).json({
        message: "Order item not found for seller"
      });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSellerOrderItemStatus = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { order_item_status_id } = req.body;

    if (!order_item_status_id) {
      return res.status(400).json({
        message: "order_item_status_id is required"
      });
    }

    const item = await OrderItem.findOne({
      where: { id: req.params.id, seller_id: sellerId }
    });

    if (!item) {
      return res.status(404).json({
        message: "Order item not found for seller"
      });
    }

    const allowed = ORDER_ITEM_STATUS_FLOW[item.order_item_status_id] || [];
    if (!allowed.includes(order_item_status_id)) {
      return res.status(400).json({
        message: "Invalid order item status transition"
      });
    }

    item.order_item_status_id = order_item_status_id;
    await item.save();

    res.json({ message: "Order item status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- SELLER PRODUCTS ----------------
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { seller_id: req.user.id },
      order: [["created_at", "DESC"]]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const {
      name,
      description,
      price,
      stock,
      category_id,
      sku,
      discount_price
    } = req.body;

    if (!name || !price || !stock || !category_id) {
      return res.status(400).json({
        message: "name, price, stock, and category_id are required"
      });
    }

    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({ message: "Invalid category_id" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock_quantity: stock,
      category_id,
      seller_id: sellerId,
      sku,
      discount_price
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, seller_id: req.user.id }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found for seller"
      });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, seller_id: req.user.id }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found for seller"
      });
    }

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

