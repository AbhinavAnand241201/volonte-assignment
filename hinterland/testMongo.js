// Trying to connect to MongoDB to ensure our URI and setup work
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection failed:', err.message)); 