const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User account no longer exists in the database",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "Failed to retrieve user profile",
      error: error.message,
    });
  }
});

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { first_name, last_name } = req.body;

    // Validate input
    if (!first_name && !last_name) {
      return res.status(400).json({
        message: "Please provide at least one field to update",
      });
    }

    // Build update object with only provided fields
    const updateFields = {};
    if (first_name) updateFields.first_name = first_name;
    if (last_name) updateFields.last_name = last_name;

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    // Check if user exists
    if (!updatedUser) {
      return res.status(404).json({
        message: "User account no longer exists in the database",
      });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    // Handle cast errors (invalid ID format)
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID format in authentication token",
      });
    }

    // Handle other errors
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

module.exports = router;
