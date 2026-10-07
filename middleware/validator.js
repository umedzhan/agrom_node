const { check, validationResult } = require('express-validator');

// Validation wrapper to handle errors
const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};

// Validation Rules
const registerValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
];

const verifyEmailValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('code', 'Verification code must be 6 digits').isLength({ min: 6, max: 6 }).isNumeric(),
];

const resendVerificationValidation = [
    check('email', 'Please include a valid email').isEmail(),
];

const productValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required and must be a number').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
    check('brand', 'Brand is required').not().isEmpty(),
    check('countInStock', 'Count in stock must be numeric').isNumeric(),
    check('description', 'Description is required').not().isEmpty(),
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    verifyEmailValidation,
    resendVerificationValidation,
    productValidation,
};
