/**
 * authMiddleware.js
 * Protects routes by validating JWT tokens
 */

const jwt = require("jsonwebtoken");

/**
 * Middleware function to authenticate JWT
 */
const authenticateToken = (req, res, next) => {
  /**
   * Tokens are sent in the Authorization header:
   * Authorization: Bearer <token>
   */
  const authHeader = req.headers["authorization"];

  // If no Authorization header exists
  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  // Extract token from "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Invalid token format.",
    });
  }

  try {
    /**
     * Verify token using secret
     * This also decodes the payload
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * Attach user info to request object
     * This allows controllers to know WHO is making the request
     */
    req.user = {
      id: decoded.userId,
    };

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticateToken;
