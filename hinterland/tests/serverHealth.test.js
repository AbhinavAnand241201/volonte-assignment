import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Create a minimal Express app for testing
const appInstance = express();
appInstance.use(cors());
appInstance.get('/api/health', (req, res) => {
  res.status(200).json({ serverStatus: 'Hinterland is operational' });
});

describe('Express Server Health Check', () => {
  test('should respond with 200 and status message on /api/health', async () => {
    const response = await request(appInstance).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ serverStatus: 'Hinterland is operational' });
  });
}); 