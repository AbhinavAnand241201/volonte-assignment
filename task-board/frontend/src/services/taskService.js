/**
 * I am the Task Service - I handle all API interactions for tasks
 */
import axios from 'axios';

// Use environment variables if available, otherwise fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

// Configure axios defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Add request interceptor for potential auth tokens in the future
apiClient.interceptors.request.use(
  config => {
    // Future enhancement: Add auth token here if needed
    return config;
  },
  error => Promise.reject(error)
);

/**
 * I fetch all tasks from the API
 * @returns {Promise<Array>} Array of task objects
 */
export const fetchTasks = async () => {
  try {
    const response = await apiClient.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    const errorMessage = error.response?.data?.errorMessage || 'Failed to fetch tasks';
    throw new Error(errorMessage);
  }
};

/**
 * I create a new task
 * @param {Object} taskData - Task data object containing title, description, status, priority, etc.
 * @returns {Promise<Object>} Created task object
 */
export const createTask = async (taskData) => {
  try {
    // Validate required fields before sending to server
    if (!taskData.taskHeading) {
      throw new Error('Task title is required');
    }
    
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    const errorMessage = error.response?.data?.errorMessage || 'Failed to create task';
    throw new Error(errorMessage);
  }
};

/**
 * I update an existing task
 * @param {string} taskId - ID of the task to update
 * @param {Object} taskData - Updated task data
 * @returns {Promise<Object>} Updated task object
 */
export const updateTask = async (taskId, taskData) => {
  try {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    const response = await apiClient.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    const errorMessage = error.response?.data?.errorMessage || 'Failed to update task';
    throw new Error(errorMessage);
  }
};

/**
 * I delete a task
 * @param {string} taskId - ID of the task to delete
 * @returns {Promise<Object>} Response with success message
 */
export const deleteTask = async (taskId) => {
  try {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    const errorMessage = error.response?.data?.errorMessage || 'Failed to delete task';
    throw new Error(errorMessage);
  }
}; 