const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const taskRoutes = require('../routes/taskRoutes');
const Task = require('../models/Task');
const dotenv = require('dotenv');

dotenv.config();

const appInstance = express();
appInstance.use(cors());
appInstance.use(express.json());
appInstance.use('/api/tasks', taskRoutes);

describe('Task Creation Endpoint', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    await Task.deleteMany({}); // Clear tasks before each test
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should create a task with valid data', async () => {
    const newTask = {
      taskHeading: 'Write project proposal',
      taskDetails: 'Draft the initial proposal for client',
      taskStatus: 'To Do',
      taskPriority: 'High',
      dueDate: '2025-06-01'
    };
    const response = await request(appInstance)
      .post('/api/tasks')
      .send(newTask);
    expect(response.status).toBe(201);
    expect(response.body.taskHeading).toBe(newTask.taskHeading);
    expect(response.body.taskStatus).toBe(newTask.taskStatus);
    expect(response.body.taskPriority).toBe(newTask.taskPriority);
    expect(response.body.taskDetails).toBe(newTask.taskDetails);
    expect(new Date(response.body.dueDate)).toEqual(new Date(newTask.dueDate));
    expect(response.body.creationDate).toBeDefined();
  });

  test('should return 400 if taskHeading is missing', async () => {
    const invalidTask = {
      taskDetails: 'Missing title task',
      taskStatus: 'To Do',
      taskPriority: 'Low'
    };
    const response = await request(appInstance)
      .post('/api/tasks')
      .send(invalidTask);
    expect(response.status).toBe(400);
    expect(response.body.errorMessage).toMatch(/taskHeading is required/);
  });

  test('should return 400 for invalid taskStatus', async () => {
    const invalidTask = {
      taskHeading: 'Invalid status task',
      taskStatus: 'Invalid',
      taskPriority: 'Low'
    };
    const response = await request(appInstance)
      .put(`/api/tasks/${taskId}`)
      .send(invalidTask);
    expect(response.status).toBe(400);
    expect(response.body.errorMessage).toMatch(/taskStatus/);
  });
}); 