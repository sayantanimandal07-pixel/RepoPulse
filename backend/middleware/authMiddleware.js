
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        console.log("AUTH MIDDLEWARE HIT!");

        const authHeader = req.headers.authorization;

        console.log("AUTH HEADER EXISTS:", !!authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        console.log("TOKEN RECEIVED:", !!token);
        console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("TOKEN VERIFIED!");
        console.log("DECODED USER ID:", decoded.id);

        // Find user
        req.user = await User.findById(decoded.id).select("-password");

        console.log("USER FOUND:", !!req.user);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        next();

    } catch (error) {
        console.log("AUTH MIDDLEWARE ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { protect };
