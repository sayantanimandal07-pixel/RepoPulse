const express = require("express");
const router = express.Router();

const {
    createDeveloper,
    getAllDevelopers,
    getDeveloperByUsername,
    updateDeveloper,
    deleteDeveloper,
    getDeveloperAnalytics,
    getDeveloperDashboard
} = require("../controllers/developerController");

const validateDeveloper = require("../middleware/developerValidation");
const validateUpdateDeveloper = require("../middleware/updateDeveloperValidation");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllDevelopers);
router.get("/:username/analytics", getDeveloperAnalytics);
router.get("/:username/dashboard", getDeveloperDashboard);
router.get("/:username", getDeveloperByUsername);

// Protected routes
router.post("/", protect, validateDeveloper, createDeveloper);
router.put("/:username", protect, validateUpdateDeveloper, updateDeveloper);
router.delete("/:username", protect, deleteDeveloper);

module.exports = router;