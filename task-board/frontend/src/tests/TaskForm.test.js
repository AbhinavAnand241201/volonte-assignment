import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../components/TaskForm';
import * as taskService from '../services/taskService';

jest.mock('../services/taskService');

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    taskService.createTask.mockReset();
  });

  test('should render form fields', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  test('should call onSubmit with valid data', async () => {
    const taskData = {
      taskHeading: 'New Task',
      taskDetails: 'Details',
      taskStatus: 'To Do',
      taskPriority: 'Medium',
      dueDate: '2025-06-01'
    };
    taskService.createTask.mockResolvedValue({ _id: '1', ...taskData });
    render(<TaskForm onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByLabelText(/Task Title/i), { target: { value: taskData.taskHeading } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: taskData.taskDetails } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: taskData.taskStatus } });
    fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: taskData.taskPriority } });
    fireEvent.change(screen.getByLabelText(/Due Date/i), { target: { value: taskData.dueDate } });
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining(taskData));
    });
  });

  test('should show validation error for missing taskHeading', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));
    expect(await screen.findByText(/Task title is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
}); 