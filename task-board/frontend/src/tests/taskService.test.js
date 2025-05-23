import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { fetchTasks, createTask, updateTask } from '../services/taskService';

describe('Task Service', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  test('should fetch tasks successfully', async () => {
    const mockTasks = [
      { _id: '1', taskHeading: 'Task 1', taskStatus: 'To Do', taskPriority: 'Low', creationDate: '2025-05-22' }
    ];
    mock.onGet('http://localhost:5000/api/tasks').reply(200, mockTasks);

    const tasks = await fetchTasks();
    expect(tasks).toEqual(mockTasks);
  });

  test('should handle API error', async () => {
    mock.onGet('http://localhost:5000/api/tasks').reply(500, { errorMessage: 'Server error' });

    await expect(fetchTasks()).rejects.toThrow('Failed to fetch tasks');
  });

  test('should create task successfully', async () => {
    const newTask = {
      taskHeading: 'New Task',
      taskDetails: 'Details',
      taskStatus: 'To Do',
      taskPriority: 'Medium',
      dueDate: '2025-06-01'
    };
    const createdTask = { _id: '2', ...newTask, creationDate: '2025-05-22' };
    mock.onPost('http://localhost:5000/api/tasks').reply(201, createdTask);
    const result = await createTask(newTask);
    expect(result).toEqual(createdTask);
  });

  test('should throw error for invalid create request', async () => {
    mock.onPost('http://localhost:5000/api/tasks').reply(400, { errorMessage: 'taskHeading is required' });
    await expect(createTask({})).rejects.toThrow('Failed to create task');
  });

  test('should update task successfully', async () => {
    const updatedTask = {
      taskHeading: 'Updated Task',
      taskStatus: 'In Progress',
      taskPriority: 'High'
    };
    const taskId = '1';
    mock.onPut(`http://localhost:5000/api/tasks/${taskId}`).reply(200, { _id: taskId, ...updatedTask });
    const result = await updateTask(taskId, updatedTask);
    expect(result).toEqual({ _id: taskId, ...updatedTask });
  });

  test('should throw error for invalid update request', async () => {
    mock.onPut('http://localhost:5000/api/tasks/invalid-id').reply(400, { errorMessage: 'Invalid task ID' });
    await expect(updateTask('invalid-id', {})).rejects.toThrow('Failed to update task');
  });
}); 