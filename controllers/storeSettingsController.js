const StoreSettings = require("../models/StoreSettings");

// GET Settings
const getStoreSettings = async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();

    if (!settings) {
      settings = await StoreSettings.create({
        storeName: "PUJI HOME FOODS",
        email: "",
        phone: "",
        address: ""
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Settings
const updateStoreSettings = async (req, res) => {
  try {
    const { storeName, email, phone, address } = req.body;

    let settings = await StoreSettings.findOne();

    if (!settings) {
      settings = new StoreSettings();
    }

    settings.storeName = storeName;
    settings.email = email;
    settings.phone = phone;
    settings.address = address;

    await settings.save();

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStoreSettings,
  updateStoreSettings,
};