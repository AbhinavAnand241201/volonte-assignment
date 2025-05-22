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

describe('Task Update Endpoint', () => {
  let taskId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    await Task.deleteMany({});
    const task = await new Task({
      taskHeading: 'Original Task',
      taskStatus: 'To Do',
      taskPriority: 'Low'
    }).save();
    taskId = task._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should update task with valid data', async () => {
    const updatedTask = {
      taskHeading: 'Updated Task',
      taskDetails: 'New details',
      taskStatus: 'In Progress',
      taskPriority: 'High',
      dueDate: '2025-06-02'
    };
    const response = await request(appInstance)
      .put(`/api/tasks/${taskId}`)
      .send(updatedTask);
    expect(response.status).toBe(200);
    expect(response.body.taskHeading).toBe(updatedTask.taskHeading);
    expect(response.body.taskStatus).toBe(updatedTask.taskStatus);
    expect(response.body.taskPriority).toBe(updatedTask.taskPriority);
    expect(response.body.taskDetails).toBe(updatedTask.taskDetails);
    expect(new Date(response.body.dueDate)).toEqual(new Date(updatedTask.dueDate));
  });

  test('should return 400 for invalid ID', async () => {
    const response = await request(appInstance)
      .put('/api/tasks/invalid-id')
      .send({ taskHeading: 'Test' });
    expect(response.status).toBe(400);
    expect(response.body.errorMessage).toMatch(/Invalid task ID/);
  });

  test('should return 404 for non-existent task', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const response = await request(appInstance)
      .put(`/api/tasks/${nonExistentId}`)
      .send({ taskHeading: 'Test' });
    expect(response.status).toBe(404);
    expect(response.body.errorMessage).toMatch(/Task not found/);
  });

  test('should return 400 for invalid taskStatus', async () => {
    const response = await request(appInstance)
      .put(`/api/tasks/${taskId}`)
      .send({ taskStatus: 'Invalid' });
    expect(response.status).toBe(400);
    expect(response.body.errorMessage).toMatch(/taskStatus/);
  });
}); 