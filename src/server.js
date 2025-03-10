require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const bankingRoutes = require("./routes/banking");
const webhookRoutes = require("./routes/webhook");

const app = express();

// Middleware
app.use(express.json()); /
app.use(cors()); 
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); 
}

connectDB().catch((err) => {
  console.error("Connection failed:", err.message);
  process.exit(1); 
});


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/banking", bankingRoutes);
app.use("/api/webhooks", webhookRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
