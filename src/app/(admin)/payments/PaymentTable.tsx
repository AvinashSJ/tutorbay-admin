"use client";

import React, { useState, useMemo } from "react";

export interface PaymentRow {
  id: string;
  tutorId: string;
  email: string | null;
  amount: number;
  currency: string;
  status: string;
  provider: string | null;
  providerPaymentId: string | null;
  stripePaymentIntentId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string | null;
  updatedAt: string | null;
  userEmail: string | null;
  userFullName: string | null;
}

interface PaymentTableProps {
  payments: PaymentRow[];
}

const STATUS_BADGE: Record<string, string> = {
  INITIATED: "secondary",
  PENDING: "warning",
  SUCCEEDED: "success",
  FAILED: "danger",
  CANCELLED: "dark",
};

function getBadgeColor(status: string | null): string {
  if (!status) return "secondary";
  return STATUS_BADGE[status.toUpperCase()] || "secondary";
}

function formatAmount(amount: number | null, currency: string | null): string {
  if (amount == null) return "—";
  const symbol = currency?.toLowerCase() === "aed" ? "AED " : "";
  return `${symbol}${(amount / 100).toFixed(2)}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PaymentTable({ payments }: PaymentTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const filtered = useMemo(
    () =>
      payments.filter((p) => {
        const q = search.toLowerCase();
        const matchesSearch =
          p.userFullName?.toLowerCase().includes(q) ||
          p.userEmail?.toLowerCase().includes(q) ||
          p.providerPaymentId?.toLowerCase().includes(q) ||
          p.stripePaymentIntentId?.toLowerCase().includes(q);
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [payments, search, statusFilter],
  );

  const statuses = useMemo(
    () => [...new Set(payments.map((p) => p.status))].sort(),
    [payments],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleStatusFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value);
    setPage(1);
  }

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="text-md fw-medium text-secondary-light mb-0">
            {filtered.length} payment{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="navbar-search position-relative">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              placeholder="Search by name, email, session…"
              value={search}
              onChange={handleSearch}
            />
            <i className="ri-search-line icon position-absolute top-50 translate-middle-y" style={{ right: 12 }} />
          </div>
          <select
            className="form-select form-select-sm bg-base"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={handleStatusFilter}
          >
            <option value="all">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Provider</th>
                <th scope="col">Stripe Session</th>
                <th scope="col">Payment Intent</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-40 text-secondary-light">
                    No payments found.
                  </td>
                </tr>
              ) : (
                paged.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="fw-medium text-secondary-light">
                        {p.userFullName || "—"}
                      </div>
                      <div className="text-sm text-secondary-light">
                        {p.userEmail || p.email || "—"}
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold">
                        {formatAmount(p.amount, p.currency)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`bg-${getBadgeColor(p.status)}-focus text-${getBadgeColor(p.status)}-600 border border-${getBadgeColor(p.status)}-main px-16 py-4 radius-4 fw-medium text-sm text-capitalize`}
                      >
                        {p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase() : "—"}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-secondary-light text-capitalize">
                        {p.provider || "—"}
                      </span>
                    </td>
                    <td>
                      {p.providerPaymentId ? (
                        <span className="text-sm text-secondary-light font-monospace" title={p.providerPaymentId}>
                          {p.providerPaymentId.slice(0, 18)}…
                        </span>
                      ) : (
                        <span className="text-secondary-light">—</span>
                      )}
                    </td>
                    <td>
                      {p.stripePaymentIntentId ? (
                        <span className="text-sm text-secondary-light font-monospace" title={p.stripePaymentIntentId}>
                          {p.stripePaymentIntentId.slice(0, 18)}…
                        </span>
                      ) : (
                        <span className="text-secondary-light">—</span>
                      )}
                    </td>
                    <td>
                      <span className="text-sm text-secondary-light">
                        {formatDate(p.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > PAGE_SIZE && (
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
            <span className="text-secondary-light text-sm">
              Page {page} of {totalPages}
            </span>
            <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center mb-0">
              <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                <button
                  className="page-link bg-base radius-8 border text-secondary-light fw-semibold px-14 py-10"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                  <button
                    className="page-link bg-base radius-8 border fw-semibold px-14 py-10"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link bg-base radius-8 border text-secondary-light fw-semibold px-14 py-10"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
