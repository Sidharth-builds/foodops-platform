require("dotenv").config();
const express = require("express");
const cors = require("cors");

// DB connection
const connectDB = require("./db");
connectDB();

// App init
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// -------- ROUTES --------
console.log(">>> AUTH ROUTES LOADED");
app.use("/api/auth", require("./routes/auth"));

console.log(">>> FOOD ROUTES LOADED");
app.use("/api/food", require("./routes/food"));

// Root test
app.get("/", (req, res) => {
  res.send("FoodOps Backend is running");
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});