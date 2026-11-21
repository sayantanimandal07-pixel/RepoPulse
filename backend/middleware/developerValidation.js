const { body, validationResult } = require("express-validator");

// Validation rules for creating a developer
const validateDeveloper = [
    body("githubUsername")
        .trim()
        .notEmpty()
        .withMessage("GitHub username is required")
        .isLength({ min: 1, max: 39 })
        .withMessage("GitHub username must be between 1 and 39 characters")
        .matches(/^[a-zA-Z0-9-]+$/)
        .withMessage("GitHub username can only contain letters, numbers, and hyphens"),

    body("name")
        .optional()
        .trim()
        .isString()
        .withMessage("Name must be a string"),

    body("bio")
        .optional()
        .trim()
        .isString()
        .withMessage("Bio must be a string"),

    body("publicRepos")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Public repositories must be a non-negative number"),

    body("followers")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Followers must be a non-negative number"),

    body("following")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Following must be a non-negative number"),

    // Check whether validation errors exist
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = validateDeveloper;