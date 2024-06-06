import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { getApplicationByEmail } from '../Services/ApplicationService';
import { vi, describe, it, expect } from 'vitest';
import StudentAllApplication from '../components/StudentAllApplication';

// Mock the services
vi.mock('../Services/ApplicationService', () => ({
    getApplicationByEmail: vi.fn(),
}));

// Mock the navigation and parameters
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ emailId: 'test@example.com' }),
    };
});

describe('StudentAllApplication', () => {
    // Test for rendering a list of applications based on selected status
    it('renders list of applications based on selected status', async () => {
        // Mock the response from the service
        getApplicationByEmail.mockResolvedValueOnce({
            data: [
                { applicationId: '123', applicantFullName: 'John Doe', applicationStatus: 'Accepted' },
                { applicationId: '124', applicantFullName: 'Jane Doe', applicationStatus: 'Pending' },
            ],
        });

        // Render the component within BrowserRouter
        render(
            <BrowserRouter>
                <StudentAllApplication />
            </BrowserRouter>
        );

        // Wait for the List of Applications text to appear
        await waitFor(() => {
            expect(screen.getByText('List of Applications')).toBeInTheDocument();
        });

        // Check if the application details are rendered correctly
        expect(screen.getByText('123')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Accepted')).toBeInTheDocument();

        expect(screen.getByText('124')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    // Test for rendering a no application found message when no applications exist
    it('renders no application found message when no applications exist', async () => {
        // Mock the response to return an empty list
        getApplicationByEmail.mockResolvedValueOnce({ data: [] });

        // Render the component within BrowserRouter
        render(
            <BrowserRouter>
                <StudentAllApplication />
            </BrowserRouter>
        );

        // Wait for the No Application Found text to appear
        await waitFor(() => {
            expect(screen.getByText('No Application Found')).toBeInTheDocument();
        });

        // Check if the apply button and message are rendered correctly
        expect(screen.getByText('Apply here to start your journey! Admissions are now open.')).toBeInTheDocument();
        const applyButton = screen.getByRole('button', { name: /Apply here/i });
        expect(applyButton).toBeInTheDocument();

        // Simulate click on the apply button and check if the navigation is called
        fireEvent.click(applyButton);
        expect(mockNavigate).toHaveBeenCalledWith('/program-schedule-apply');
    });

    // Test for navigating to application details on view button click
    it('navigates to application details on view button click', async () => {
        // Mock the response to return a single application
        getApplicationByEmail.mockResolvedValueOnce({
            data: [{ applicationId: '123', applicantFullName: 'John Doe', applicationStatus: 'Accepted' }],
        });

        // Render the component within BrowserRouter
        render(
            <BrowserRouter>
                <StudentAllApplication />
            </BrowserRouter>
        );

        // Wait for the List of Applications text to appear
        await waitFor(() => {
            expect(screen.getByText('List of Applications')).toBeInTheDocument();
        });

        // Use a more specific selector for the View button
        const viewButton = screen.getByText('View', { selector: '.btn-info' });
        expect(viewButton).toBeInTheDocument();

        // Simulate click on the view button and check if the navigation is called with the correct application id
        fireEvent.click(viewButton);
        expect(mockNavigate).toHaveBeenCalledWith('/application/123');
    });
});
