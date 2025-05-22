import React from 'react';
// Rendering a single task card for the Kanban board
import { format } from 'date-fns';

function TaskItem({ taskItem }) {
  const priorityColors = {
    'High': 'bg-red-100 text-red-800 border-red-200',
    'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Low': 'bg-green-100 text-green-800 border-green-200'
  };

  const statusIcons = {
    'To Do': '📝',
    'In Progress': '⚡',
    'Done': '✅'
  };

  return (
    <div 
      className={`p-4 rounded-lg shadow-sm bg-white border-2 ${priorityColors[taskItem.taskPriority]} transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer`}
      data-testid="task-item"
      data-status={taskItem.taskStatus}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{taskItem.taskHeading}</h3>
          <div className="flex items-center space-x-2 text-sm">
            <span className={`px-2 py-1 rounded-full ${priorityColors[taskItem.taskPriority]}`}>
              {taskItem.taskPriority}
            </span>
            <span className="text-gray-500">
              {statusIcons[taskItem.taskStatus]} {taskItem.taskStatus}
            </span>
          </div>
        </div>
      </div>
      
      {taskItem.dueDate && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600 flex items-center">
            <span className="mr-1">📅</span>
            Due: {format(new Date(taskItem.dueDate), 'MMM d, yyyy')}
          </p>
        </div>
      )}
    </div>
  );
}

export default TaskItem; 