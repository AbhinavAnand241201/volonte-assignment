// Defining routes for task-related API endpoints
const express = require('express');
const { getAllTasks, createTask, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask, validateQueryParams } = require('../middleware/validateRequest');

const router = express.Router();

// Route to get all tasks with pagination and filtering
router.get('/', validateQueryParams, getAllTasks);

// Route to create a new task
router.post('/', validateCreateTask, createTask);

// Route to get a task by ID
router.get('/:id', getTaskById);

// Route to update a task
router.put('/:id', validateUpdateTask, updateTask);

// Route to delete a task
router.delete('/:id', deleteTask);

module.exports = router; 