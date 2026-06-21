import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// A tiny consumer that exposes the auth value through the DOM so we can
// assert on state transitions driven by login()/logout().
const Consumer = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.name : 'none'}</span>
      <button onClick={() => login({ name: 'Alice', token: 'tkn' })}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

const renderConsumer = () =>
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

describe('AuthContext', () => {
  test('starts with no authenticated user', () => {
    renderConsumer();
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });

  test('login() stores the provided user', () => {
    renderConsumer();
    act(() => screen.getByText('login').click());
    expect(screen.getByTestId('user')).toHaveTextContent('Alice');
  });

  test('logout() clears the current user', () => {
    renderConsumer();
    act(() => screen.getByText('login').click());
    act(() => screen.getByText('logout').click());
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });
});
