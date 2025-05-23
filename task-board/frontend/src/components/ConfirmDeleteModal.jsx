import PropTypes from 'prop-types';

// I render a modal to confirm task deletion
function ConfirmDeleteModal({ taskItem, isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full shadow-lg border border-gray-700 text-white">
        <h2 className="text-xl font-bold mb-4 text-white">Confirm Deletion</h2>
        <p className="mb-4 text-gray-300">
          Are you sure you want to delete the task <strong className="text-white">"{taskItem.taskHeading}"</strong>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmDeleteModal.propTypes = {
  taskItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    taskHeading: PropTypes.string.isRequired
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ConfirmDeleteModal; 