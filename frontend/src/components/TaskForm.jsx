import React from 'react';
import { useState } from 'react';
import { createTask } from '../services/taskService';

// Form for adding new tasks to the board
function TaskForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    taskHeading: '',
    taskDetails: '',
    taskStatus: 'To Do',
    taskPriority: 'Low',
    dueDate: ''
  });
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Handling form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.taskHeading.trim()) {
      setError('Task title is required');
      return;
    }
    try {
      const newTask = await createTask(formData);
      onSubmit(newTask);
      setFormData({ taskHeading: '', taskDetails: '', taskStatus: 'To Do', taskPriority: 'Low', dueDate: '' });
    } catch (error) {
      setError('Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6 border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center">
        <span className="mr-2">➕</span> Add New Task
      </h2>
      
      <div className="mb-4">
        <label htmlFor="taskHeading" className="block text-sm font-medium text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="taskHeading"
          name="taskHeading"
          placeholder="Enter task title"
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
          placeholder="Enter task details (optional)"
          value={formData.taskDetails}
          onChange={handleChange}
          rows="3"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
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
      
      <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0">
        <button 
          type="button" 
          onClick={() => setFormData({ taskHeading: '', taskDetails: '', taskStatus: 'To Do', taskPriority: 'Low', dueDate: '' })}
          className="sm:mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto"
        >
          Clear
        </button>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center w-full sm:w-auto"
        >
          <span className="mr-1">➕</span> Add Task
        </button>
      </div>
    </form>
  );
}

export default TaskForm; 