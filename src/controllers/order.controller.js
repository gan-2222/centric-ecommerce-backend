//src/controllers/order.controller.js

const { Op } = require("sequelize");
const {
  Order,
  OrderItem,
  Product,
  User,
  Payment,
  PaymentStatus,
  OrderStatus,
  Cart,
  CartItem,
  Address
} = require("../models");

// Allowed admin order status transitions
const ORDER_STATUS_FLOW = {
  1: [2, 5], // PENDING -> CONFIRMED / CANCELLED
  2: [3],    // CONFIRMED -> SHIPPED
  3: [4],    // SHIPPED -> DELIVERED
  4: [],     // DELIVERED (final)
  5: []      // CANCELLED (final)
};

/**
 * PLACE ORDER (FROM CART)
 */
exports.placeOrder = async (req, res) => {
  const t = await Order.sequelize.transaction();

  try {
    const userId = req.user.id;
    let { address_id } = req.body;

    // Resolve / validate address
    if (address_id) {
      const address = await Address.findOne({
        where: { id: address_id, user_id: userId }
      });
      if (!address) {
        await t.rollback();
        return res.status(400).json({
          message: "Invalid address. Please select a valid address."
        });
      }
    } else {
      const defaultAddress = await Address.findOne({
        where: { user_id: userId, is_default: true }
      });
      if (!defaultAddress) {
        await t.rollback();
        return res.status(400).json({
          message: "No default address found. Please add an address."
        });
      }
      address_id = defaultAddress.id;
    }

    // Get cart
    const cart = await Cart.findOne({
      where: { user_id: userId },
      transaction: t
    });

    if (!cart) {
      await t.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      transaction: t
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Lock products only
    const productIds = cartItems.map(i => i.product_id);
    const products = await Product.findAll({
      where: { id: { [Op.in]: productIds }, is_active: true },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    let totalAmount = 0;

    for (const item of cartItems) {
      const product = products.find(p => p.id === item.product_id);
      if (!product) {
        throw new Error("Product not found");
      }
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      product.stock_quantity -= item.quantity;
      await product.save({ transaction: t });

      totalAmount += Number(product.price) * item.quantity;
    }

    // Create order
    const order = await Order.create(
      {
        user_id: userId,
        address_id,
        order_status_id: 1, // PENDING
        total_amount: totalAmount
      },
      { transaction: t }
    );

    // Order items
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.product_id);
      await OrderItem.create(
        {
          order_id: order.id,
          product_id: product.id,
          seller_id: product.seller_id,
          quantity: item.quantity,
          price: product.price,
          order_item_status_id: 1 // PLACED
        },
        { transaction: t }
      );
    }

    // Payment
    await Payment.create(
      {
        order_id: order.id,
        amount: totalAmount,
        payment_status_id: 1 // CREATED
      },
      { transaction: t }
    );

    // Clear cart
    await CartItem.destroy({
      where: { cart_id: cart.id },
      transaction: t
    });

    await t.commit();

    res.status(201).json({
      message: "Order placed successfully",
      order_id: order.id
    });

  } catch (err) {
    await t.rollback();
    console.error("Place order error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET MY ORDERS
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: OrderItem, include: [Product] },
        OrderStatus,
        { model: Payment, include: [PaymentStatus] }
      ],
      order: [["created_at", "DESC"]]
    });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET ALL ORDERS (ADMIN)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        User,
        { model: OrderItem, include: [Product] },
        OrderStatus,
        { model: Payment, include: [PaymentStatus] }
      ],
      order: [["created_at", "DESC"]]
    });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * UPDATE ORDER STATUS (ADMIN ONLY)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_status_id } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const allowedNext = ORDER_STATUS_FLOW[order.order_status_id] || [];
    if (!allowedNext.includes(order_status_id)) {
      return res.status(400).json({
        message: "Invalid order status transition"
      });
    }

    order.order_status_id = order_status_id;
    await order.save();

    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
