/**
 * Task Model
 * I define the schema and methods for tasks in the Task Board application
 * @module models/Task
 */
const mongoose = require('mongoose');

/**
 * Task Schema Definition
 * @type {mongoose.Schema}
 */
const taskSchema = new mongoose.Schema({
  /**
   * Task title/heading
   * @type {String}
   * @required
   */
  taskHeading: {
    type: String,
    required: [true, 'taskHeading is required'],
    trim: true,
    maxlength: [100, 'Task heading cannot exceed 100 characters']
  },
  /**
   * Detailed description of the task
   * @type {String}
   * @optional
   */
  taskDetails: {
    type: String,
    trim: true,
    maxlength: [1000, 'Task details cannot exceed 1000 characters']
  },
  /**
   * Current status of the task
   * @type {String}
   * @enum ['To Do', 'In Progress', 'Done']
   */
  taskStatus: {
    type: String,
    enum: {
      values: ['To Do', 'In Progress', 'Done'],
      message: '{VALUE} is not a valid status'
    },
    default: 'To Do'
  },
  /**
   * Priority level of the task
   * @type {String}
   * @enum ['Low', 'Medium', 'High']
   */
  taskPriority: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: '{VALUE} is not a valid priority level'
    },
    default: 'Low'
  },
  /**
   * Date when the task was created
   * @type {Date}
   * @default Current date/time
   */
  creationDate: {
    type: Date,
    default: Date.now,
    immutable: true // I ensure this field cannot be changed once set
  },
  
  /**
   * Due date for task completion
   * @type {Date}
   * @optional
   */
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // I ensure the due date is either null/undefined or a future date
        return !value || value > new Date();
      },
      message: 'Due date must be in the future'
    }
  }
}, {
  // I add timestamps for when documents are created or updated
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  
  // I add virtual properties when converting to JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Virtual property to check if task is overdue
 * @returns {Boolean} True if task is overdue
 */
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return this.dueDate < new Date() && this.taskStatus !== 'Done';
});

/**
 * Pre-save middleware to validate data before saving
 */
taskSchema.pre('save', function(next) {
  // I can add additional validation here if needed
  next();
});

/**
 * Task model
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('Task', taskSchema); 