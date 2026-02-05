/**
 * authController.js
 * Handles user registration and login logic
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into database
    await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      message: "Server error during registration",
    });
  }
};

/**
 * Login an existing user
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    // Find user by email
    const result = await db.query(
      "SELECT id, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    // Compare submitted password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Server error during login",
    });
  }
};
