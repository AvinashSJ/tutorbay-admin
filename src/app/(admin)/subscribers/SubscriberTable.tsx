"use client";

import React, { useState, useMemo } from "react";

interface SubscriberRow {
  id: string;
  email: string;
  createdAt: string | null;
}

interface SubscriberTableProps {
  subscribers: SubscriberRow[];
}

function formatDate(iso: string | null): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function downloadCSV(rows: SubscriberRow[]) {
  const headers = ["Email", "Subscribed At"];
  const csvRows = rows.map((s) => [
    s.email,
    s.createdAt
      ? new Date(s.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
  ]);

  let csv = headers.join(",") + "\n";
  csvRows.forEach((row) => {
    csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `subscribers_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SubscriberTable({ subscribers }: SubscriberTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const filtered = useMemo(
    () =>
      subscribers.filter((s) => {
        const q = search.toLowerCase();
        return s.email?.toLowerCase().includes(q);
      }),
    [subscribers, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="text-md fw-medium text-secondary-light mb-0">
            {filtered.length} subscriber{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="navbar-search position-relative">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              placeholder="Search by email\u2026"
              value={search}
              onChange={handleSearch}
            />
            <i className="ri-search-line icon position-absolute top-50 translate-middle-y" style={{ right: 12 }} />
          </div>
          {filtered.length > 0 && (
            <button
              onClick={() => downloadCSV(filtered)}
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
            >
              <i className="ri-download-line" />
              Download CSV
            </button>
          )}
        </div>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" style={{ width: 60 }}>#</th>
                <th scope="col">Email</th>
                <th scope="col">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-40 text-secondary-light">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                paged.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="text-secondary-light">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <span className="fw-medium text-secondary-light">{s.email}</span>
                    </td>
                    <td>
                      <span className="text-sm text-secondary-light">
                        {formatDate(s.createdAt)}
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
