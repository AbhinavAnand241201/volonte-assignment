import { format } from 'date-fns';
import PropTypes from 'prop-types';

// I render a detailed view of a task in a modal
function TaskDetails({ taskItem, isOpen, onClose }) {
  if (!isOpen) return null;

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

  // I highlight overdue tasks for visibility
  const now = new Date();
  const dueDate = taskItem.dueDate ? new Date(taskItem.dueDate) : null;
  const isOverdue = dueDate && dueDate < now;
  
  // I calculate hours until due
  const hoursUntilDue = dueDate ? (dueDate - now) / (1000 * 60 * 60) : null;
  
  // I define special indicators for different time frames
  const isDueWithin12Hours = dueDate && !isOverdue && hoursUntilDue <= 12;
  const isDueSoon = dueDate && !isOverdue && !isDueWithin12Hours && hoursUntilDue <= 48; // Due within 2 days but not within 12 hours

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full shadow-lg border border-gray-700 text-white">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-white">{taskItem.taskHeading}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            type="button"
            aria-label="Close details"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <span className={`inline-block px-2 py-1 rounded-full text-sm ${priorityColors[taskItem.taskPriority]?.badge || 'bg-gray-100 text-gray-800'}`}>
            {priorityColors[taskItem.taskPriority]?.icon} {taskItem.taskPriority}
          </span>
          <span className="ml-2 text-sm text-gray-600">
            Status: {taskItem.taskStatus}
          </span>
        </div>
        
        {taskItem.taskDetails && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1 text-gray-300">Details</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{taskItem.taskDetails}</p>
          </div>
        )}
        
        {taskItem.dueDate && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1 text-gray-300">Due Date</h3>
            <p className={`flex items-center ${isOverdue ? 'text-red-600 font-medium' : isDueWithin12Hours ? 'text-red-500 font-medium' : isDueSoon ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
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
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
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
    taskPriority: PropTypes.string.isRequired,
    taskStatus: PropTypes.string.isRequired,
    dueDate: PropTypes.string
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TaskDetails;
