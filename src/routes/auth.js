const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    console.log("📩 Incoming Register Request:", req.body);

    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user WITHOUT hashing the password
    // The User model will hash it automatically
    const user = new User({
      first_name,
      last_name,
      email,
      password, // Plain password - will be hashed by the model
    });

    await user.save();
    console.log("✅ User Saved Successfully");

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("🔥 Registration Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("📩 Incoming Login Request:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Request body is empty. Check Content-Type." });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("🔑 Stored Password Hash from DB:", user.password);

    // Use the built-in method if it exists (Mongoose models often have this)
    if (typeof user.comparePassword === "function") {
      console.log("🔍 Using model's comparePassword method");
      const isMatch = await user.comparePassword(password);
      console.log("✅ Password Match:", isMatch);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      // Fallback to direct bcrypt comparison
      console.log("🔍 Using direct bcrypt comparison");

      // Make sure we have the password field
      if (!user.password) {
        return res.status(400).json({ message: "Password field missing" });
      }

      // Compare with bcrypt directly
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("✅ Password Match:", isMatch);

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      } catch (bcryptError) {
        console.error("🔥 bcrypt error:", bcryptError);
        return res.status(400).json({ message: "Error comparing passwords" });
      }
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("🔥 Error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Password Reset
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set the plain password - the model will hash it
    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Password Reset Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Test bcrypt directly
router.post("/test-bcrypt", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hash = await bcrypt.hash(password, salt);

    // Verify the password
    const isMatch = await bcrypt.compare(password, hash);

    res.json({
      password,
      hash,
      isMatch,
      message: isMatch
        ? "bcrypt is working correctly"
        : "bcrypt verification failed",
    });
  } catch (error) {
    console.error("bcrypt Test Error:", error);
    res.status(500).json({ message: "Test failed", error: error.message });
  }
});

module.exports = router;
