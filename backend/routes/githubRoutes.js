const express = require("express");
const router = express.Router();

const {
    fetchGitHubProfile,
    fetchGitHubRepositories,
    saveGitHubDeveloper,
    getLanguageAnalytics,
    getRepositoryStats,
    getRepositoryActivity,
    getRepositoryHealth
} = require("../controllers/githubController");



// GET - Fetch GitHub profile
router.get("/:username", fetchGitHubProfile);

// GET - Fetch GitHub repositories
router.get("/:username/repos", fetchGitHubRepositories);

// POST - Save GitHub developer to MongoDB
router.post("/:username/save", saveGitHubDeveloper);

// GET - Programming language analytics
router.get("/:username/analytics/languages", getLanguageAnalytics);

router.get("/:username/analytics/repositories", getRepositoryStats);

router.get("/:username/analytics/activity", getRepositoryActivity);

router.get("/:username/analytics/health", getRepositoryHealth);

module.exports = router;