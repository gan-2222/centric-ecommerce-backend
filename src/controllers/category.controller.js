    // src/controllers/category.controller.js

const { Category } = require("../models");

/**
 * ADMIN – CREATE CATEGORY
 */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      message: "Category created successfully",
      category
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUBLIC – GET ACTIVE CATEGORIES
 */
exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [["created_at", "DESC"]]
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN – UPDATE CATEGORY
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name !== undefined) category.name = name;
    if (is_active !== undefined) category.is_active = is_active;

    await category.save();

    res.json({
      message: "Category updated successfully",
      category
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN – DELETE CATEGORY
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
