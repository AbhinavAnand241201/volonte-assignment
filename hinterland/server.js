/**
 * Task Board API Server
 * Main server file that configures Express, connects to MongoDB,
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

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333; // Changed to 3333 to avoid port conflicts

// Apply security middleware
app.use(helmet());
app.use(cors());

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { errorMessage: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Parse JSON bodies
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    errorMessage: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, but log the error
});

/**
 * Connect to MongoDB with retry logic
 * Establishes connection to MongoDB Atlas using connection string from environment variables
 * Sets up event listeners for connection events
 */
const connectDB = async () => {
  try {
    // Use MongoDB Atlas connection string from environment variables or fallback to the provided string
    // NOTE: In production, always use environment variables for sensitive information
    const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://letsfkingo07:CtokNVH3iVcrUYPz@cluster009099.djatxzd.mongodb.net/task-board';
    
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB Atlas successfully');
    
    // Set up MongoDB connection event listeners
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    // Set up a cleanup handler
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    process.exit(1);
  }
};

/**
 * Start the Express server
 * Connects to MongoDB and starts listening on the configured port
 */
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Create HTTP server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/tasks`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
    
    // Graceful shutdown
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