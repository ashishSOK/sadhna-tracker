import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// User registration validation
export const registerValidation = [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please enter a valid phone number with country code'),
    body('role').isIn(['mentor', 'devotee']).withMessage('Role must be either mentor or devotee'),
    validate
];

// Login validation
export const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

// Sadhna entry validation
export const sadhnaEntryValidation = [
    body('date').isISO8601().withMessage('Please enter a valid date'),
    body('wakeUpTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Wake up time must be in HH:MM format'),
    body('sleepTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Sleep time must be in HH:MM format'),
    body('roundsChanted').isInt({ min: 0 }).withMessage('Rounds must be a non-negative integer'),
    body('bookName').isIn(['Sb', 'Bg', 'CC', 'NOD', 'NOI', 'Other']).withMessage('Invalid book name'),
    body('readingDuration').isFloat({ min: 0, max: 1440 }).withMessage('Reading duration must be between 0 and 1440 minutes'),
    body('serviceDuration').isFloat({ min: 0, max: 24 }).withMessage('Service duration must be between 0 and 24 hours'),
    body('serviceType').optional().isString().isLength({ max: 100 }).withMessage('Service type cannot exceed 100 characters'),
    body('hearingDuration').isFloat({ min: 0, max: 24 }).withMessage('Hearing duration must be between 0 and 24 hours'),
    validate
];
