const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const db = require("../db");

// POST /api/add-task
router.post(
  "/add-task",
  auth,
  [
    body("content")
      .isLength({ min: 5 })
      .withMessage("Task must be at least 5 characters"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const userId = req.user.userId;

    try {
      const stmt = db.prepare(
        "INSERT INTO tasks (user_id, content) VALUES (?, ?)"
      );
      const info = stmt.run(userId, content);

      res.status(201).json({
        message: "Task saved!",
        taskId: info.lastInsertRowid,
      });
    } catch (err) {
      console.error("Add task error:", err);
      res.status(500).json({ error: "Could not save the task" });
    }
  }
);

// GET /api/get-tasks
router.get('/get-tasks', auth, (req, res) => {
    const userId = req.user.userId;
    try {
        const tasks = db.prepare("SELECT * FROM tasks WHERE user_id = ?").all(userId);
        const user = db.prepare("SELECT email FROM users WHERE id = ?").get(userId);
        
        res.json({ tasks, email: user.email });
    } catch (err) {
        console.error("Fetch tasks error:", err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// DELETE /api/delete-task/:id
router.delete('/delete-task/:id', auth, (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.userId;

    try {
        const stmt = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
        const info = stmt.run(taskId, userId);

        if (info.changes === 0) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }

        res.json({ message: "Task deleted!" });
    } catch (err) {
        console.error("Delete task error:", err);
        res.status(500).json({ error: "Could not delete task" });
    }
});

// PUT /api/update-task/:id
router.patch('/update-task/:id', auth, [
    body('content').isLength({ min: 5 }).withMessage('The task must be at least 5 characters')
], (req, res) => {
    const taskId = req.params.id;
    const { content } = req.body;
    const userId = req.user.userId;

    try {
        const stmt = db.prepare('UPDATE tasks SET content = ? WHERE id = ? AND user_id = ?');
        const info = stmt.run(content, taskId, userId);

        if (info.changes === 0) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task updated!" });
    } catch (err) {
        console.error("Update task error:", err);
        res.status(500).json({ error: "Server error when updating" });
    }
});

module.exports = router;