/**
 * db.js
 * Centralized PostgreSQL connection handler
 */

const { Pool } = require("pg");

/**
 * Create a new connection pool
 * Pool is preferred over Client for real applications
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Immediately test database connectivity
 * This ensures the app fails early if the DB is unreachable
 */
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to PostgreSQL database");
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error.message);
    process.exit(1); // Stop server if DB connection fails
  }
})();

/**
 * Export a reusable query function
 * Keeps controllers clean and consistent
 */
module.exports = {
  query: (text, params) => pool.query(text, params),
};
