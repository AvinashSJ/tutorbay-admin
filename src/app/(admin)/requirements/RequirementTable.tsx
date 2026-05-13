"use client";

import React, { useState, useMemo } from "react";
import { changeRequirementStatus, deleteRequirement } from "./actions";

const PAGE_SIZE = 20;

interface RequirementRow {
  id: string;
  title: string;
  subject: string;
  area: string;
  status: string;
  tuitionType: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  curriculum: string | null;
  grade: string | null;
  locationUrl: string | null;
  modeOfTeaching: string | null;
  expectedFeePerHour: number | null;
  availability: unknown[] | null;
  notes: string | null;
  ownerId: string | null;
  ownerEmail: string | null;
  ownerName: string | null;
  matchCount?: number;
}

interface RequirementTableProps {
  requirements: RequirementRow[];
}

function formatAvailability(avail: unknown[] | null): string {
  if (!avail || !Array.isArray(avail) || avail.length === 0) return "—";
  return avail
    .slice(0, 2)
    .map((s: unknown) => {
      const slot = s as Record<string, string>;
      return `${slot.days} ${slot.startTime}–${slot.endTime}`;
    })
    .join(", ");
}

const STATUS_BADGE: Record<string, string> = {
  DRAFT: "secondary",
  PUBLISHED: "success",
  OPEN: "success",
  CLOSED: "danger",
  CANCELLED: "danger",
  IN_PROGRESS: "info",
};

function getStatusColor(status: string | null): string {
  if (!status) return "secondary";
  return STATUS_BADGE[status] || "secondary";
}

export default function RequirementTable({ requirements }: RequirementTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      requirements.filter((r) => {
        const q = search.toLowerCase();
        return (
          r.title?.toLowerCase().includes(q) ||
          r.subject?.toLowerCase().includes(q) ||
          r.ownerEmail?.toLowerCase().includes(q) ||
          r.area?.toLowerCase().includes(q)
        );
      }),
    [requirements, search],
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
            {filtered.length} requirement{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="navbar-search position-relative">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              placeholder="Search by title, subject, area…"
              value={search}
              onChange={handleSearch}
            />
            <i className="ri-search-line icon position-absolute top-50 translate-middle-y" style={{ right: 12 }} />
          </div>
        </div>
      </div>

      <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col">Subject</th>
                <th scope="col">Owner</th>
                <th scope="col">Curriculum / Grade</th>
                <th scope="col">Mode</th>
                <th scope="col">Fee / hr</th>
                <th scope="col">Status</th>
                <th scope="col">Pipeline</th>
                <th scope="col">Posted</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-40 text-secondary-light">
                    No requirements found.
                  </td>
                </tr>
              ) : (
                paged.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div>
                        <a href={`/requirements/${req.id}`} className="fw-medium text-secondary-light text-decoration-none hover-text-primary">
                          {req.title || req.subject}
                        </a>
                        <div className="text-sm text-secondary-light">{req.area || "—"}</div>
                      </div>
                    </td>
                    <td>
                      <span className="text-md text-secondary-light">
                        {req.ownerName || req.ownerEmail || "—"}
                      </span>
                    </td>
                    <td>
                      <span className="text-md text-secondary-light">
                        {req.curriculum || "—"}
                        {req.curriculum && req.grade ? ` / ` : ""}
                        {req.grade ? `Year ${req.grade}` : ""}
                      </span>
                    </td>
                    <td>
                      <span className="text-capitalize text-md text-secondary-light">
                        {req.modeOfTeaching || req.tuitionType?.toLowerCase() || "—"}
                      </span>
                    </td>
                    <td>
                      {req.expectedFeePerHour ? (
                        <span className="text-primary-600 fw-semibold">
                          AED {req.expectedFeePerHour}
                        </span>
                      ) : (
                        <span className="text-secondary-light">—</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`bg-${getStatusColor(req.status)}-focus text-${getStatusColor(req.status)}-600 border border-${getStatusColor(req.status)}-main px-16 py-4 radius-4 fw-medium text-sm`}
                      >
                        {req.status?.replace(/_/g, " ") || "—"}
                      </span>
                    </td>
                    <td>
                      <a href={`/requirements/${req.id}`} className="text-decoration-none">
                        <span className="text-md fw-medium text-primary-600">
                          {req.matchCount ?? 0} match{(req.matchCount ?? 0) !== 1 ? "es" : ""}
                        </span>
                      </a>
                    </td>
                    <td>
                      <span className="text-md text-secondary-light">{req.createdAt}</span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center gap-10 justify-content-center">
                        <form action={changeRequirementStatus}>
                          <input type="hidden" name="id" value={req.id} />
                          <select
                            name="status"
                            defaultValue={req.status || "DRAFT"}
                            className="form-select form-select-sm"
                            style={{ minWidth: "120px" }}
                            onChange={(e) => e.target.form?.requestSubmit()}
                          >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Publish</option>
                            <option value="OPEN">Open</option>
                            <option value="CLOSED">Close</option>
                            <option value="CANCELLED">Cancel</option>
                          </select>
                        </form>
                        <form action={deleteRequirement}>
                          <input type="hidden" name="id" value={req.id} />
                          <button
                            type="submit"
                            title="Delete requirement"
                            className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0"
                            onClick={(e) => {
                              if (!confirm("Delete this requirement?")) e.preventDefault();
                            }}
                          >
                            <i className="ri-delete-bin-line text-xl" />
                          </button>
                        </form>
                      </div>
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