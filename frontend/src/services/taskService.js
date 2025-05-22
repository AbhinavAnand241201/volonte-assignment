// Fetching tasks from the hinterland API
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch tasks');
  }
}; 