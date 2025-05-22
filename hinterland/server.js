// Setting up the core server for our task board API
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const appInstance = express();

// Apply middleware
appInstance.use(cors());
appInstance.use(express.json());

// Routes
appInstance.use('/api/tasks', taskRoutes);
appInstance.get('/api/health', (req, res) => {
  res.status(200).json({ serverStatus: 'Hinterland is operational' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Start the server
const serverPort = process.env.PORT || 5000;
appInstance.listen(serverPort, () => {
  console.log(`Hinterland running on port ${serverPort}`);
}); 