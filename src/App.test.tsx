import React from 'react';
// Mock react-router-dom to avoid loading full router during this simple unit test
// place the mock before importing App so module resolution doesn't try to load
// the real package which can cause issues in the test runner environment.
// @ts-ignore
jest.mock('react-router-dom', () => ({
  Routes: ({ children }: any) => <>{children}</>,
  Route: ({ children, element }: any) => element ?? children ?? null,
}));

import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
