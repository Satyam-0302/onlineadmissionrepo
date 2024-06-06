import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudentApplication from '../components/StudentApplication';
import { getApplicationId } from '../Services/ApplicationService';
import { admissionById } from '../Services/AdmissionService';
import { vi, describe, it, expect } from 'vitest';

// Mock the services
vi.mock('../Services/ApplicationService', () => ({
  getApplicationId: vi.fn(),
}));

vi.mock('../Services/AdmissionService', () => ({
  admissionById: vi.fn(),
}));

// Mock the navigation and useParams hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ appId: '123' }),
  };
});

describe('StudentApplication', () => {
 
  // Test for rendering message when application status is "Pending"
  it('renders message when application is pending', async () => {
    // Mock the response from getApplicationId service
    getApplicationId.mockResolvedValueOnce({
      data: {
        applicationId: '456',
        applicantFullName: 'John Doe',
        dateOfBirth: '2000-01-01',
        highestQualification: 'Bachelor\'s Degree',
        finalYearPercentage: '85%',
        goals: 'Become a software engineer',
        emailId: 'johndoe@example.com',
        applicationStatus: 'Pending',
        dateOfInterview: '2024-06-10',
        schedule: {
          startDate: '2024-09-01',
          endDate: '2025-06-30',
          programScheduledResponseDto: {
            name: 'Test University',
            collegeName: 'Test College',
            programName: 'Software Engineering',
            courseName: 'Introduction to Programming',
            branchName: 'Computer Science',
            eligibility: 'Passed 12th grade',
          },
        },
      },
    });

    // Mock the response from admissionById service
    admissionById.mockResolvedValueOnce({
      data: {
        admissionStatus: 'Pending',
      },
    });

    // Render the component within BrowserRouter
    render(
      <BrowserRouter>
        <StudentApplication />
      </BrowserRouter>
    );

    // Wait for the Applicant Details section to appear
    await waitFor(() => {
      expect(screen.getByText('Applicant Details')).toBeInTheDocument();
    });

    // Check if applicant details are rendered correctly
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Check if the pending message is displayed
    const note = screen.getByText(/Please wait until your application gets accepted/i);
    expect(note).toBeInTheDocument();
  });

  // Test for rendering message when application status is not "Accepted"
  it('renders message when application is not accepted', async () => {
    // Mock the response from getApplicationId service
    getApplicationId.mockResolvedValueOnce({
      data: {
        applicationId: '456',
        applicantFullName: 'John Doe',
        dateOfBirth: '2000-01-01',
        highestQualification: 'Bachelor\'s Degree',
        finalYearPercentage: '85%',
        emailId: 'johndoe@example.com',
        applicationStatus: 'Rejected',
        dateOfInterview: '2024-06-10',
        schedule: {
          startDate: '2024-09-01',
          endDate: '2025-06-30',
          programScheduledResponseDto: {
            name: 'Test University',
            collegeName: 'Test College',
            programName: 'Software Engineering',
            courseName: 'Introduction to Programming',
            branchName: 'Computer Science',
            eligibility: 'Passed 12th grade',
          },
        },
      },
    });

    // Mock the response from admissionById service
    admissionById.mockResolvedValueOnce({
      data: {
        admissionStatus: 'Rejected',
      },
    });

    // Render the component within BrowserRouter
    render(
      <BrowserRouter>
        <StudentApplication />
      </BrowserRouter>
    );

    // Wait for the Applicant Details section to appear
    await waitFor(() => {
      expect(screen.getByText('Applicant Details')).toBeInTheDocument();
    });

    // Check if applicant details are rendered correctly
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Check if the rejection message is displayed
    const note = screen.getByText(/Unfortunately, your application has not been accepted/i);
    expect(note).toBeInTheDocument();
  });

  // Test for rendering no applications found message when no applicant data is available
  it('renders no applications found when no applicant data is available', async () => {
    // Mock the response to return no data for application
    getApplicationId.mockResolvedValueOnce({ data: {} });
    // Mock the response to return no data for admission
    admissionById.mockResolvedValueOnce({ data: {} });

    // Render the component within BrowserRouter
    render(
      <BrowserRouter>
        <StudentApplication />
      </BrowserRouter>
    );

    // Wait for the "No Applications Found" message to appear
    await waitFor(() => {
      expect(screen.getByText('"No Applications Found"')).toBeInTheDocument();
    });

    // Check if the prompt to apply is displayed
    expect(screen.getByText('Please Apply To Program')).toBeInTheDocument();
  });
});
