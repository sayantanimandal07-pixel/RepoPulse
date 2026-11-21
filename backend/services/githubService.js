
const axios = require("axios");

// Fetch GitHub user details
const getGitHubUser = async (username) => {
    try {
        const response = await axios.get(
            `https://api.github.com/users/${username}`
        );

        return response.data;

    } catch (error) {
        console.log("GitHub API Error:", error.message);
        throw error;
    }
};

// Fetch GitHub repositories
const getGitHubRepos = async (username) => {
    try {
        const response = await axios.get(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );

        return response.data;

    } catch (error) {
        console.log("GitHub Repositories API Error:", error.message);
        throw error;
    }
};

module.exports = {
    getGitHubUser,
    getGitHubRepos
};
