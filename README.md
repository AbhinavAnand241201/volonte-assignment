# Task Board Application

A clean, intuitive, and visually organized task management application that allows users to create, manage, and track their personal tasks through different stages of completion.

## Features

- **Create Tasks**: Add new tasks with title, description, status, priority, and due date
- **Visualize Tasks**: View tasks organized in columns by status (To Do, In Progress, Done)
- **Manage Tasks**: Edit task details, change status, and delete tasks
- **Visual Indicators**: Color-coded priority levels and visual cues for overdue tasks
- **Responsive Design**: Works well on different screen sizes

## Tech Stack

### Frontend
- React.js
- Tailwind CSS for styling
- Vite for build tooling and development server

### Backend
- Node.js with Express
- MongoDB for data persistence
- Mongoose for MongoDB object modeling

## Project Structure

The project is organized into two main directories:

- **frontend/**: Contains the React application
- **hinterland/**: Contains the Express backend server

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AbhinavAnand241201/volonte-assignment.git
cd volonte-assignment
```

2. Install backend dependencies:
```bash
cd task-board/hinterland
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the `hinterland` directory
   - Add the following variables:
     ```
     PORT=3333
     MONGO_URI=your_mongodb_connection_string
     NODE_ENV=development
     ```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd task-board/hinterland
npm run dev
```

2. Start the frontend development server:
```bash
cd task-board/frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

- **GET /api/tasks**: Get all tasks
- **POST /api/tasks**: Create a new task
- **GET /api/tasks/:id**: Get a specific task
- **PUT /api/tasks/:id**: Update a task
- **DELETE /api/tasks/:id**: Delete a task

## Future Enhancements

- Drag-and-drop functionality for changing task status
- User authentication and personalized task boards
- Task filtering and sorting options
- Mobile application
- Email notifications for upcoming due dates

## License

This project is licensed under the MIT License - see the LICENSE file for details.
