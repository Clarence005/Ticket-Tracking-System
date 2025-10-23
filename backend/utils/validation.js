const { body } = require('express-validator');
const { TICKET_CATEGORIES, TICKET_PRIORITIES, USER_ROLES, VALIDATION_LIMITS } = require('../config/constants');

// User validation rules
const userValidation = {
  register: [
    body('name')
      .trim()
      .isLength({ min: VALIDATION_LIMITS.NAME_MIN, max: VALIDATION_LIMITS.NAME_MAX })
      .withMessage(`Name must be between ${VALIDATION_LIMITS.NAME_MIN} and ${VALIDATION_LIMITS.NAME_MAX} characters`),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: VALIDATION_LIMITS.PASSWORD_MIN })
      .withMessage(`Password must be at least ${VALIDATION_LIMITS.PASSWORD_MIN} characters long`),
    body('role')
      .optional()
      .isIn(USER_ROLES)
      .withMessage(`Role must be one of: ${USER_ROLES.join(', ')}`),
    body('studentId')
      .optional()
      .trim()
      .isLength({ min: 1, max: VALIDATION_LIMITS.STUDENT_ID_MAX })
      .withMessage(`Student ID must be between 1 and ${VALIDATION_LIMITS.STUDENT_ID_MAX} characters`)
  ],
  
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};

// Ticket validation rules
const ticketValidation = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 1, max: VALIDATION_LIMITS.TITLE_MAX })
      .withMessage(`Title is required and must be less than ${VALIDATION_LIMITS.TITLE_MAX} characters`),
    body('description')
      .trim()
      .isLength({ min: 1, max: VALIDATION_LIMITS.DESCRIPTION_MAX })
      .withMessage(`Description is required and must be less than ${VALIDATION_LIMITS.DESCRIPTION_MAX} characters`),
    body('category')
      .isIn(TICKET_CATEGORIES)
      .withMessage(`Category must be one of: ${TICKET_CATEGORIES.join(', ')}`),
    body('priority')
      .isIn(TICKET_PRIORITIES)
      .withMessage(`Priority must be one of: ${TICKET_PRIORITIES.join(', ')}`)
  ],
  
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: VALIDATION_LIMITS.TITLE_MAX })
      .withMessage(`Title must be less than ${VALIDATION_LIMITS.TITLE_MAX} characters`),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 1, max: VALIDATION_LIMITS.DESCRIPTION_MAX })
      .withMessage(`Description must be less than ${VALIDATION_LIMITS.DESCRIPTION_MAX} characters`),
    body('category')
      .optional()
      .isIn(TICKET_CATEGORIES)
      .withMessage(`Category must be one of: ${TICKET_CATEGORIES.join(', ')}`),
    body('priority')
      .optional()
      .isIn(TICKET_PRIORITIES)
      .withMessage(`Priority must be one of: ${TICKET_PRIORITIES.join(', ')}`)
  ],
  
  comment: [
    body('text')
      .trim()
      .isLength({ min: 1, max: VALIDATION_LIMITS.COMMENT_MAX })
      .withMessage(`Comment is required and must be less than ${VALIDATION_LIMITS.COMMENT_MAX} characters`)
  ]
};

module.exports = {
  userValidation,
  ticketValidation
};