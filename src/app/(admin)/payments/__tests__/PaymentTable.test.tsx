import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import PaymentTable from "../PaymentTable";

const mockPayments = [
  {
    id: "pay-1",
    tutorId: "tutor-1",
    email: "tutor1@test.com",
    amount: 50000,
    currency: "AED",
    status: "SUCCEEDED",
    provider: "stripe",
    providerPaymentId: "pi_123",
    stripePaymentIntentId: "pi_123",
    metadata: null,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    userEmail: "parent@test.com",
    userFullName: "Parent One",
  },
  {
    id: "pay-2",
    tutorId: "tutor-2",
    email: "tutor2@test.com",
    amount: 75000,
    currency: "AED",
    status: "PENDING",
    provider: "stripe",
    providerPaymentId: "pi_456",
    stripePaymentIntentId: "pi_456",
    metadata: null,
    createdAt: "2025-02-20T14:30:00Z",
    updatedAt: "2025-02-20T14:30:00Z",
    userEmail: "parent2@test.com",
    userFullName: "Parent Two",
  },
  {
    id: "pay-3",
    tutorId: "tutor-3",
    email: "tutor3@test.com",
    amount: 30000,
    currency: "AED",
    status: "FAILED",
    provider: "stripe",
    providerPaymentId: "pi_789",
    stripePaymentIntentId: "pi_789",
    metadata: null,
    createdAt: "2025-03-10T09:00:00Z",
    updatedAt: "2025-03-10T09:00:00Z",
    userEmail: "parent3@test.com",
    userFullName: "Parent Three",
  },
];

describe("PaymentTable", () => {
  it("renders all payments", () => {
    render(<PaymentTable payments={mockPayments} />);
    expect(screen.getByText("Parent One")).toBeInTheDocument();
    expect(screen.getByText("Parent Two")).toBeInTheDocument();
    expect(screen.getByText("Parent Three")).toBeInTheDocument();
  });

  it("displays formatted amounts", () => {
    render(<PaymentTable payments={mockPayments} />);
    expect(screen.getByText("AED 500.00")).toBeInTheDocument();
    expect(screen.getByText("AED 750.00")).toBeInTheDocument();
    expect(screen.getByText("AED 300.00")).toBeInTheDocument();
  });

  it("shows correct status badges (title case)", () => {
    render(<PaymentTable payments={mockPayments} />);
    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Succeeded");
    expect(rows[2]).toHaveTextContent("Pending");
    expect(rows[3]).toHaveTextContent("Failed");
  });

  it("filters payments by search query", () => {
    render(<PaymentTable payments={mockPayments} />);
    const searchInput = screen.getByPlaceholderText(/Search by name/);
    fireEvent.change(searchInput, { target: { value: "Parent One" } });
    expect(screen.getByText("Parent One")).toBeInTheDocument();
    expect(screen.queryByText("Parent Two")).not.toBeInTheDocument();
  });

  it("filters payments by status", () => {
    render(<PaymentTable payments={mockPayments} />);
    const statusFilter = screen.getByRole("combobox");
    fireEvent.change(statusFilter, { target: { value: "SUCCEEDED" } });
    expect(screen.getByText("Parent One")).toBeInTheDocument();
    expect(screen.queryByText("Parent Two")).not.toBeInTheDocument();
    expect(screen.queryByText("Parent Three")).not.toBeInTheDocument();
  });

  it("shows empty state when no matches", () => {
    render(<PaymentTable payments={mockPayments} />);
    const searchInput = screen.getByPlaceholderText(/Search by name/);
    fireEvent.change(searchInput, { target: { value: "zzz_no_match_zzz" } });
    expect(screen.getByText("No payments found.")).toBeInTheDocument();
  });

  it("paginates when there are many payments", () => {
    const manyPayments = Array.from({ length: 25 }, (_, i) => ({
      ...mockPayments[0],
      id: `pay-${i}`,
      userFullName: `User ${i}`,
    }));
    render(<PaymentTable payments={manyPayments} />);
    expect(screen.getByText("User 0")).toBeInTheDocument();
    expect(screen.queryByText("User 22")).not.toBeInTheDocument();

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(screen.getByText("User 22")).toBeInTheDocument();
  });
});
