// Main entry point for the task board UI
import TaskPanel from './components/TaskPanel';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TaskPanel />
    </div>
  );
}

export default App;
