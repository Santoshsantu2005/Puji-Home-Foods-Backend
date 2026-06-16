const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name    = req.body.name    || user.name;
    user.phone   = req.body.phone   || user.phone;
    user.address = req.body.address || user.address;

    await user.save();

    res.status(200).json({
      message: "Profile Updated Successfully",
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        phone:   user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ NEW: Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  console.log("Forgot Password API Called");

  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS EXISTS:", !!process.env.EMAIL_PASS);

await transporter.verify();
console.log("SMTP Connected");

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: "Password Reset",
  html: `
    <h2>Password Reset</h2>
    <p>Click below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
  `,
});

console.log("Reset email sent");

res.status(200).json({
  message: "Reset link sent to email",
});

res.status(200).json({
  message: "Reset link sent to email",
});
  } catch (error) {
    console.log("EMAIL ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getAllUsers,
};
