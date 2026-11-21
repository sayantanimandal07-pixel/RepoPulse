const {
    calculateLanguageDistribution,
    calculateRepositoryStats,
    calculateRepositoryActivity,
    calculateRepositoryHealth
} = require("../services/analyticsService");
const Developer = require("../models/Developer");

// Fetch GitHub developer profile
const fetchGitHubProfile = async (req, res) => {
    try {
        const username = req.params.username;

        const user = await getGitHubUser(username);

        res.status(200).json({
            success: true,
            message: "GitHub profile fetched successfully!",

            data: {
                username: user.login,
                name: user.name,
                bio: user.bio,
                avatarUrl: user.avatar_url,
                profileUrl: user.html_url,
                publicRepos: user.public_repos,
                followers: user.followers,
                following: user.following
            }
        });

    } catch (error) {

        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                success: false,
                message: "GitHub user not found"
            });
        }

        if (error.response && error.response.status === 403) {
            return res.status(429).json({
                success: false,
                message: "GitHub API rate limit reached. Try again later."
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to fetch GitHub profile"
        });
    }
};

// Fetch GitHub repositories
const fetchGitHubRepositories = async (req, res) => {
    try {
        const username = req.params.username;

        const repos = await getGitHubRepos(username);

        res.status(200).json({
            success: true,
            message: "GitHub repositories fetched successfully!",
            totalRepositories: repos.length,
            data: repos.map(repo => ({
                name: repo.name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                url: repo.html_url
            }))
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                success: false,
                message: "GitHub user not found"
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to fetch GitHub repositories"
        });
    }
};

// Save GitHub profile and repositories to MongoDB
const saveGitHubDeveloper = async (req, res) => {
    try {
        const username = req.params.username;

        // Fetch GitHub profile
        const user = await getGitHubUser(username);

        // Fetch GitHub repositories
        const repos = await getGitHubRepos(username);

        // Prepare developer data
        const developerData = {
            githubUsername: user.login,
            name: user.name || "",
            bio: user.bio || "",
            avatarUrl: user.avatar_url || "",
            profileUrl: user.html_url || "",
            publicRepos: user.public_repos,
            followers: user.followers,
            following: user.following,

            repositories: repos.map(repo => ({
                repoName: repo.name,
                description: repo.description || "",
                language: repo.language || "",
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                repoUrl: repo.html_url,
                createdAt: repo.createdAt,
                updatedAt: repo.updatedAt,
                pushedAt: repo.pushedAt
            }))
        };

        // Save or update developer in MongoDB
        const developer = await Developer.findOneAndUpdate(
            { githubUsername: user.login },
            { $set: developerData },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "GitHub developer saved successfully!",
            data: developer
        });

    } catch (error) {
        console.log("Save GitHub Developer Error:", error.message);

        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                success: false,
                message: "GitHub user not found"
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to save GitHub developer"
        });
    }
};

// Get programming language analytics
const getLanguageAnalytics = async (req, res) => {
    try {
        const username = req.params.username;

        // Find developer in MongoDB
        const developer = await Developer.findOne({
            githubUsername: username
        });

        // Check if developer exists
        if (!developer) {
            return res.status(404).json({
                success: false,
                message: "Developer not found. Please save the GitHub profile first."
            });
        }

        // Calculate language distribution
        const analytics = calculateLanguageDistribution(
            developer.repositories
        );

        res.status(200).json({
            success: true,
            username: developer.githubUsername,
            totalRepositories: developer.repositories.length,
            languageAnalytics: analytics
        });

    } catch (error) {
        console.log("Language Analytics Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to calculate language analytics"
        });
    }
};

// Get repository statistics
const getRepositoryStats = async (req, res) => {
    try {
        const { username } = req.params;

        const developer = await Developer.findOne({
            githubUsername: username
        });

        if (!developer) {
            return res.status(404).json({
                success: false,
                message: "Developer not found in database"
            });
        }

        const stats = calculateRepositoryStats(
            developer.repositories
        );

        res.status(200).json({
            success: true,
            username: developer.githubUsername,
            stats: stats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error calculating repository statistics",
            error: error.message
        });
    }
};

// Get developer repository activity
const getRepositoryActivity = async (req, res) => {
    try {
        const { username } = req.params;

        const developer = await Developer.findOne({
            githubUsername: username
        });

        if (!developer) {
            return res.status(404).json({
                success: false,
                message: "Developer not found in database"
            });
        }

        const activity = calculateRepositoryActivity(
            developer.repositories
        );

        res.status(200).json({
            success: true,
            username: developer.githubUsername,
            activity: activity
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error calculating repository activity",
            error: error.message
        });
    }
};

// Get repository health scores
const getRepositoryHealth = async (req, res) => {
    try {
        const { username } = req.params;

        const developer = await Developer.findOne({
            githubUsername: username
        });

        if (!developer) {
            return res.status(404).json({
                success: false,
                message: "Developer not found in database"
            });
        }

        const healthData = calculateRepositoryHealth(
            developer.repositories
        );

        res.status(200).json({
            success: true,
            username: developer.githubUsername,
            repositoryHealth: healthData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error calculating repository health",
            error: error.message
        });
    }
};

module.exports = {
    fetchGitHubProfile,
    fetchGitHubRepositories,
    saveGitHubDeveloper,
    getLanguageAnalytics,
    getRepositoryStats,
    getRepositoryActivity,
    getRepositoryHealth
};