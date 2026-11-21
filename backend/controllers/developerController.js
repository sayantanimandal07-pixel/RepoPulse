
const Developer = require("../models/Developer");

const {
    getGitHubUser,
    getGitHubRepos
} = require("../services/githubService");

const {
    calculateLanguageDistribution,
    calculateRepositoryStats,
    calculateRepositoryActivity,
    calculateRepositoryHealth
} = require("../services/analyticsService");

// Create a developer profile
const createDeveloper = async (req, res) => {
    try {
        const {
            githubUsername,
            name,
            bio,
            avatarUrl,
            profileUrl
        } = req.body;

        if (!githubUsername || !githubUsername.trim()) {
            return res.status(400).json({
                success: false,
                message: "GitHub username is required."
            });
        }

        const developer = await Developer.create({
            githubUsername,
            name,
            bio,
            avatarUrl,
            profileUrl
        });

        res.status(201).json({
            success: true,
            message: "Developer profile created successfully!",
            data: developer
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This GitHub username already exists."
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all developers
const getAllDevelopers = async (req, res) => {
    try {
        const developers = await Developer.find();

        res.status(200).json({
            success: true,
            count: developers.length,
            data: developers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get developer by username
const getDeveloperByUsername = async (req, res) => {
    try {
        const username = req.params.username;

        const developer = await Developer.findOne({
            githubUsername: username
        });

        if (!developer) {
            return res.status(404).json({
                success: false,
                message: "Developer not found"
            });
        }

        res.status(200).json({
            success: true,
            data: developer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a developer profile
const updateDeveloper = async (req, res) => {
    try {
        const { username } = req.params;

        const allowedFields = [
            "name",
            "bio",
            "avatarUrl",
            "profileUrl"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (
                req.body &&
                Object.prototype.hasOwnProperty.call(req.body, field)
            ) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Provide at least one field: name, bio, avatarUrl, or profileUrl."
            });
        }

        const developer = await Developer.findOneAndUpdate(
            { githubUsername: username },
            { $set: updates },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!developer) {
            return res.status(404).json({
                success: false,
                message: "Developer not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Developer profile updated successfully!",
            data: developer
        });

    } catch (error) {
        return res.status(
            error.name === "ValidationError" ? 400 : 500
        ).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a developer
const deleteDeveloper = async (req, res) => {
    try {
        const username = req.params.username;

        const deletedDeveloper = await Developer.findOneAndDelete({
            githubUsername: username
        });

        if (!deletedDeveloper) {
            return res.status(404).json({
                success: false,
                message: "Developer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Developer deleted successfully!",
            data: deletedDeveloper
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get GitHub developer analytics
const getDeveloperAnalytics = async (req, res) => {
    try {
        const { username } = req.params;

        // Fetch GitHub profile
        const githubUser = await getGitHubUser(username);

        // Fetch GitHub repositories
        const githubRepos = await getGitHubRepos(username);

        // Convert GitHub data into RepoPulse format
        const repositories = githubRepos.map(repo => ({
            repoName: repo.name,
            description: repo.description || "",
            language: repo.language || "",
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            repoUrl: repo.html_url,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            pushedAt: repo.pushed_at
        }));

        // Save or update developer in MongoDB
        const savedDeveloper = await Developer.findOneAndUpdate(
            { githubUsername: githubUser.login },
            {
                $set: {
                    name: githubUser.name || "",
                    bio: githubUser.bio || "",
                    avatarUrl: githubUser.avatar_url || "",
                    profileUrl: githubUser.html_url,
                    publicRepos: githubUser.public_repos,
                    followers: githubUser.followers,
                    following: githubUser.following,
                    lastSyncedAt: new Date(),
                    repositories: repositories
                }
            },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        console.log(
            "Developer saved to MongoDB:",
            savedDeveloper.githubUsername
        );

        // Calculate analytics
        const languageDistribution =
            calculateLanguageDistribution(repositories);

        const repositoryStats =
            calculateRepositoryStats(repositories);

        const repositoryActivity =
            calculateRepositoryActivity(repositories);

        const repositoryHealth =
            calculateRepositoryHealth(repositories);

        // Send response
        res.status(200).json({
            success: true,

            developer: {
                username: githubUser.login,
                name: githubUser.name,
                bio: githubUser.bio,
                avatarUrl: githubUser.avatar_url,
                profileUrl: githubUser.html_url,
                followers: githubUser.followers,
                following: githubUser.following,
                publicRepos: githubUser.public_repos,
                lastSyncedAt: savedDeveloper.lastSyncedAt
            },

            analytics: {
                repositoryStats,
                languageDistribution,
                repositoryActivity,
                repositoryHealth
            }
        });

    } catch (error) {
        console.log("GitHub Analytics Error:", error.message);

        res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.status === 404
                ? "GitHub user not found."
                : error.message
        });
    }
};


// Get developer dashboard
const getDeveloperDashboard = async (req, res) => {
    try {
        const { username } = req.params;

        // Find developer in MongoDB
        const developer = await Developer.findOne({
            githubUsername: username
        });

        // Check if developer exists
        if (!developer) {
            return res.status(404).json({
                success: false,
                message: "Developer not found."
            });
        }

        // Get saved repositories
        const repositories = developer.repositories || [];

        // Calculate dashboard analytics
        const repositoryStats =
            calculateRepositoryStats(repositories);

        const languageDistribution =
            calculateLanguageDistribution(repositories);

        const repositoryActivity =
            calculateRepositoryActivity(repositories);

        const repositoryHealth =
            calculateRepositoryHealth(repositories);

        // Send dashboard response
        res.status(200).json({
            success: true,

            developer: {
                username: developer.githubUsername,
                name: developer.name,
                bio: developer.bio,
                avatarUrl: developer.avatarUrl,
                profileUrl: developer.profileUrl,
                followers: developer.followers,
                following: developer.following,
                publicRepos: developer.publicRepos,
                lastSyncedAt: developer.lastSyncedAt
            },

            dashboard: {
                repositoryStats,
                languageDistribution,
                repositoryActivity,
                repositoryHealth
            }
        });

    } catch (error) {
        console.log("Dashboard Error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export all controllers
module.exports = {
    createDeveloper,
    getAllDevelopers,
    getDeveloperByUsername,
    updateDeveloper,
    deleteDeveloper,
    getDeveloperAnalytics,
    getDeveloperDashboard
};
