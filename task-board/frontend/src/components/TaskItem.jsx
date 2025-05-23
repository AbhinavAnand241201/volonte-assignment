import { useState } from 'react';
// I render a single task card for the Kanban board
import { format } from 'date-fns';
import TaskDetails from './TaskDetails';
import TaskEdit from './TaskEdit';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { updateTask, deleteTask } from '../services/taskService';

function TaskItem({ taskItem, onUpdate, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // I define color schemes for different priorities
  const priorityColors = {
    'High': {
      badge: 'bg-red-100 text-red-800',
      border: 'border-red-200',
      icon: '🔴'
    },
    'Medium': {
      badge: 'bg-yellow-100 text-yellow-800',
      border: 'border-yellow-200',
      icon: '🟡'
    },
    'Low': {
      badge: 'bg-green-100 text-green-800',
      border: 'border-green-200',
      icon: '🟢'
    }
  };
  
  const priorityColor = priorityColors[taskItem.taskPriority]?.badge || 'bg-gray-100 text-gray-800';

  // I highlight overdue tasks for visibility
  const now = new Date();
  const dueDate = taskItem.dueDate ? new Date(taskItem.dueDate) : null;
  const isOverdue = dueDate && dueDate < now;
  
  // I calculate hours until due
  const hoursUntilDue = dueDate ? (dueDate - now) / (1000 * 60 * 60) : null;
  
  // I define special indicators for different time frames
  const isDueWithin12Hours = dueDate && !isOverdue && hoursUntilDue <= 12;
  const isDueSoon = dueDate && !isOverdue && !isDueWithin12Hours && hoursUntilDue <= 48; // Due within 2 days but not within 12 hours
  
  // I enhance styling for urgent tasks (within 12 hours)
  const overdueStyle = isOverdue ? 'border-2 border-red-500' : 
                      isDueWithin12Hours ? 'border-2 border-red-400 bg-red-50 shadow-md' : 
                      isDueSoon ? 'border-2 border-orange-400' : 
                      `border ${priorityColors[taskItem.taskPriority]?.border || 'border-gray-200'}`;

  const handleStatusChange = async (e) => {
    try {
      const updatedTask = await updateTask(taskItem._id, { taskStatus: e.target.value });
      onUpdate(updatedTask);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(taskItem._id);
      onDelete(taskItem._id);
      setShowDelete(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleEditSubmit = (updatedTask) => {
    onUpdate(updatedTask);
    setShowEdit(false);
  };

  return (
    <>
      <div
        className={`p-4 mb-2 rounded-lg ${isDueWithin12Hours ? 'shadow-md' : 'shadow-sm'} bg-gray-800 relative ${overdueStyle} hover:bg-gray-700 transition-colors ${isDueWithin12Hours ? 'animate-pulse-slow' : ''}`}
        data-testid="task-item"
        data-status={taskItem.taskStatus}
      >
        {isDueWithin12Hours && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse z-10">
            {Math.ceil(hoursUntilDue)}h left
          </div>
        )}
        <div onClick={() => setShowDetails(true)} className="cursor-pointer pr-20">
          <div className="flex items-center mb-1">
            <h3 className="font-semibold flex-1 text-white">{taskItem.taskHeading}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ml-2 ${priorityColor}`}>
              {priorityColors[taskItem.taskPriority]?.icon} {taskItem.taskPriority}
            </span>
          </div>
          
          {taskItem.taskDetails && (
            <p className="text-sm text-gray-300 mb-1 line-clamp-2">
              {taskItem.taskDetails.length > 100 
                ? `${taskItem.taskDetails.substring(0, 100)}...` 
                : taskItem.taskDetails}
            </p>
          )}
          
          {taskItem.dueDate && (
            <p className={`text-sm flex items-center ${isOverdue ? 'text-red-600 font-medium' : isDueWithin12Hours ? 'text-red-500 font-medium' : isDueSoon ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
              <span className="mr-1">
                {isOverdue ? '⚠️' : isDueWithin12Hours ? '⏰' : isDueSoon ? '⏳' : '📅'}
              </span>
              {isDueWithin12Hours ? (
                <>
                  <span className="text-red-600 font-bold">Urgent: </span>
                  <span>{Math.ceil(hoursUntilDue)} hour{Math.ceil(hoursUntilDue) !== 1 ? 's' : ''} remaining</span>
                </>
              ) : (
                <>Due: {format(new Date(taskItem.dueDate), 'MMM d, yyyy')}</>
              )}
            </p>
          )}
        </div>

        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={() => setShowEdit(true)}
            className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
            type="button"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
            type="button"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
      <TaskDetails taskItem={taskItem} isOpen={showDetails} onClose={() => setShowDetails(false)} />
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <TaskEdit taskItem={taskItem} onSubmit={handleEditSubmit} />
            <button
              onClick={() => setShowEdit(false)}
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        taskItem={taskItem}
        isOpen={showDelete}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}

export default TaskItem; 