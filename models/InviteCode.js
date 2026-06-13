const mongoose = require("mongoose");

const inviteCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },

  role: {
    type: String,
    default: "admin",
  },

  used: {
    type: Boolean,
    default: false,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },

  expiresAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("InviteCode", inviteCodeSchema);