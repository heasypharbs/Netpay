const express = require("express");

const router = express.Router();

router.post("/safehaven", async (req, res) => {
  res.json({ message: "Webhook processed successfully" });
});

module.exports = router;
