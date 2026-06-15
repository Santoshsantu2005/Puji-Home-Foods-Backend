const Category = require("../models/Category");

// Get Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Category
const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};