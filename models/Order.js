const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null,
    },
    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    products: [
  {
    productId: String,
    name: String,
    image: String,
    weight: String,
    quantity: Number,
    price: Number,
  },
],

    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
  type: String,
  default: "COD",
},

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    orderStatus: {
  type: String,
  enum: [
    "Pending",
    "Confirmed",
    "Preparing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ],
  default: "Pending",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);