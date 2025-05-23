// I define request validation middleware
const { body, param, query, validationResult } = require('express-validator');

// I define validation middleware for task creation
const validateCreateTask = [
  body('taskHeading')
    .trim()
    .notEmpty()
    .withMessage('Task heading is required')
    .isLength({ max: 100 })
    .withMessage('Task heading must be less than 100 characters'),
  body('taskDetails')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Task details must be less than 1000 characters'),
  body('taskStatus')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Invalid task status'),
  body('taskPriority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid task priority'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// I define validation middleware for task update
const validateUpdateTask = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  body('taskHeading')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Task heading must be less than 100 characters'),
  body('taskDetails')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Task details must be less than 1000 characters'),
  body('taskStatus')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Invalid task status'),
  body('taskPriority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid task priority'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// I define validation middleware for query parameters
const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isIn(['taskHeading', 'taskStatus', 'taskPriority', 'creationDate', 'dueDate'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),
  query('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Invalid status filter'),
  query('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority filter'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateQueryParams
};