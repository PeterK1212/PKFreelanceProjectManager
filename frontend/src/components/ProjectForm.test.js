import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectForm from './ProjectForm';
import axiosInstance from '../axiosConfig';

// Mock the network layer and auth so the form runs in isolation.
jest.mock('../axiosConfig', () => ({
  post: jest.fn(),
  put: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { token: 'tkn' } }),
}));

const setup = (overrides = {}) => {
  const props = {
    projects: [],
    setProjects: jest.fn(),
    editingProject: null,
    setEditingProject: jest.fn(),
    ...overrides,
  };
  render(<ProjectForm {...props} />);
  return props;
};

describe('ProjectForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  test('renders the Add Project heading when not editing', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Add Project' })).toBeInTheDocument();
  });

  test('pre-fills fields and shows Edit heading when editing', () => {
    setup({
      editingProject: {
        _id: 'p1',
        title: 'Website',
        clientName: 'Acme',
        description: 'Build site',
        budget: 2000,
        status: 'In Progress',
        deadline: '2026-09-01',
      },
    });
    expect(screen.getByRole('heading', { name: 'Edit Project' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Website')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Acme')).toBeInTheDocument();
  });

  test('creates a new project on submit and appends it to the list', async () => {
    const created = { _id: 'new', title: 'New Project' };
    axiosInstance.post.mockResolvedValue({ data: created });
    const props = setup();

    fireEvent.change(screen.getByPlaceholderText('Project Title'), {
      target: { value: 'New Project' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add Project' }));

    await waitFor(() => expect(props.setProjects).toHaveBeenCalledWith([created]));
    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/api/projects',
      expect.objectContaining({ title: 'New Project' }),
      { headers: { Authorization: 'Bearer tkn' } }
    );
    expect(props.setEditingProject).toHaveBeenCalledWith(null);
  });

  test('updates an existing project via PUT when editing', async () => {
    const editingProject = {
      _id: 'p1',
      title: 'Old',
      clientName: 'Acme',
      description: 'd',
      budget: 100,
      status: 'Pending',
      deadline: '2026-09-01',
    };
    const updated = { _id: 'p1', title: 'Updated' };
    axiosInstance.put.mockResolvedValue({ data: updated });
    const props = setup({ projects: [editingProject], editingProject });

    fireEvent.click(screen.getByRole('button', { name: 'Update Project' }));

    await waitFor(() => expect(props.setProjects).toHaveBeenCalledWith([updated]));
    expect(axiosInstance.put).toHaveBeenCalledWith(
      '/api/projects/p1',
      expect.any(Object),
      { headers: { Authorization: 'Bearer tkn' } }
    );
  });

  test('shows the backend validation message when the save fails', async () => {
    axiosInstance.post.mockRejectedValue({
      response: { data: { message: 'Title is required' } },
    });
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Add Project' }));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith('Title is required');
  });
});
