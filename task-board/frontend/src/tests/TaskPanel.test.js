import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskPanel from '../components/TaskPanel';
import * as taskService from '../services/taskService';

jest.mock('../services/taskService');

describe('TaskPanel Component', () => {
  beforeEach(() => {
    taskService.fetchTasks.mockReset();
  });

  test('should render three columns with correct headers', async () => {
    taskService.fetchTasks.mockResolvedValue([]);
    render(<TaskPanel />);
    expect(await screen.findByText('To Do')).toBeInTheDocument();
    expect(await screen.findByText('In Progress')).toBeInTheDocument();
    expect(await screen.findByText('Done')).toBeInTheDocument();
  });

  test('should display tasks in correct columns', async () => {
    const mockTasks = [
      { _id: '1', taskHeading: 'Task 1', taskStatus: 'To Do', taskPriority: 'Low', creationDate: '2025-05-22' },
      { _id: '2', taskHeading: 'Task 2', taskStatus: 'In Progress', taskPriority: 'Medium', creationDate: '2025-05-22' }
    ];
    taskService.fetchTasks.mockResolvedValue(mockTasks);
    render(<TaskPanel />);
    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Task 2')).toBeInTheDocument();
    // Check data-status attribute for correct column
    expect(screen.getByText('Task 1').closest('[data-status]')).toHaveAttribute('data-status', 'To Do');
    expect(screen.getByText('Task 2').closest('[data-status]')).toHaveAttribute('data-status', 'In Progress');
  });

  test('should render empty columns when no tasks', async () => {
    taskService.fetchTasks.mockResolvedValue([]);
    render(<TaskPanel />);
    const noTasksElements = await screen.findAllByText('No tasks');
    expect(noTasksElements).toHaveLength(3);
  });
}); 