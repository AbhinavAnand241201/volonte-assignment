import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import Task from '../models/Task.js';
import taskRoutes from '../routes/taskRoutes.js';

const appInstance = express();
appInstance.use(cors());
appInstance.use(express.json());
appInstance.use('/api/tasks', taskRoutes);

describe('Task Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Task.deleteMany({}); // Clear tasks before each test
  });

  test('should return empty array when no tasks exist', async () => {
    const response = await request(appInstance).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
}); 