
const mongoose = require("mongoose");

// Define Developer Schema
const developerSchema = new mongoose.Schema({

    githubUsername: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    name: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    avatarUrl: {
        type: String,
        default: ""
    },

    profileUrl: {
        type: String,
        default: ""
    },

    publicRepos: {
        type: Number,
        default: 0
    },

    followers: {
        type: Number,
        default: 0
    },

    following: {
        type: Number,
        default: 0
    },
    lastSyncedAt: {
    type: Date,
    default: null
},

    repositories: [
    {
        repoName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        language: {
            type: String,
            default: ""
        },
        stars: {
            type: Number,
            default: 0
        },
        forks: {
            type: Number,
            default: 0
        },
        repoUrl: {
            type: String,
            default: ""
        },
        createdAt: Date,
        updatedAt: Date,
        pushedAt: Date
    }
]

}, {
    timestamps: true
});

// Create Developer Model
const Developer = mongoose.model(
    "Developer",
    developerSchema
);

module.exports = Developer;
