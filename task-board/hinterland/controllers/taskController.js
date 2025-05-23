/**
 * Task Controller
 * I handle all task-related operations including CRUD operations
 * and business logic for the Task Board application.
 */
const Task = require('../models/Task');
const mongoose = require('mongoose');

/**
 * I get all tasks with filtering, pagination, and sorting
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with tasks and pagination metadata
 */
const getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'creationDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const status = req.query.status;
    const priority = req.query.priority;

    // I build the query based on filters
    const query = {};
    if (status) query.taskStatus = status;
    if (priority) query.taskPriority = priority;

    // I calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // I execute the query with pagination and sorting
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query)
    ]);

    // I calculate pagination metadata
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

/**
 * I create a new task
 * @param {Object} req - Express request object with task data in body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created task or error message
 */
const createTask = async (req, res) => {
  try {
    // I validate input before saving to avoid bad data
    const { taskHeading, taskDetails, taskStatus, taskPriority, dueDate } = req.body;

    // I check for required taskHeading
    if (!taskHeading) {
      return res.status(400).json({ errorMessage: 'taskHeading is required' });
    }

    // I create a task object
    const newTask = new Task({
      taskHeading,
      taskDetails,
      taskStatus: taskStatus || 'To Do', // I fallback to default if not provided
      taskPriority: taskPriority || 'Low',
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    // I save to MongoDB
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    // I handle validation or database errors
    console.error('Error creating task:', error);
    res.status(400).json({ errorMessage: error.message });
  }
};

/**
 * I get a single task by ID
 * @param {Object} req - Express request object with task ID in params
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with task data or error message
 */
const getTaskById = async (req, res) => {
  try {
    // I check ID validity to prevent MongoDB errors
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

/**
 * I update an existing task
 * @param {Object} req - Express request object with task ID in params and updated data in body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated task or error message
 */
const updateTask = async (req, res) => {
  try {
    // I check ID validity to prevent MongoDB errors
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMessage: 'Invalid task ID' });
    }

    // I update only provided fields to avoid overwriting defaults
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
    // I handle validation or database errors
    console.error('Error updating task:', error);
    res.status(400).json({ errorMessage: error.message });
  }
};

/**
 * I delete a task by ID
 * @param {Object} req - Express request object with task ID in params
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message or error message
 */
const deleteTask = async (req, res) => {
  try {
    // I ensure the task exists before deletion to avoid errors
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

module.exports = {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
}; 