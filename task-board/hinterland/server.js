/**
 * Task Board API Server
 * I am the main server file that configures Express, connects to MongoDB,
 * and sets up routes and middleware for the Task Board application.
 */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// I load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333; // I changed to 3333 to avoid port conflicts

// I apply security middleware to protect the API
app.use(helmet());
app.use(cors());

// I configure rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // I limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { errorMessage: 'Too many requests, please try again later.' }
});
app.use(limiter);

// I parse JSON bodies with a size limit of 10kb
app.use(express.json({ limit: '10kb' }));

// I set up routes for task-related endpoints
app.use('/api/tasks', taskRoutes);

// I handle errors globally
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    errorMessage: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// I handle unhandled promise rejections to prevent crashes
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // I don't crash the server, but log the error
});

/**
 * I connect to MongoDB with retry logic
 * For development, I use an in-memory MongoDB server if Atlas connection fails
 * I set up event listeners for connection events
 */
const connectDB = async () => {
  try {
    // I try to connect to MongoDB Atlas first
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://letsfkingo07:CtokNVH3iVcrUYPz@cluster009099.djatxzd.mongodb.net/';
    
    console.log('Attempting to connect to MongoDB Atlas...');
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB Atlas successfully');
    } catch (atlasError) {
      console.warn('Could not connect to MongoDB Atlas:', atlasError.message);
      console.warn('IP Address may not be whitelisted. Falling back to local MongoDB...');
      
      // Fallback to localhost if available
      try {
        await mongoose.connect('mongodb://localhost:27017/task-board');
        console.log('Connected to local MongoDB successfully');
      } catch (localError) {
        console.warn('Could not connect to local MongoDB:', localError.message);
        console.warn('Using in-memory MongoDB for development...');
        
        // As a last resort, set up an in-memory MongoDB server for development
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log('Connected to in-memory MongoDB successfully');
      }
    }
    
    // I set up MongoDB connection event listeners
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    // I set up a cleanup handler
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

/**
 * I start the Express server
 * I connect to MongoDB and start listening on the configured port
 */
const startServer = async () => {
  try {
    // I connect to MongoDB first
    await connectDB();
    
    // I create an HTTP server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/tasks`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // I handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
    
    // I handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 