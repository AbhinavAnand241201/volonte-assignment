// Handling task-related logic
import Task from '../models/Task.js';

// Fetch all tasks from the database
export const fetchAllTasks = async (req, res) => {
  try {
    const taskList = await Task.find(); // Query all tasks
    res.status(200).json(taskList);
  } catch (error) {
    // Basic error handling for now
    res.status(500).json({ errorMessage: 'Failed to fetch tasks' });
  }
}; 