const express = require("express");
const router = express.Router();

const {
  getStoreSettings,
  updateStoreSettings,
} = require("../controllers/storeSettingsController");

router.get("/", getStoreSettings);
router.put("/", updateStoreSettings);

module.exports = router;