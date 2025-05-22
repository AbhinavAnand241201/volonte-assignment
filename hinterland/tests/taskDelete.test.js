import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import taskRoutes from '../routes/taskRoutes.js';
import Task from '../models/Task.js';
import dotenv from 'dotenv';

dotenv.config();

const appInstance = express();
appInstance.use(cors());
appInstance.use(express.json());
appInstance.use('/api/tasks', taskRoutes);

describe('Task Delete Endpoint', () => {
  let taskId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    await Task.deleteMany({});
    const task = await new Task({
      taskHeading: 'Task to Delete',
      taskStatus: 'To Do',
      taskPriority: 'Low'
    }).save();
    taskId = task._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should delete task with valid ID', async () => {
    const response = await request(appInstance).delete(`/api/tasks/${taskId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');
    const task = await Task.findById(taskId);
    expect(task).toBeNull();
  });

  test('should return 400 for invalid ID', async () => {
    const response = await request(appInstance).delete('/api/tasks/invalid-id');
    expect(response.status).toBe(400);
    expect(response.body.errorMessage).toMatch(/Invalid task ID/);
  });

  test('should return 404 for non-existent task', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const response = await request(appInstance).delete(`/api/tasks/${nonExistentId}`);
    expect(response.status).toBe(404);
    expect(response.body.errorMessage).toMatch(/Task not found/);
  });
}); 