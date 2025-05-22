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

describe('Task Get All Endpoint', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    await Task.deleteMany({});
    await Task.insertMany([
      {
        taskHeading: 'Task 1',
        taskStatus: 'To Do',
        taskPriority: 'Low'
      },
      {
        taskHeading: 'Task 2',
        taskStatus: 'In Progress',
        taskPriority: 'Medium'
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should retrieve all tasks', async () => {
    const response = await request(appInstance).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].taskHeading).toBe('Task 1');
    expect(response.body[1].taskHeading).toBe('Task 2');
  });

  test('should return empty array when no tasks exist', async () => {
    await Task.deleteMany({});
    const response = await request(appInstance).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
}); 