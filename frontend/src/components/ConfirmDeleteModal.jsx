import PropTypes from 'prop-types';

// Prompting user to confirm task deletion
function ConfirmDeleteModal({ taskItem, isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
        <div className="flex items-center mb-4 text-red-500">
          <span className="text-2xl mr-2">⚠️</span>
          <h2 className="text-lg font-semibold">Delete Task</h2>
        </div>
        
        <p className="mb-2 font-medium text-gray-800">Are you sure you want to delete "{taskItem.taskHeading}"?</p>
        <p className="mb-6 text-gray-600">This action cannot be undone.</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center"
            type="button"
          >
            <span className="mr-1">🗑️</span> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmDeleteModal.propTypes = {
  taskItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    taskHeading: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDeleteModal; 