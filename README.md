# Task Board Application

A full-stack task management application built with React, Node.js, and MongoDB Atlas. This application allows users to create, read, update, and delete tasks with features like priority levels, status tracking, and due dates.

## 🚀 Features

- **Task Management**
  - Create new tasks with detailed information
  - View all tasks in a clean, organized interface
  - Edit existing tasks
  - Delete tasks with confirmation
  - Filter tasks by status and priority

- **Task Properties**
  - Task heading (required)
  - Task details (optional)
  - Priority levels (High, Medium, Low)
  - Status tracking (To Do, In Progress, Done)
  - Due date with datetime picker

- **User Interface**
  - Modern, responsive design using Tailwind CSS
  - Intuitive task creation and editing forms
  - Confirmation modals for important actions
  - Real-time updates
  - Error handling and user feedback

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios for API calls
- Jest for testing

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- Jest for testing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for database)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbhinavAnand241201/volonte-assignment.git
   cd volonte-assignment/task-board
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd hinterland
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start the development servers**

   In one terminal (backend):
   ```bash
   cd hinterland
   npm run dev
   ```

   In another terminal (frontend):
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3333/api/tasks

## 📁 Project Structure

```
task-board/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── tests/          # Frontend tests
│   └── public/             # Static assets
│
└── hinterland/             # Node.js backend application
    ├── controllers/        # Route controllers
    ├── models/            # Mongoose models
    ├── routes/            # API routes
    ├── middleware/        # Custom middleware
    └── tests/             # Backend tests
```

## 🔧 API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd hinterland
npm test
```

## 🔒 Security Features

- CORS enabled
- Helmet.js for security headers
- Rate limiting
- Input validation
- Error handling middleware

## 🎨 UI/UX Features

- Responsive design
- Form validation
- Loading states
- Error messages
- Confirmation dialogs
- Clean and intuitive interface

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Abhinav Anand
- GitHub: [@AbhinavAnand241201](https://github.com/AbhinavAnand241201)

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Vite for the frontend build tool
- Tailwind CSS for styling
- Express.js for the backend framework 