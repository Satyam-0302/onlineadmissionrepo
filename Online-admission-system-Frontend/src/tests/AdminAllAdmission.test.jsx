import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';

import { getAllAdmission, getAllColleges, deleteAdmission } from '../Services/AdmissionService';
import AdminAllAdmission from '../admincomponents/AdminAllAdmission';

// Mock the services
vi.mock('../Services/AdmissionService', () => ({
    getAllAdmission: vi.fn(),
    getAllColleges: vi.fn(),
    deleteAdmission: vi.fn(),
}));

// Mock the navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('AdminAllAdmission', () => {
    // Test for rendering the component and displaying admissions
    it('renders the component and displays admissions', async () => {
        // Mock the response from getAllAdmission service
        getAllAdmission.mockResolvedValueOnce({
            data: [
                { emailId: 'john@example.com', application: { applicationId: '123', applicantFullName: 'John Doe' }, admissionStatus: 'Accepted', college: { collegeName: 'Test College' }, program: { programName: 'Test Program' }, year: 2024 },
                { emailId: 'jane@example.com', application: { applicationId: '124', applicantFullName: 'Jane Doe' }, admissionStatus: 'Pending', college: { collegeName: 'Another College' }, program: { programName: 'Another Program' }, year: 2023 },
            ],
        });

        // Mock the response from getAllColleges service
        getAllColleges.mockResolvedValueOnce({
            data: [
                { collegeName: 'Test College' },
                { collegeName: 'Another College' },
            ],
        });

        // Render the component within BrowserRouter
        render(
            <BrowserRouter>
                <AdminAllAdmission />
            </BrowserRouter>
        );

        // Wait for the ADMISSION PANEL text and email ids to appear
        await waitFor(() => {
            expect(screen.getByText('ADMISSION PANEL')).toBeInTheDocument();
            expect(screen.getByText('john@example.com')).toBeInTheDocument();
            expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        });
    });

});
