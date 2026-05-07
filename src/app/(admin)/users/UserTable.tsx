"use client";

import React, { useState, useMemo } from "react";
import { BanButton } from "./modals";
import { reviewTutorApplication } from "./actions";

const PAGE_SIZE = 20;

interface UserRow {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  lastSignIn: string;
  isBanned: boolean;
  tutorApplicationStatus: string | null;
  tutorAdminNotes: string | null;
}

interface UserTableProps {
  users: UserRow[];
}

function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

const STATUS_BADGE_COLORS = {
  DRAFT: 'secondary',
  PENDING_REVIEW: 'warning',
  ADDITIONAL_INFO_REQUIRED: 'info',
  APPROVED: 'success',
  REJECTED: 'danger',
} as const;

function getStatusBadgeColor(status: string | null): string {
  if (!status) return 'secondary';
  return STATUS_BADGE_COLORS[status as keyof typeof STATUS_BADGE_COLORS] || 'secondary';
}

function formatStatus(status: string | null): string {
  if (!status) return '—';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

/** Deterministic pastel-ish colour from an email string */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 45%)`;
}

export default function UserTable({ users }: UserTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      users.filter((u) =>
        u.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <div className="card h-100 p-0 radius-12">
      {/* ── Header ── */}
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="text-md fw-medium text-secondary-light mb-0">
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="navbar-search position-relative">
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              placeholder="Search by email…"
              value={search}
              onChange={handleSearch}
            />
            <i className="ri-search-line icon position-absolute top-50 translate-middle-y" style={{ right: 12 }} />
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#inviteUserModal"
        >
          <i className="ri-add-line icon text-xl line-height-1" />
          Invite User
        </button>
      </div>

      {/* ── Table ── */}
      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Role</th>
                <th scope="col">Created At</th>
                <th scope="col">Last Sign In</th>
                <th scope="col" className="text-center">Status</th>
                <th scope="col" className="text-center">Actions</th>
                <th scope="col">Tutor Application</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-40 text-secondary-light">
                    No users found.
                  </td>
                </tr>
              ) : (
                paged.map((user) => (
                  <tr key={user.id}>
                    {/* User */}
                    <td>
                      <div className="d-flex align-items-center gap-10">
                        <div
                          className="w-40-px h-40-px rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center fw-semibold text-white"
                          style={{ background: stringToColor(user.email), fontSize: 14 }}
                        >
                          {getInitials(user.email)}
                        </div>
                        <span className="text-md text-secondary-light">{user.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <span className="text-md text-secondary-light capitalize">{user.role}</span>
                    </td>

                    {/* Created At */}
                    <td>
                      <span className="text-md text-secondary-light">{user.createdAt}</span>
                    </td>

                    {/* Last Sign In */}
                    <td>
                      <span className="text-md text-secondary-light">{user.lastSignIn}</span>
                    </td>

                    {/* Status (Active/Banned) */}
                    <td className="text-center">
                      {user.isBanned ? (
                        <span className="bg-danger-focus text-danger-600 border border-danger-main px-16 py-4 radius-4 fw-medium text-sm">
                          Banned
                        </span>
                      ) : (
                        <span className="bg-success-focus text-success-600 border border-success-main px-16 py-4 radius-4 fw-medium text-sm">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="d-flex align-items-center gap-10 justify-content-center">
                        {/* Edit role */}
                        <button
                          type="button"
                          title="Edit role"
                          className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0"
                          data-bs-toggle="modal"
                          data-bs-target="#editRoleModal"
                          data-user-id={user.id}
                          data-email={user.email}
                          data-role={user.role}
                        >
                          <i className="ri-edit-line text-xl" />
                        </button>

                        {/* Ban / Unban */}
                        <BanButton userId={user.id} isBanned={user.isBanned} />

                        {/* Delete */}
                        <button
                          type="button"
                          title="Delete user"
                          className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteUserModal"
                          data-user-id={user.id}
                          data-email={user.email}
                        >
                          <i className="ri-delete-bin-line text-xl" />
                        </button>
                      </div>
                    </td>

                    {/* Tutor Application */}
                    <td>
                      {user.role.toUpperCase() === 'TUTOR' ? (
                        <div style={{ minWidth: '200px' }} className="p-1 border rounded">
                          <form action={reviewTutorApplication} className="d-flex flex-column gap-2">
                            <input type="hidden" name="userId" value={user.id} />
                            <div className="d-flex gap-2 align-items-center mb-1">
                              <select
                                name="action"
                                defaultValue={user.tutorApplicationStatus || "PENDING_REVIEW"}
                                className="form-select form-select-sm flex-grow-1"
                                style={{ minWidth: '120px' }}
                              >
                                <option value="PENDING_REVIEW">Pending Review</option>
                                <option value="APPROVED">Approve</option>
                                <option value="ADDITIONAL_INFO_REQUIRED">Resubmit</option>
                                <option value="REJECTED">Reject</option>
                              </select>
                              <button
                                type="submit"
                                className="btn btn-sm btn-primary px-2"
                                title="Save"
                              >
                                Save
                              </button>
                            </div>
                            {user.tutorApplicationStatus && (
                              <small className={`text-${getStatusBadgeColor(user.tutorApplicationStatus)}`}>
                                Current: {formatStatus(user.tutorApplicationStatus)}
                              </small>
                            )}
                            {!user.tutorApplicationStatus && (
                              <small className="text-warning">No application yet</small>
                            )}
                          </form>
                        </div>
                      ) : (
                        <span className="text-secondary-light text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
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
