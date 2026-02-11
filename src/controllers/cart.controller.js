// src/controllers/cart.controller.js

const { Cart, CartItem, Product } = require("../models");

exports.getCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{ model: CartItem, include: [Product] }]
    });

    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { product_id, quantity = 1 } = req.body;

    // ---------------- VALIDATION ----------------
    if (!product_id || quantity <= 0) {
      return res.status(400).json({
        message: "product_id and valid quantity are required"
      });
    }

    // ✅ CHECK PRODUCT EXISTS & IS ACTIVE
    const product = await Product.findOne({
      where: {
        id: product_id,
        is_active: true
      }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found or inactive"
      });
    }

    // ✅ OPTIONAL: STOCK CHECK
    if (product.stock_quantity !== null && quantity > product.stock_quantity) {
      return res.status(400).json({
        message: "Insufficient product stock"
      });
    }

    let cart = await Cart.findOne({
      where: { user_id: req.user.id }
    });

    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
    }

    const item = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id
      }
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity
      });
    }

    res.status(201).json({
      message: "Item added to cart successfully"
    });
  } catch (err) {
    console.error("Add to cart error:", err);

    // ✅ DEFENSIVE FK HANDLING (extra safety)
    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: "Invalid product reference"
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const item = await CartItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;
    await item.save();

    res.json({ message: "Cart item updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const item = await CartItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.destroy();
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await Cart.findOne({
      where: { user_id: req.user.id }
    });

    if (!cart) {
      return res.json({ message: "Cart already empty" });
    }

    await CartItem.destroy({
      where: { cart_id: cart.id }
    });

    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
