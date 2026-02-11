
//src/controllers/product.controller.js

const { Product, Category, User } = require("../models");

/**
 * PUBLIC – GET ALL PRODUCTS
 */
exports.getAllProducts = async (req, res) => {
  const products = await Product.findAll({
    where: { is_active: true },
    include: [Category, User],
  });
  res.json(products);
};

/**
 * PUBLIC – GET PRODUCT BY ID
 */
exports.getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [Category, User],
  });

  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

/**
 * SELLER – CREATE PRODUCT
 */
exports.createProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    seller_id: req.user.id,
  });
  res.status(201).json(product);
};

/**
 * SELLER – UPDATE PRODUCT
 */
exports.updateProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.seller_id !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  await product.update(req.body);
  res.json(product);
};

/**
 * SELLER – DELETE PRODUCT
 */
exports.deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.seller_id !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  await product.destroy();
  res.json({ message: "Product deleted" });
};

/**
 * SELLER – LIST OWN PRODUCTS
 */
exports.getSellerProducts = async (req, res) => {
  const products = await Product.findAll({
    where: { seller_id: req.user.id },
  });
  res.json(products);
};

/**
 * SELLER – ENABLE / DISABLE PRODUCT
 */
exports.updateProductStatus = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.seller_id !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  product.is_active = req.body.is_active;
  await product.save();

  res.json({ message: "Product status updated" });
};


