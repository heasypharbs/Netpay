const mongoose = require("mongoose");

// Load environment variables
require("dotenv").config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
