require("dotenv").config();
const express = require("express");
const cors = require("cors");   
const path = require("path");
const connectDB = require("./config/db");
const https = require("https");
const fs = require("fs");  // Required for reading the SSL certificate

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");  
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// CORS setup
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

connectDB();

app.use(express.json());    

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// HTTPS configuration
const sslOptions = {
    key: fs.readFileSync("ssl/server.key"),  // Path to your private key
    cert: fs.readFileSync("ssl/server.cert") // Path to your certificate
};

// Choose the port (either from .env or default to 5000)
const PORT = process.env.PORT || 5000;

// Start HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`✅ HTTPS Server is running at https://localhost:${PORT}`);
});
