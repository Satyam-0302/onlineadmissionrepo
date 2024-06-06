import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { admissionById } from '../Services/AdmissionService';
import { getApplicationId } from '../Services/ApplicationService';
import { vi, describe, it, expect } from 'vitest';
import StudentAdmissionComponent from '../components/StudentAdmissionComponent';

// Mock the services
vi.mock('../Services/AdmissionService', () => ({
    admissionById: vi.fn(),
}));

vi.mock('../Services/ApplicationService', () => ({
    getApplicationId: vi.fn(),
}));

// Mock the navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ appId: '123' }),
    };
});

describe('StudentAdmissionComponent', () => {
    // Test for rendering admission details when admission status is "Accepted"
    it('renders admission details when admission status is "Accepted"', async () => {
        // Mock the response from admissionById service
        admissionById.mockResolvedValueOnce({ data: {
            admissionStatus: 'Accepted',
            emailId: 'test@example.com',
            college: { collegeName: 'Test College' },
            program: { programName: 'Test Program' },
            course: { courseName: 'Test Course' },
            year: 2024
        }});
        // Mock the response from getApplicationId service
        getApplicationId.mockResolvedValueOnce({ data: { applicationId: '456' }});

        // Render the component within BrowserRouter
        render(
            <BrowserRouter>
                <StudentAdmissionComponent />
            </BrowserRouter>
        );

        // Wait for the admission confirmation message to appear
        await waitFor(() => {
            expect(screen.getByText('Admission confirmed successfully!')).toBeInTheDocument();
        });

        // Check if the admission details are rendered correctly
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Test College')).toBeInTheDocument();
        expect(screen.getByText('Test Program')).toBeInTheDocument();
        expect(screen.getByText('Test Course')).toBeInTheDocument();
        expect(screen.getByText('2024')).toBeInTheDocument();
    });

    // Test for rendering payment button when admission status is not "Accepted"
    it('renders payment button when admission status is not "Accepted"', async () => {
        // Mock the response from admissionById service
        admissionById.mockResolvedValueOnce({ data: { admissionStatus: 'Pending' } });
        // Mock the response from getApplicationId service
        getApplicationId.mockResolvedValueOnce({ data: { applicationId: '456' } });

        // Render the component within BrowserRouter
        render(
            <BrowserRouter>
                <StudentAdmissionComponent />
            </BrowserRouter>
        );

        // Wait for the No Payment Found message to appear
        await waitFor(() => {
            expect(screen.getByText(/No Payment Found/i)).toBeInTheDocument();
        });

        // Check if the payment button is rendered and clickable
        const paymentButton = screen.getByRole('button', { name: /Make Payment/i });
        expect(paymentButton).toBeInTheDocument();

        // Simulate click on the payment button and check if the navigation is called
        fireEvent.click(paymentButton);
        expect(mockNavigate).toHaveBeenCalledWith('/application/123/payment');
    });

    // Test for rendering application prompt when no application is found
    it('renders application prompt when no application is found', async () => {
        // Mock the response to return no data for admission
        admissionById.mockResolvedValueOnce({ data: {} });
        // Mock the response to return no data for application
        getApplicationId.mockResolvedValueOnce({ data: {} });

        // Render the component within BrowserRouter
        render(
            <BrowserRouter>
                <StudentAdmissionComponent />
            </BrowserRouter>
        );

        // Wait for the No Application Found message to appear
        await waitFor(() => {
            expect(screen.getByText((content, element) => {
                return element.tagName.toLowerCase() === 'h1' && content.includes('No Application Found');
            })).toBeInTheDocument();
        });
    });

    // Test for navigating back to dashboard on button click
    it('navigates back to dashboard on button click', async () => {
        // Mock the response to return admission status as Accepted
        admissionById.mockResolvedValueOnce({ data: { admissionStatus: 'Accepted' }});
        // Mock the response to return application id
        getApplicationId.mockResolvedValueOnce({ data: { applicationId: '456' }});

        // Render the component within BrowserRouter
        render(
            <BrowserRouter>
                <StudentAdmissionComponent />
            </BrowserRouter>
        );

        // Wait for the admission confirmation message to appear
        await waitFor(() => {
            expect(screen.getByText('Admission confirmed successfully!')).toBeInTheDocument();
        });

        // Simulate click on the go back button and check if the navigation is called
        const goBackButton = screen.getByText('DashBoard');
        fireEvent.click(goBackButton);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
});
