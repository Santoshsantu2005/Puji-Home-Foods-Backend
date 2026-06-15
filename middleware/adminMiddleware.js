const Admin = require("../models/Admin");

const adminOnly = async (req, res, next) => {
  try {
    console.log("req.user =", req.user);

    const admin = await Admin.findById(req.user.id);

    console.log("admin found =", admin);

    if (!admin) {
      return res.status(403).json({
        message: "Access denied. Admins only."
      });
    }

    next();
  } catch (error) {
    console.log("ADMIN MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = adminOnly;