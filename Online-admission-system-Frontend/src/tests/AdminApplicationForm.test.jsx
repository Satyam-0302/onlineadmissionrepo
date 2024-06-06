import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminApplicationForm from '../admincomponents/AdminApplicationForm';

// Mocking useNavigate
let mockNavigate = () => {};

// Mocking useNavigate and BrowserRouter
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    BrowserRouter: ({ children }) => <div>{children}</div>, // Mocking BrowserRouter
    useNavigate: () => mockNavigate, // Mocking useNavigate
  };
});

describe('AdminApplicationForm', () => {
  beforeEach(() => {
    // Resetting mocks before each test
    mockNavigate = () => {};
  });

  test('renders AdminApplicationForm component', () => {
    render(
      <Router>
        <AdminApplicationForm />
      </Router>
    );

    const headingElement = screen.getByText(/Applicant Details/i);
    expect(headingElement).toBeInTheDocument();
  });

});
