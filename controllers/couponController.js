const Coupon = require("../models/Coupon");

// Get All Coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json(coupons);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create Coupon
const createCoupon = async (req, res) => {
  try {
    console.log("COUPON BODY:", req.body);

    const coupon = await Coupon.create(req.body);

    res.status(201).json(coupon);
  } catch (error) {
    console.log("CREATE COUPON ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Coupon
const updateCoupon = async (req, res) => {
  try {
    console.log("UPDATE BODY:", req.body);

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(coupon);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete Coupon
const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Coupon deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};