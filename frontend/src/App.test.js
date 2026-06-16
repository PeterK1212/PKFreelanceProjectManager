import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Smoke test: the app should start (mount) without crashing. App brings its
// own Router; AuthProvider mirrors index.js so useAuth() has a value.
test('app starts without crashing', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  // The Navbar brand link always renders, confirming the app mounted.
  expect(screen.getByText(/Freelance Project Manager/i)).toBeInTheDocument();
});
