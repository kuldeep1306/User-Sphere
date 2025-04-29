const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Status", key: "status", width: 15 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Description", key: "description", width: 50 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ];

        tasks.forEach((task) => {
            let assignedTo = "Unassigned";
        
            if (task.assignedTo) {
                assignedTo = `${task.assignedTo.name} (${task.assignedTo.email})`;
            }
        
            worksheet.addRow({
                _id: task._id.toString(),
                title: task.title,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "No due date",
                description: task.description || "No description",
                assignedTo: assignedTo,
            });
        });
        
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=tasks_report.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error exporting tasks", error: error.message });
    }
};

const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const tasks = await Task.find().populate("assignedTo", "name email _id");

        const userTaskMap = {};

        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        tasks.forEach((task) => {
            if (Array.isArray(task.assignedTo) && task.assignedTo.length > 0) {
                task.assignedTo.forEach((assignedUser) => {
                    const userData = userTaskMap[assignedUser._id.toString()];
                    if (userData) {
                        userData.taskCount += 1;

                        if (task.status === "pending")
                            userData.pendingTasks += 1;
                        else if (task.status === "inprogress")
                            userData.inProgressTasks += 1;
                        else if (task.status === "completed")
                            userData.completedTasks += 1;
                    }
                });
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Task Report");

        worksheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=users_report.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: "Error exporting users", error: error.message });
    }
};

module.exports = { exportTasksReport, exportUsersReport };