const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },

    discount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["Percentage", "Flat"],
      required: true,
    },

    minOrder: {
      type: Number,
      default: 0,
    },

    usageLimit: {
      type: Number,
      default: 100,
    },

    used: {
      type: Number,
      default: 0,
    },

    validTill: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);