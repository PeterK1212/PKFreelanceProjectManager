import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock the auth hook so each test controls the logged-in user, and the
// router navigate hook so we can assert on post-logout redirection.
const mockLogout = jest.fn();
const mockNavigate = jest.fn();
let mockUser = null;

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, logout: mockLogout }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar', () => {
  beforeEach(() => {
    mockUser = null;
    mockLogout.mockClear();
    mockNavigate.mockClear();
  });

  test('shows Login and Register when no user is logged in', () => {
    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('shows the Projects link for a standard user', () => {
    mockUser = { role: 'user', token: 'tkn' };
    renderNavbar();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('shows the Admin Dashboard link for an admin user', () => {
    mockUser = { role: 'admin', token: 'tkn' };
    renderNavbar();
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Projects')).not.toBeInTheDocument();
  });

  test('logging out clears the session and redirects to /login', () => {
    mockUser = { role: 'user', token: 'tkn' };
    renderNavbar();
    screen.getByText('Logout').click();
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
