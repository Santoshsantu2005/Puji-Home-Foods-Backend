const express = require("express");
const router = express.Router();
const { loginAdmin, getAllAdmins, deleteAdmin } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");

router.post("/login", loginAdmin);
router.get("/all", protect, getAllAdmins);
router.delete("/:id", protect, deleteAdmin);

module.exports = router;