// Handling task-related logic
import Task from '../models/Task.js';
import mongoose from 'mongoose';

// Fetch all tasks from the database with pagination and sorting
export const fetchAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'creationDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const status = req.query.status;
    const priority = req.query.priority;

    // Build query
    const query = {};
    if (status) query.taskStatus = status;
    if (priority) query.taskPriority = priority;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination and sorting
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ errorMessage: 'Failed to fetch tasks' });
  }
};

// Create a new task with validation
export const createNewTask = async (req, res) => {
  try {
    // Validating input before saving to avoid bad data
    const { taskHeading, taskDetails, taskStatus, taskPriority, dueDate } = req.body;

    // Check for required taskHeading
    if (!taskHeading) {
      return res.status(400).json({ errorMessage: 'taskHeading is required' });
    }

    // Create task object
    const newTask = new Task({
      taskHeading,
      taskDetails,
      taskStatus: taskStatus || 'To Do', // Fallback to default if not provided
      taskPriority: taskPriority || 'Low',
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    // Save to MongoDB
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    // Handle validation or database errors
    res.status(400).json({ errorMessage: error.message });
  }
};

// Retrieve a single task by ID
export const getTaskById = async (req, res) => {
  try {
    // Checking ID validity to prevent MongoDB errors
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMessage: 'Invalid task ID' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ errorMessage: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ errorMessage: 'Failed to retrieve task' });
  }
};

// Update an existing task
export const updateTask = async (req, res) => {
  try {
    // Checking ID validity to prevent MongoDB errors
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMessage: 'Invalid task ID' });
    }

    // Updating only provided fields to avoid overwriting defaults
    const { taskHeading, taskDetails, taskStatus, taskPriority, dueDate } = req.body;
    const updateData = {};
    if (taskHeading) updateData.taskHeading = taskHeading;
    if (taskDetails !== undefined) updateData.taskDetails = taskDetails;
    if (taskStatus) updateData.taskStatus = taskStatus;
    if (taskPriority) updateData.taskPriority = taskPriority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).json({ errorMessage: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
  try {
    // Ensuring task exists before deletion to avoid errors
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMessage: 'Invalid task ID' });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ errorMessage: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ errorMessage: 'Failed to delete task' });
  }
}; 