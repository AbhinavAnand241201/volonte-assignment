// I define routes for task-related API endpoints
const express = require('express');
const { getAllTasks, createTask, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask, validateQueryParams } = require('../middleware/validateRequest');

const router = express.Router();

// I set up a route to get all tasks with pagination and filtering
router.get('/', validateQueryParams, getAllTasks);

// I set up a route to create a new task
router.post('/', validateCreateTask, createTask);

// I set up a route to get a task by ID
router.get('/:id', getTaskById);

// I set up a route to update a task
router.put('/:id', validateUpdateTask, updateTask);

// I set up a route to delete a task
router.delete('/:id', deleteTask);

module.exports = router; 