// Defining the task schema with validation for our task board
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  taskHeading: {
    type: String,
    required: [true, 'taskHeading is required'], // Ensure title is always provided
    trim: true
  },
  taskDetails: {
    type: String,
    trim: true // Allow multi-line descriptions, trim whitespace
  },
  taskStatus: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'], // Restrict to predefined statuses
    default: 'To Do'
  },
  taskPriority: {
    type: String,
    enum: ['Low', 'Medium', 'High'], // Priority levels for tasks
    default: 'Low'
  },
  creationDate: {
    type: Date,
    default: Date.now // Auto-set creation timestamp
  },
  dueDate: {
    type: Date // Optional due date for tasks
  }
});

// Export the model for use in controllers
export default mongoose.model('Task', taskSchema); 