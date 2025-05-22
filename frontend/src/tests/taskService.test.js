import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { fetchTasks } from '../services/taskService';

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
}); 