const Wishlist = require("../models/Wishlist");

// Add Item
const addToWishlist = async (req, res) => {
  try {
    const exists = await Wishlist.findOne({
  userId: req.body.userId,
  productId: req.body.productId,
});

if (exists) {
  return res.status(400).json({
    message: "Already in wishlist",
  });
}

const item = new Wishlist(req.body);

await item.save();

    res.status(201).json({
      message: "Added To Wishlist",
      item,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Wishlist
const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({
      userId: req.params.userId,
    });

    res.status(200).json(items);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Remove Item
const removeWishlistItem = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Removed From Wishlist",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
};