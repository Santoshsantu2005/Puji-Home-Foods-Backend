const InviteCode = require("../models/InviteCode");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

const generateInviteCode = async (req, res) => {
  try {
    const randomCode = `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    console.log('req.user:', req.user);
    const admin = await Admin.findById(req.user.id);

    const inviteCode = await InviteCode.create({
      code: randomCode,
      role: "admin",
      used: false,
      createdBy: req.user.id,
      createdByName: admin?.name || "Admin",
      expiresAt,
    });

    res.status(201).json(inviteCode);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const registerAdminWithInvite = async (req, res) => {
  try {
    const { name, email, password, code } = req.body;

console.log("=================================");
console.log("Received code:", code);

const allCodes = await InviteCode.find({});
console.log("All invite codes in DB:", allCodes);

const invite = await InviteCode.findOne({
  code: code.trim(),
});

console.log("Found invite:", invite);
console.log("=================================");

    if (!invite) {
      return res.status(400).json({ message: "Invalid invite code" });
    }

    if (invite.used) {
      return res.status(400).json({ message: "Invite code already used" });
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite code has expired" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating admin:', { name, email, role: "admin" })
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    console.log('Admin created:', admin)

    invite.used = true;
    await invite.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { generateInviteCode, registerAdminWithInvite };