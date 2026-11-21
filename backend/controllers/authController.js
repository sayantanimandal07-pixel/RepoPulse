const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check whether user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login an existing user

// Login an existing user

const loginUser = async (req, res) => {
    try {
        console.log("LOGIN CONTROLLER HIT!");

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        console.log("USER FOUND:", !!user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        console.log("PASSWORD MATCH:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check JWT secret
        console.log("JWT SECRET LOADED:", !!process.env.JWT_SECRET);

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from environment variables");
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log("JWT GENERATED:", !!token);

        // Send login response
        console.log("SENDING LOGIN SUCCESS RESPONSE");

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token: token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get logged-in user's profile
const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
};
module.exports = { registerUser, loginUser,getMe };