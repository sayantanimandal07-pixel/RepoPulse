const developerRoutes = require("./routes/developerRoutes");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");
const app = express();
const githubRoutes = require("./routes/githubRoutes");
const authRoutes = require("./routes/authRoutes");


// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/developers", developerRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/auth", authRoutes);
// Test route
app.get("/", (req, res) => {
    res.send("Welcome to RepoPulse Backend!");
});

// Start server after database connection
const startServer = async () => {
    console.log("Server.js MONGO_URI:", Boolean(process.env.MONGO_URI));

    await connectDB();
    const PORT = process.env.PORT || 5000;

    app.use(notFoundMiddleware);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`RepoPulse server running on port ${PORT}`);
    });
};

startServer();