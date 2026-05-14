import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SubscriberTable from "../SubscriberTable";

const mockSubscribers = [
  { id: "s1", email: "alice@test.com", createdAt: "2025-01-10T08:00:00Z" },
  { id: "s2", email: "bob@test.com", createdAt: "2025-02-15T12:00:00Z" },
  { id: "s3", email: "charlie@test.com", createdAt: "2025-03-20T16:00:00Z" },
];

describe("SubscriberTable", () => {
  it("renders all subscribers", () => {
    render(<SubscriberTable subscribers={mockSubscribers} />);
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    expect(screen.getByText("bob@test.com")).toBeInTheDocument();
    expect(screen.getByText("charlie@test.com")).toBeInTheDocument();
  });

  it("filters by email search", () => {
    render(<SubscriberTable subscribers={mockSubscribers} />);
    const searchInput = screen.getByPlaceholderText(/Search by email/);
    fireEvent.change(searchInput, { target: { value: "bob" } });
    expect(screen.getByText("bob@test.com")).toBeInTheDocument();
    expect(screen.queryByText("alice@test.com")).not.toBeInTheDocument();
  });

  it("shows empty state when no matches", () => {
    render(<SubscriberTable subscribers={mockSubscribers} />);
    const searchInput = screen.getByPlaceholderText(/Search by email/);
    fireEvent.change(searchInput, { target: { value: "no_match_xyz" } });
    expect(screen.getByText("No subscribers found.")).toBeInTheDocument();
  });

  it("paginates subscribers", () => {
    const many = Array.from({ length: 25 }, (_, i) => ({
      id: `s${i}`,
      email: `user${i}@test.com`,
      createdAt: "2025-01-01T00:00:00Z",
    }));
    render(<SubscriberTable subscribers={many} />);
    expect(screen.getByText("user0@test.com")).toBeInTheDocument();
    expect(screen.queryByText("user22@test.com")).not.toBeInTheDocument();

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(screen.getByText("user22@test.com")).toBeInTheDocument();
  });

  it("has a download CSV button", () => {
    render(<SubscriberTable subscribers={mockSubscribers} />);
    expect(screen.getByText("Download CSV")).toBeInTheDocument();
  });
});
