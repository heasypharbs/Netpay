require("dotenv").config(); // Load environment variables first

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const bankingRoutes = require("./routes/banking");
const webhookRoutes = require("./routes/webhook");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON body
app.use(cors()); // Enable CORS for cross-origin requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Log requests in dev mode
}

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1); // Exit process if DB connection fails
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/banking", bankingRoutes);
app.use("/api/webhooks", webhookRoutes);

// Default route (fallback for unknown endpoints)
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
