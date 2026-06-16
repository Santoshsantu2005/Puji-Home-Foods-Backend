const Product = require("../models/Product")

// GET ALL PRODUCTS
const getProducts = async (req, res) => {

  try {

    const products = await Product.find()

    const formattedProducts = products.map((p) => ({

      id: p._id,

      name: p.name,

      category: p.category,

      image: p.image,

      price: p.prices?.["1kg"] || 0,

      description: p.description || "",

      totalStock: p.totalStock,

      stockStatus: p.stockStatus

    }))

    res.json(formattedProducts)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
}

// CREATE PRODUCT
const createProduct = async (req, res) => {

  try {

    const product = new Product(req.body)

    const savedProduct = await product.save()

    res.status(201).json(savedProduct)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
}

// UPDATE PRODUCT
const updateProduct = async (req, res) => {

  try {

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedProduct)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
}

// DELETE PRODUCT
const deleteProduct = async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id)

    res.json({
      message: "Product Deleted Successfully"
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = {

  getProducts,
  createProduct,
  updateProduct,
  deleteProduct

}