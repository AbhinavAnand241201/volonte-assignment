import { useState } from 'react';
import PropTypes from 'prop-types';
import { updateTask } from '../services/taskService';

// Component for editing task information
function TaskEdit({ taskItem, onSubmit }) {
  const [formData, setFormData] = useState({
    taskHeading: taskItem.taskHeading,
    taskDetails: taskItem.taskDetails || '',
    taskStatus: taskItem.taskStatus,
    taskPriority: taskItem.taskPriority,
    dueDate: taskItem.dueDate ? new Date(taskItem.dueDate).toISOString().split('T')[0] : ''
  });
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Submit form with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.taskHeading.trim()) {
      setError('Task title is required');
      return;
    }
    try {
      const updatedTask = await updateTask(taskItem._id, formData);
      onSubmit(updatedTask);
    } catch (error) {
      setError('Failed to update task');
      console.error('Update error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Task</h2>
      <div className="mb-4">
        <label htmlFor="taskHeading" className="block text-sm font-medium text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="taskHeading"
          name="taskHeading"
          value={formData.taskHeading}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="taskDetails" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="taskDetails"
          name="taskDetails"
          value={formData.taskDetails}
          onChange={handleChange}
          rows="3"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="taskStatus"
            name="taskStatus"
            value={formData.taskStatus}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            id="taskPriority"
            name="taskPriority"
            value={formData.taskPriority}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center mr-2"
        >
          <span className="mr-1">💾</span> Save Changes
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
    taskStatus: PropTypes.string.isRequired,
    taskPriority: PropTypes.string.isRequired,
    dueDate: PropTypes.string
  }).isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default TaskEdit;
