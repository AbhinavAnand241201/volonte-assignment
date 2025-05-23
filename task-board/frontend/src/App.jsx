// I am the main entry point for the task board UI
import TaskPanel from './components/TaskPanel';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 shadow-md py-4 mb-6 border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center">
            <span className="text-2xl mr-2">📋</span>
            <h1 className="text-2xl font-bold text-white">Task Board</h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 pb-10">
        <TaskPanel />
      </main>
      
      <footer className="bg-gray-900 py-4 border-t border-gray-800 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 text-center text-gray-400 text-sm">
          Task Board Application &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default App;
