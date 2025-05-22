// Defining routes for task-related API endpoints
import express from 'express';
import { fetchAllTasks } from '../controllers/taskController.js';

const router = express.Router();

// Route to get all tasks
router.get('/', fetchAllTasks);

export default router; 