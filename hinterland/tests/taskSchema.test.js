import mongoose from 'mongoose';
import Task from '../models/Task.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Task Schema Validation', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should require taskHeading', async () => {
    const task = new Task({});
    await expect(task.validate()).rejects.toThrow('taskHeading is required');
  });

  test('should set default taskStatus to To Do', async () => {
    const task = new Task({ taskHeading: 'Sample Task' });
    expect(task.taskStatus).toBe('To Do');
  });

  test('should set default taskPriority to Low', async () => {
    const task = new Task({ taskHeading: 'Sample Task' });
    expect(task.taskPriority).toBe('Low');
  });

  test('should set creationDate to current timestamp', async () => {
    const task = new Task({ taskHeading: 'Sample Task' });
    expect(task.creationDate).toBeInstanceOf(Date);
    expect(task.creationDate.getTime()).toBeCloseTo(Date.now(), -1000);
  });

  test('should allow optional taskDetails and dueDate', async () => {
    const task = new Task({ taskHeading: 'Sample Task' });
    expect(task.taskDetails).toBeUndefined();
    expect(task.dueDate).toBeUndefined();
  });
}); 