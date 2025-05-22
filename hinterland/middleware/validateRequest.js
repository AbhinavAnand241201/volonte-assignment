// Request validation middleware
import { body, param, query, validationResult } from 'express-validator';

// Validation middleware for task creation
export const validateCreateTask = [
  body('taskHeading')
    .trim()
    .notEmpty()
    .withMessage('Task heading is required')
    .isLength({ max: 100 })
    .withMessage('Task heading must be less than 100 characters'),
  body('taskDetails')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Task details must be less than 500 characters'),
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

// Validation middleware for task update
export const validateUpdateTask = [
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
    .isLength({ max: 500 })
    .withMessage('Task details must be less than 500 characters'),
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

// Validation middleware for query parameters
export const validateQueryParams = [
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