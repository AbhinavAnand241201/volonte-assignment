import React from 'react';
// Grouping tasks by status for the Kanban view
import { useState, useEffect } from 'react';
import { fetchTasks } from '../services/taskService';
import TaskItem from './TaskItem';

function TaskPanel() {
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks on component mount
  useEffect(() => {
    async function loadTasks() {
      try {
        const tasks = await fetchTasks();
        setTaskList(tasks);
        setIsLoading(false);
      } catch (error) {
        // Log error for debugging
        console.error('Error loading tasks:', error);
        setIsLoading(false);
      }
    }
    loadTasks();
  }, []);

  // Group tasks by status
  const statusGroups = {
    'To Do': taskList.filter(t => t.taskStatus === 'To Do'),
    'In Progress': taskList.filter(t => t.taskStatus === 'In Progress'),
    'Done': taskList.filter(t => t.taskStatus === 'Done')
  };

  const columnColors = {
    'To Do': 'bg-blue-50 border-blue-200',
    'In Progress': 'bg-yellow-50 border-yellow-200',
    'Done': 'bg-green-50 border-green-200'
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your tasks efficiently</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['To Do', 'In Progress', 'Done'].map(status => (
              <div 
                key={status} 
                className={`${columnColors[status]} rounded-lg shadow-sm border-2 min-h-[500px] p-4 transition-all duration-200 hover:shadow-md`}
                data-status={status}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">{status}</h2>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-white shadow-sm">
                    {statusGroups[status].length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {statusGroups[status].length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
                      <p>No tasks</p>
                    </div>
                  ) : (
                    statusGroups[status].map(task => (
                      <TaskItem key={task._id} taskItem={task} />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskPanel; 