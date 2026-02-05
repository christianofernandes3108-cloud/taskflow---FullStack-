/**
 * taskRoutes.js
 * Defines task-related endpoints
 */

const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

/**
 * All task routes are protected
 */

// Create task
router.post("/", authenticateToken, taskController.createTask);

// Get all tasks
router.get("/", authenticateToken, taskController.getTasks);

// Update task
router.put("/:id", authenticateToken, taskController.updateTask);

// Delete task
router.delete("/:id", authenticateToken, taskController.deleteTask);

module.exports = router;
