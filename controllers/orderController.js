const Order = require("../models/Order");
const Product = require("../models/Product");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Create Order
const createOrder = async (req, res) => {
  try {
    console.log("CREATE ORDER API CALLED");
    const order = new Order(req.body);

await order.save();

// Update stock automatically
for (const item of order.products) {
  const product = await Product.findById(item.productId);

  if (!product) continue;

  product.totalStock -= item.quantity;

  if (product.totalStock <= 0) {
    product.totalStock = 0;
    product.stockStatus = "Out of Stock";
  } else if (
    product.totalStock <= product.lowStockThreshold
  ) {
    product.stockStatus = "Low Stock";
  } else {
    product.stockStatus = "In Stock";
  }

  await product.save();
}
    console.log("ORDER EMAIL =", order.email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("Sending order email to:", order.email);

    transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: order.email,
  subject: "Puji Home Foods - Order Confirmation",
  html: `
    <h2>Thank You for Your Order!</h2>
    <p>Hello ${order.customerName},</p>
    <p>Your order has been placed successfully.</p>
    <p><strong>Order Amount:</strong> ₹${order.totalAmount}</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    <p><strong>Order Status:</strong> ${order.orderStatus}</p>
    <h3>Puji Home Foods</h3>
  `,
})
.then(() => {
  console.log("Order email sent successfully");
})
.catch((err) => {
  console.log("Order Email Error:", err);
});

res.status(201).json({
  message: "Order Created",
  order,
});

} catch (error) {
  console.log(error);

  res.status(500).json({
    message: "Server Error",
  });
}
};


// Get All Orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Orders By User ID
const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Single Order By ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const allowedStatuses = [
  "Pending",
  "Processing",
  "Confirmed",
  "Preparing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

if (!allowedStatuses.includes(req.body.orderStatus)) {
  return res.status(400).json({
    message: "Invalid order status",
  });
}

order.orderStatus = req.body.orderStatus;

await order.save();

console.log("STATUS UPDATE CALLED");
console.log("Customer Email:", order.email);
console.log("New Status:", order.orderStatus);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("Sending status update email to:", order.email);

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: order.email,
  subject: "Puji Home Foods - Order Status Update",
  html: `
    <h2>Order Status Updated</h2>

    <p>Hello ${order.customerName},</p>

    <p>Your order status has been updated.</p>

    <p><strong>New Status:</strong> ${order.orderStatus}</p>

    <p><strong>Order Amount:</strong> ₹${order.totalAmount}</p>

    <p>Thank you for shopping with Puji Home Foods.</p>

    <br/>

    <h3>Puji Home Foods</h3>
  `,
})
.then(() => {
  console.log("Status update email sent");
})
.catch((err) => {
  console.log("Status Email Error:", err);
});

res.status(200).json({
  message: "Order Status Updated",
  order,
});
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = "Cancelled";

    await order.save();
    

    res.status(200).json({
      message: "Order Cancelled",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};