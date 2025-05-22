// Fetching and managing tasks via the hinterland API
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333/api';

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.errorMessage || 'Failed to fetch tasks';
    throw new Error(errorMessage);
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    // Sending new task data to the hinterland
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.errorMessage || 'Failed to create task';
    throw new Error(errorMessage);
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    // Updating task with provided fields
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.errorMessage || 'Failed to update task';
    throw new Error(errorMessage);
  }
};

// Removing a task from the hinterland
export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.errorMessage || 'Failed to delete task';
    throw new Error(errorMessage);
  }
}; 