"use client";

import React, { useRef, useEffect } from "react";
import { inviteUser, updateUserRole, deleteUser, toggleBanUser } from "./actions";

// ---------------------------------------------------------------------------
// Invite User Modal
// ---------------------------------------------------------------------------
export function InviteUserModal() {
  return (
    <div
      className="modal fade"
      id="inviteUserModal"
      tabIndex={-1}
      aria-labelledby="inviteUserModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content radius-16 overflow-hidden">
          <div className="modal-header">
            <h5 className="modal-title" id="inviteUserModalLabel">
              Invite New User
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form action={inviteUser}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="inviteEmail" className="form-label fw-medium">
                  Email address
                </label>
                <input
                  id="inviteEmail"
                  name="email"
                  type="email"
                  required
                  className="form-control"
                  placeholder="user@example.com"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit Role Modal — receives current user data via data attributes on trigger
// ---------------------------------------------------------------------------
export function EditRoleModal() {
  const userIdRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);
  const emailRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const modal = (e as CustomEvent).target as HTMLElement;
      if (modal?.id !== "editRoleModal") return;
      const btn = (e as CustomEvent & { relatedTarget?: HTMLElement }).relatedTarget;
      if (!btn) return;
      if (userIdRef.current) userIdRef.current.value = btn.dataset.userId ?? "";
      if (roleRef.current) roleRef.current.value = btn.dataset.role ?? "student";
      if (emailRef.current) emailRef.current.textContent = btn.dataset.email ?? "";
    };
    document.addEventListener("show.bs.modal", handler);
    return () => document.removeEventListener("show.bs.modal", handler);
  }, []);

  return (
    <div
      className="modal fade"
      id="editRoleModal"
      tabIndex={-1}
      aria-labelledby="editRoleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content radius-16 overflow-hidden">
          <div className="modal-header">
            <h5 className="modal-title" id="editRoleModalLabel">
              Edit User Role
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form action={updateUserRole}>
            <div className="modal-body">
              <p className="text-secondary-light text-sm mb-3" ref={emailRef} />
              <input type="hidden" name="userId" ref={userIdRef} />
              <div className="mb-3">
                <label htmlFor="roleSelect" className="form-label fw-medium">
                  Role
                </label>
                <select
                  id="roleSelect"
                  name="role"
                  className="form-select"
                  ref={roleRef}
                  defaultValue="student"
                >
                  <option value="admin">Admin</option>
                  <option value="tutor">Tutor</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Delete Confirmation Modal
// ---------------------------------------------------------------------------
export function DeleteUserModal() {
  const userIdRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const modal = (e as CustomEvent).target as HTMLElement;
      if (modal?.id !== "deleteUserModal") return;
      const btn = (e as CustomEvent & { relatedTarget?: HTMLElement }).relatedTarget;
      if (!btn) return;
      if (userIdRef.current) userIdRef.current.value = btn.dataset.userId ?? "";
      if (emailRef.current) emailRef.current.textContent = btn.dataset.email ?? "";
    };
    document.addEventListener("show.bs.modal", handler);
    return () => document.removeEventListener("show.bs.modal", handler);
  }, []);

  return (
    <div
      className="modal fade"
      id="deleteUserModal"
      tabIndex={-1}
      aria-labelledby="deleteUserModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content radius-16 overflow-hidden">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title text-danger" id="deleteUserModalLabel">
              Delete User
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form action={deleteUser}>
            <div className="modal-body">
              <p className="text-secondary-light text-sm">
                Are you sure you want to permanently delete{" "}
                <span className="fw-semibold text-primary-light" ref={emailRef} />?
                This action cannot be undone.
              </p>
              <input type="hidden" name="userId" ref={userIdRef} />
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-danger btn-sm">
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline Ban/Unban form button — used directly in the table row
// ---------------------------------------------------------------------------
interface BanButtonProps {
  userId: string;
  isBanned: boolean;
}

export function BanButton({ userId, isBanned }: BanButtonProps) {
  return (
    <form action={toggleBanUser} style={{ display: "inline" }}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="isBanned" value={String(isBanned)} />
      <button
        type="submit"
        title={isBanned ? "Unban user" : "Ban user"}
        className={`fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0 ${
          isBanned
            ? "bg-success-focus bg-hover-success-200 text-success-600"
            : "bg-warning-focus bg-hover-warning-200 text-warning-600"
        }`}
      >
        <i className={`ri-${isBanned ? "user-follow" : "user-forbid"}-line text-xl`} />
      </button>
    </form>
  );
}
