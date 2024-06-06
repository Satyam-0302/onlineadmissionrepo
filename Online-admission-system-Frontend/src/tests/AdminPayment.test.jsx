import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { getAllPayment, deletePaymentById } from '../Services/PaymentService';
import { vi, describe, it, expect } from 'vitest';
import AdminPayment from '../admincomponents/AdminPayment';


// Mock the services
vi.mock('../Services/PaymentService', () => ({
  getAllPayment: vi.fn(),
  deletePaymentById: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
      ...actual,
      useNavigate: () => mockNavigate,
  };
});

describe('AdminPayment Component', () => {
  it('renders list of payments', async () => {
      getAllPayment.mockResolvedValueOnce({
          data: [
              {
                  paymentId: '1',
                  application: { applicantFullName: 'John Doe' },
                  paymentAmount: 100,
                  paymentStatus: 'Paid',
                  paymentDate: '2024-06-05',
                  emailId: 'john@example.com',
              },
              {
                  paymentId: '2',
                  application: { applicantFullName: 'Jane Doe' },
                  paymentAmount: 150,
                  paymentStatus: 'Pending',
                  paymentDate: '2024-06-06',
                  emailId: 'jane@example.com',
              },
          ],
      });

      render(
          <BrowserRouter>
              <AdminPayment />
          </BrowserRouter>
      );

      // Wait for the "List of payments" header to appear
      await waitFor(() => {
          expect(screen.getByText('List of payments')).toBeInTheDocument();
      });

      // Check that all data is rendered correctly
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Paid')).toBeInTheDocument();
      expect(screen.getByText('2024-06-05')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('2024-06-06')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('navigates to payment details on view button click', async () => {
      getAllPayment.mockResolvedValueOnce({
          data: [{ paymentId: '1', application: { applicantFullName: 'John Doe' } }],
      });

      render(
          <BrowserRouter>
              <AdminPayment />
          </BrowserRouter>
      );

      // Wait for the "List of payments" header to appear
      await waitFor(() => {
          expect(screen.getByText('List of payments')).toBeInTheDocument();
      });

      // Wait for the View button to appear
      const viewButton = await screen.findByText('View', { selector: 'button.btn-info' });
      expect(viewButton).toBeInTheDocument();

      fireEvent.click(viewButton);
      expect(mockNavigate).toHaveBeenCalledWith('/payment/applicationId/1');
  });

  it('deletes payment on delete button click', async () => {
      getAllPayment.mockResolvedValueOnce({
          data: [{ paymentId: '1', application: { applicantFullName: 'John Doe' } }],
      });

      render(
          <BrowserRouter>
              <AdminPayment />
          </BrowserRouter>
      );

      // Wait for the "List of payments" header to appear
      await waitFor(() => {
          expect(screen.getByText('List of payments')).toBeInTheDocument();
      });

      const deleteButton = await screen.findByText('Delete', { selector: 'button.btn-danger' });
      expect(deleteButton).toBeInTheDocument();

      fireEvent.click(deleteButton);

      await waitFor(() => {
          expect(deletePaymentById).toHaveBeenCalled();
      });

      // Check that getAllPayment was called again after delete
      await waitFor(() => {
          expect(getAllPayment).toHaveBeenCalledTimes(2); // One initial render and one after deletion
      });
  });

  it('renders no payment found message when no payments exist', async () => {
      getAllPayment.mockResolvedValueOnce({ data: [] });

      render(
          <BrowserRouter>
              <AdminPayment />
          </BrowserRouter>
      );

      // Wait for the "No Payment Found" message to appear
      await waitFor(() => {
          expect(screen.getByText('No Payment Found')).toBeInTheDocument();
      });
  });
});