const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const safehavenmfb = require("../services/safehavenmfb");
const User = require("../models/User");

const router = express.Router();

router.post("/virtual-account", authMiddleware, async (req, res) => {
  try {
    // Use the documented API approach with accountType parameter
    const { data } = await safehavenmfb.createAccount({
      accountType: "Savings",
    });

    // Update user with the virtual account number from response
    await User.findByIdAndUpdate(req.user.id, {
      virtualAccountNumber: data.accountNumber,
    });

    res.json({
      message: "Virtual account created successfully",
      virtualAccountNumber: data.accountNumber,
    });
  } catch (error) {
    console.error("Error creating virtual account:", error);
    res.status(500).json({
      message: "Failed to create virtual account",
      error: error.message,
    });
  }
});

module.exports = router;
