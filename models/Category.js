const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  status: {
    type: String,
    default: "Active"
  }
});

module.exports = mongoose.model("Category", categorySchema);