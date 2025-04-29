const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { 
  getTask, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask, 
  updateTaskStatus, 
  updateTaskChecklist, 
  getDashboardData, 
  getUserDashboardData 
} = require("../controllers/taskController");

const router = express.Router();

// 📊 Dashboard routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);

// 📋 Task CRUD operations
router.get("/", protect, getTask);
router.get("/:id", protect, getTaskById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);

// 🔄 Task status and checklist updates
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);

module.exports = router;
