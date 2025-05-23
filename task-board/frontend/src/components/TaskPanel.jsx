import { useState, useEffect } from 'react';
import { fetchTasks } from '../services/taskService';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

function TaskPanel() {
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const response = await fetchTasks();
      // I check if the response contains a tasks property (from pagination)
      const tasks = response.tasks || response;
      setTaskList(tasks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = (newTask) => {
    setTaskList(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTaskList(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task));
  };

  const handleDeleteTask = (taskId) => {
    setTaskList(prev => prev.filter(task => task._id !== taskId));
  };

  const statusGroups = {
    'To Do': taskList.filter(t => t.taskStatus === 'To Do'),
    'In Progress': taskList.filter(t => t.taskStatus === 'In Progress'),
    'Done': taskList.filter(t => t.taskStatus === 'Done')
  };

  const columnColors = {
    'To Do': 'bg-gray-900 border-blue-700',
    'In Progress': 'bg-gray-900 border-yellow-700',
    'Done': 'bg-gray-900 border-green-700'
  };

  return (
    <div>
      <TaskForm onSubmit={handleAddTask} />
      {isLoading ? (
        <p className="text-gray-400">Loading tasks...</p>
      ) : (
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {['To Do', 'In Progress', 'Done'].map(status => (
            <div 
              key={status} 
              className={`flex-1 p-4 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto border-2 ${columnColors[status]}`}
            >
              <h2 className="text-lg font-bold mb-4 text-center text-white border-b border-gray-700 pb-2">
                {status === 'To Do' ? '📋 To Do' : status === 'In Progress' ? '⏳ In Progress' : '✅ Done'}
              </h2>
              {statusGroups[status].length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <span className="text-3xl mb-2">{status === 'To Do' ? '📋' : status === 'In Progress' ? '⏳' : '✅'}</span>
                  <p>No tasks</p>
                </div>
              ) : (
                statusGroups[status].map(task => (
                  <TaskItem
                    key={task._id}
                    taskItem={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskPanel; 