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
      // Check if the response contains a tasks property (from pagination)
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
    'To Do': 'bg-blue-50 border-blue-200',
    'In Progress': 'bg-yellow-50 border-yellow-200',
    'Done': 'bg-green-50 border-green-200'
  };

  return (
    <div>
      <TaskForm onSubmit={handleAddTask} />
      {isLoading ? (
        <p className="text-gray-500">Loading tasks...</p>
      ) : (
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {['To Do', 'In Progress', 'Done'].map(status => (
            <div 
              key={status} 
              className={`flex-1 p-4 rounded-lg shadow-md max-h-[70vh] overflow-y-auto border ${columnColors[status]}`}
            >
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