const { body, validationResult } = require("express-validator");

// Validation rules for updating a developer profile
const validateUpdateDeveloper = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string")
        .trim(),

    body("bio")
        .optional()
        .isString()
        .withMessage("Bio must be a string")
        .trim(),

    body("avatarUrl")
        .optional()
        .isURL()
        .withMessage("Avatar URL must be a valid URL"),

    body("profileUrl")
        .optional()
        .isURL()
        .withMessage("Profile URL must be a valid URL"),

    // Check validation errors
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

module.exports = validateUpdateDeveloper;