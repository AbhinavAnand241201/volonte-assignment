// Main server file
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

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

// Connect to MongoDB with retry logic
const connectDB = async () => {
  try {
    // Use MongoDB Memory Server for development
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    console.log('Connecting to in-memory MongoDB...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to in-memory MongoDB successfully');
    
    // Store the mongod instance to close it when the server shuts down
    global.__MONGOD__ = mongod;
    
    // Set up a cleanup handler
    process.on('SIGINT', async () => {
      if (global.__MONGOD__) {
        await global.__MONGOD__.stop();
        console.log('In-memory MongoDB server stopped');
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start MongoDB:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 