const Task = require("../models/Task");
const mongoose = require("mongoose");

// Get tasks
// Get tasks
const getTask = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate("assignedTo", "name email profileImageUrl");
    }
    
    // Add completedCount manually without destroying task object
    tasks = tasks.map(task => {
      const completedCount = task.todoChecklist.filter(item => item.completed).length;
      return {
        ...task.toObject(), // important: safely convert Mongo document to plain object
        completedCount,
      };
    });
    ;

    const baseFilter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };
    const allTasks = await Task.countDocuments(baseFilter);
    const pendingTasks = await Task.countDocuments({ ...baseFilter, status: "pending" });
    const inprogressTasks = await Task.countDocuments({ ...baseFilter, status: "inprogress" });
    const completedTasks = await Task.countDocuments({ ...baseFilter, status: "completed" });

    // 👇 Corrected Response Structure
    res.json({
      tasks,
      statusSummary: {
        allTasks,
        pendingTasks,
        inprogressTasks,
        completedTasks,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send('Invalid task ID format');
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }

    res.json(task);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// Create task// Create task

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      dueDate,
      priority,
      attachments, // Frontend sending array
      todoChecklist,
      status = "pending",
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({ message: "Invalid assignedTo: Must be an array of user IDs" });
    }

    const invalidIds = assignedTo.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ message: "Invalid user IDs in assignedTo", invalidIds });
    }

    // ✔ Map checklist properly
    const mappedTodoChecklist = todoChecklist?.map(item => ({
      text: item.title || item.text, // Allow both title or text
      completed: item.completed || false,
    }));

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy: req.user.id,
      attachment: attachments, // Now array of strings allowed
      todoChecklist: mappedTodoChecklist,
      status,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.priority = req.body.priority || task.priority;
    task.attachment = req.body.attachments || task.attachment;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({ message: "Invalid assignedTo: Must be an array" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAssigned = task.assignedTo.some(userId => userId.toString() === req.user.id.toString());
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update this task" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "completed") {
      task.todoChecklist.forEach(item => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "Task status updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update task checklist
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.includes(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update this task" });
    }

    task.todoChecklist = todoChecklist;
    const completedCount = task.todoChecklist.filter(item => item.completed).length;
    const totalItems = task.todoChecklist.length;
    task.progress = totalItems > 0 ? Math.floor((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      task.status = "completed";
    } else if (task.progress > 0) {
      task.status = "inprogress";
    } else {
      task.status = "pending";
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");
    res.json({ message: "Task checklist updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin dashboard data
const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "pending" });
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const overdueTasks = await Task.countDocuments({ status: "pending", dueDate: { $lt: new Date() } });

    const taskStatuses = ["pending", "inprogress", "completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      acc[status.replace(/\s+/g, "")] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
      return acc;
    }, { All: totalTasks });

    const taskPriorities = ["low", "medium", "high"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: { totalTasks, pendingTasks, completedTasks, overdueTasks },
      charts: { taskDistribution, taskPriorityLevels },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// User-specific dashboard data
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "pending" });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "completed" });
    const overdueTasks = await Task.countDocuments({ assignedTo: userId, status: { $ne: "completed" }, dueDate: { $lt: new Date() } });

    const taskStatuses = ["pending", "inprogress", "completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      acc[status.replace(/\s+/g, "")] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
      return acc;
    }, { All: totalTasks });

    const taskPriorities = ["low", "medium", "high"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: { totalTasks, pendingTasks, completedTasks, overdueTasks },
      charts: { taskDistribution, taskPriorityLevels },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getTask,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
