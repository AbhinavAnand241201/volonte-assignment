import { format } from 'date-fns';
import PropTypes from 'prop-types';

// Component for displaying detailed task information in a modal
function TaskDetails({ taskItem, isOpen, onClose }) {
  if (!isOpen) return null;

  // Define status and priority color schemes
  const statusColors = {
    'To Do': 'bg-blue-100 text-blue-800 border-blue-200',
    'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Done': 'bg-green-100 text-green-800 border-green-200'
  };
  
  const priorityColors = {
    'High': {
      bg: 'bg-red-100 text-red-800',
      icon: '🔴'
    },
    'Medium': {
      bg: 'bg-yellow-100 text-yellow-800',
      icon: '🟡'
    },
    'Low': {
      bg: 'bg-green-100 text-green-800',
      icon: '🟢'
    }
  };
  
  // Check if task is overdue
  const now = new Date();
  const dueDate = taskItem.dueDate ? new Date(taskItem.dueDate) : null;
  const isOverdue = dueDate && dueDate < now;
  
  // Calculate hours until due
  const hoursUntilDue = dueDate ? (dueDate - now) / (1000 * 60 * 60) : null;
  
  // Special indicators for different time frames
  const isDueWithin12Hours = dueDate && !isOverdue && hoursUntilDue <= 12;
  const isDueSoon = dueDate && !isOverdue && !isDueWithin12Hours && hoursUntilDue <= 48; // Due within 2 days but not within 12 hours
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{taskItem.taskHeading}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-sm text-gray-500 block mb-1">Status</span>
            <span className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${statusColors[taskItem.taskStatus]}`}>
              {taskItem.taskStatus === 'To Do' ? '📋' : 
               taskItem.taskStatus === 'In Progress' ? '⏳' : '✅'} 
              <span className="ml-1">{taskItem.taskStatus}</span>
            </span>
          </div>
          
          <div>
            <span className="text-sm text-gray-500 block mb-1">Priority</span>
            <span className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${priorityColors[taskItem.taskPriority]?.bg}`}>
              {priorityColors[taskItem.taskPriority]?.icon} 
              <span className="ml-1">{taskItem.taskPriority}</span>
            </span>
          </div>
        
        </div>
        
        <div className="mb-6">
          <span className="text-sm text-gray-500 block mb-1">Timeline</span>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <span className="text-gray-600 mr-2">📅</span>
              <span className="text-sm">Created: {format(new Date(taskItem.creationDate), 'MMM d, yyyy')}</span>
            </div>
            
            {taskItem.dueDate && (
              <div className="flex items-center">
                <span className="mr-2">
                  {isOverdue ? '⚠️' : isDueWithin12Hours ? '⏰' : isDueSoon ? '⏳' : '📆'}
                </span>
                <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : isDueWithin12Hours ? 'text-red-500 font-medium' : isDueSoon ? 'text-orange-600 font-medium' : ''}`}>
                  {isDueWithin12Hours ? (
                    <span className="flex items-center">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2 animate-pulse">
                        {Math.ceil(hoursUntilDue)}h
                      </span>
                      <span className="text-red-600 font-bold">Urgent deadline</span>
                    </span>
                  ) : (
                    <>
                      Due: {format(new Date(taskItem.dueDate), 'MMM d, yyyy')}
                      {isOverdue && ' (Overdue)'}
                      {isDueSoon && !isOverdue && ' (Due soon)'}
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {taskItem.taskDetails && (
          <div className="mb-6">
            <span className="text-sm text-gray-500 block mb-1">Description</span>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-700 whitespace-pre-wrap">{taskItem.taskDetails}</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

TaskDetails.propTypes = {
  taskItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    taskHeading: PropTypes.string.isRequired,
    taskDetails: PropTypes.string,
    taskStatus: PropTypes.string.isRequired,
    taskPriority: PropTypes.string.isRequired,
    creationDate: PropTypes.string.isRequired,
    dueDate: PropTypes.string
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TaskDetails;
