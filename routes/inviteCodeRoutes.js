const express = require("express");
const router = express.Router();

const {
  generateInviteCode,
  registerAdminWithInvite,
} = require("../controllers/inviteCodeController");

const protect = require("../middleware/authMiddleware");

router.post("/generate", protect, generateInviteCode);
router.post("/register-admin", registerAdminWithInvite);

module.exports = router;