/**
 * protectedRoutes.js
 * Test route to confirm JWT authorization works
 */

const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

/**
 * Protected route
 * Only accessible with valid JWT
 */
router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    userId: req.user.id,
  });
});

module.exports = router;
