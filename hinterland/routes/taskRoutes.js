// Defining routes for task-related API endpoints
import express from 'express';
import { fetchAllTasks, createNewTask, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';
import { validateCreateTask, validateUpdateTask, validateQueryParams } from '../middleware/validateRequest.js';

const router = express.Router();

// Route to get all tasks with pagination and filtering
router.get('/', validateQueryParams, fetchAllTasks);

// Route to create a new task
router.post('/', validateCreateTask, createNewTask);

// Route to get a task by ID
router.get('/:id', getTaskById);

// Route to update a task
router.put('/:id', validateUpdateTask, updateTask);

// Route to delete a task
router.delete('/:id', deleteTask);

export default router; 