const express = require("express");
const router = express.Router();

const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

// Get all coupons
router.get("/", getCoupons);

// Create coupon
router.post("/", createCoupon);

// Update coupon
router.put("/:id", updateCoupon);

// Delete coupon
router.delete("/:id", deleteCoupon);

module.exports = router;