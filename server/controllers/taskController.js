/**
 * taskController.js
 * Handles task CRUD operations
 */

const db = require("../models/db");

/**
 * Create a new task
 */
exports.createTask = async (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id; // Retrieved from JWT middleware

  // Validate required input
  if (!title) {
    return res.status(400).json({
      message: "Task title is required",
    });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO tasks (user_id, title, description, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [userId, title, description || "", status || "todo"]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create task error:", error.message);
    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

/**
 * Get all tasks for the logged-in user
 */
exports.getTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `
      SELECT id, title, description, status, created_at
      FROM tasks
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get tasks error:", error.message);
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

/**
 * Update an existing task
 */
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `
      UPDATE tasks
      SET title = $1, description = $2, status = $3
      WHERE id = $4 AND user_id = $5
      RETURNING *
      `,
      [title, description, status, id, userId]
    );

    // If no rows updated, task doesn't exist or doesn't belong to user
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update task error:", error.message);
    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

/**
 * Delete a task
 */
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `
      DELETE FROM tasks
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error.message);
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};
