// Trying to connect to MongoDB to ensure our URI and setup work
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://letsfkingo07:CtokNVH3iVcrUYPz@cluster009099.djatxzd.mongodb.net/';

console.log('Attempting to connect to MongoDB with URI:', mongoURI);

// Connect to MongoDB (removed deprecated options)
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    console.log('Connection details:', mongoose.connection.host, mongoose.connection.name);
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    console.error('Full error:', err);
  }); 