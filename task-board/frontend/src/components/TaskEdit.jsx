import { useState } from 'react';
import PropTypes from 'prop-types';
import { updateTask } from '../services/taskService';

// I render a form for editing existing tasks
function TaskEdit({ taskItem, onSubmit }) {
  const [formData, setFormData] = useState({
    taskHeading: taskItem.taskHeading,
    taskDetails: taskItem.taskDetails || '',
    taskPriority: taskItem.taskPriority,
    taskStatus: taskItem.taskStatus,
    dueDate: taskItem.dueDate ? new Date(taskItem.dueDate).toISOString().slice(0, 16) : ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.taskHeading.trim()) {
      newErrors.taskHeading = 'Task heading is required';
    }
    if (formData.taskHeading.length > 100) {
      newErrors.taskHeading = 'Task heading must be less than 100 characters';
    }
    if (formData.taskDetails && formData.taskDetails.length > 1000) {
      newErrors.taskDetails = 'Task details must be less than 1000 characters';
    }
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      if (dueDate < new Date()) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // I clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const updatedTask = await updateTask(taskItem._id, formData);
      onSubmit(updatedTask);
    } catch (error) {
      console.error('Failed to update task:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to update task. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
      <div className="mb-4">
        <label htmlFor="taskHeading" className="block text-sm font-medium text-gray-300 mb-1">
          Task Heading *
        </label>
        <input
          type="text"
          id="taskHeading"
          name="taskHeading"
          value={formData.taskHeading}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white ${errors.taskHeading ? 'border-red-500' : 'border-gray-600'}`}
          placeholder="Enter task heading"
        />
        {errors.taskHeading && (
          <p className="mt-1 text-sm text-red-600">{errors.taskHeading}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="taskDetails" className="block text-sm font-medium text-gray-300 mb-1">
          Task Details
        </label>
        <textarea
          id="taskDetails"
          name="taskDetails"
          value={formData.taskDetails}
          onChange={handleChange}
          rows="3"
          className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white ${errors.taskDetails ? 'border-red-500' : 'border-gray-600'}`}
          placeholder="Enter task details"
        />
        {errors.taskDetails && (
          <p className="mt-1 text-sm text-red-600">{errors.taskDetails}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-300 mb-1">
            Priority
          </label>
          <select
            id="taskPriority"
            name="taskPriority"
            value={formData.taskPriority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-300 mb-1">
            Status
          </label>
          <select
            id="taskStatus"
            name="taskStatus"
            value={formData.taskStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white ${errors.dueDate ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md">
          {errors.submit}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Updating...' : 'Update Task'}
        </button>
      </div>
    </form>
  );
}

TaskEdit.propTypes = {
  taskItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    taskHeading: PropTypes.string.isRequired,
    taskDetails: PropTypes.string,
    taskPriority: PropTypes.string.isRequired,
    taskStatus: PropTypes.string.isRequired,
    dueDate: PropTypes.string
  }).isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default TaskEdit;
