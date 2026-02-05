/**
 * app.js
 * Entry point of the backend application
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize database
require("./models/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

/**
 * Middleware
 */
app.use(cors({
  origin: "*"
}));
app.use(express.json());

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/tasks", taskRoutes);

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

/**
 * Server start
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
