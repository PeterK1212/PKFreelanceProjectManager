import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectList from './ProjectList';
import axiosInstance from '../axiosConfig';

jest.mock('../axiosConfig', () => ({
  delete: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { token: 'tkn' } }),
}));

// A past deadline (relative to the 2026 test clock) on a non-completed
// project should be flagged Overdue by the decorator stack.
const projects = [
  {
    _id: 'p1',
    title: 'High Budget Project',
    clientName: 'Acme',
    description: 'desc',
    budget: 6000,
    status: 'Pending',
    deadline: '2020-01-01',
  },
  {
    _id: 'p2',
    title: 'Low Budget Project',
    clientName: 'Beta',
    description: 'desc',
    budget: 500,
    status: 'Completed',
    deadline: '2030-01-01',
  },
];

const setup = (overrides = {}) => {
  const props = {
    projects,
    setProjects: jest.fn(),
    setEditingProject: jest.fn(),
    ...overrides,
  };
  render(<ProjectList {...props} />);
  return props;
};

describe('ProjectList', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders a card per project', () => {
    setup();
    expect(screen.getByText('High Budget Project')).toBeInTheDocument();
    expect(screen.getByText('Low Budget Project')).toBeInTheDocument();
  });

  test('shows decorator-derived budget level and overdue badges', () => {
    setup();
    expect(screen.getByText('High budget')).toBeInTheDocument();
    expect(screen.getByText('Low budget')).toBeInTheDocument();
    // Only the past-deadline, non-completed project is overdue.
    expect(screen.getAllByText('Overdue')).toHaveLength(1);
  });

  test('Edit selects the project for editing', () => {
    const props = setup();
    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    expect(props.setEditingProject).toHaveBeenCalledWith(projects[0]);
  });

  test('Removes the project from the list', async () => {
    axiosInstance.delete.mockResolvedValue({});
    const props = setup();

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    await waitFor(() => expect(props.setProjects).toHaveBeenCalledWith([projects[1]]));
    expect(axiosInstance.delete).toHaveBeenCalledWith('/api/projects/p1', {
      headers: { Authorization: 'Bearer tkn' },
    });
  });
});
