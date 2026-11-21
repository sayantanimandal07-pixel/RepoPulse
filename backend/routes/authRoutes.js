const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected user profile
console.log("protect:", typeof protect);
console.log("getMe:", typeof getMe);
router.get("/me", protect, getMe);

module.exports = router;