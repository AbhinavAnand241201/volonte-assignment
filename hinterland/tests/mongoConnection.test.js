import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

describe('MongoDB Connection', () => {
  // Setup before all tests
  beforeAll(async () => {
    // Attempt to connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test case: Verify connection state
  test('should establish connection to MongoDB', async () => {
    // readyState 1 means connected
    expect(mongoose.connection.readyState).toBe(1);
  });
}); 