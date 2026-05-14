"use client";

import React, { useState, useRef, useEffect } from "react";
import { inviteUser, updateUserRole, deleteUser, toggleBanUser, reviewTutorApplication } from "./actions";

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
// Tutor Action Buttons — Approve/Reject for pending tutor applications
// ---------------------------------------------------------------------------
interface TutorActionButtonsProps {
  userId: string;
  email: string;
  status: string;
}

export function TutorActionButtons({ userId, email, status }: TutorActionButtonsProps) {
  return (
    <>
      <button
        type="button"
        title="Approve application"
        className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0"
        data-bs-toggle="modal"
        data-bs-target="#tutorReviewModal"
        data-user-id={userId}
        data-email={email}
        data-action="APPROVE"
      >
        <i className="ri-check-line text-xl" />
      </button>

      <button
        type="button"
        title="Request additional info"
        className="bg-info-focus text-info-600 bg-hover-info-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0"
        data-bs-toggle="modal"
        data-bs-target="#tutorReviewModal"
        data-user-id={userId}
        data-email={email}
        data-action="REQUEST_INFO"
      >
        <i className="ri-information-line text-xl" />
      </button>

      <button
        type="button"
        title="Reject application"
        className="bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle border-0"
        data-bs-toggle="modal"
        data-bs-target="#tutorReviewModal"
        data-user-id={userId}
        data-email={email}
        data-action="REJECT"
      >
        <i className="ri-close-line text-xl" />
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Tutor Review Modal — Approve/Reject/Request Info
// ---------------------------------------------------------------------------
export function TutorReviewModal() {
  const [action, setAction] = useState("");
  const [email, setEmail] = useState("");
  const userIdRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const additionalInfoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const modal = (e as CustomEvent).target as HTMLElement;
      if (modal?.id !== "tutorReviewModal") return;
      const btn = (e as CustomEvent & { relatedTarget?: HTMLElement }).relatedTarget;
      if (!btn) return;
      if (userIdRef.current) userIdRef.current.value = btn.dataset.userId ?? "";
      setAction(btn.dataset.action ?? "");
      setEmail(btn.dataset.email ?? "");
      if (notesRef.current) notesRef.current.value = "";
      if (additionalInfoRef.current) additionalInfoRef.current.value = "";
    };
    document.addEventListener("show.bs.modal", handler);
    return () => document.removeEventListener("show.bs.modal", handler);
  }, []);

  const getActionLabel = () => {
    if (action === "APPROVE") return "Approve";
    if (action === "REJECT") return "Reject";
    if (action === "REQUEST_INFO") return "Request Additional Information";
    return "Review";
  };

  const getActionColor = () => {
    if (action === "APPROVE") return "success";
    if (action === "REJECT") return "danger";
    if (action === "REQUEST_INFO") return "info";
    return "primary";
  };

  const getServerAction = () => {
    if (action === "APPROVE") return "APPROVED";
    if (action === "REJECT") return "REJECTED";
    if (action === "REQUEST_INFO") return "ADDITIONAL_INFO_REQUIRED";
    return action;
  };

  return (
    <div
      className="modal fade"
      id="tutorReviewModal"
      tabIndex={-1}
      aria-labelledby="tutorReviewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content radius-16 overflow-hidden">
          <div className="modal-header">
            <h5 className="modal-title" id="tutorReviewModalLabel">
              {getActionLabel()} Application
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <form action={reviewTutorApplication}>
            <div className="modal-body">
              <p className="text-secondary-light text-sm mb-3">{email}</p>
              <input type="hidden" name="userId" ref={userIdRef} />
              <input type="hidden" name="action" value={getServerAction()} />

              {action !== "APPROVE" && (
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    {action === "REJECT" ? "Rejection Reason" : "Additional Information Required"}
                  </label>
                  <textarea
                    name="adminNotes"
                    className="form-control"
                    rows={3}
                    placeholder={
                      action === "REJECT"
                        ? "Please provide reason for rejection..."
                        : "Specify what additional information is needed..."
                    }
                    ref={notesRef}
                  />
                </div>
              )}

              {action === "REQUEST_INFO" && (
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Information Required
                  </label>
                  <textarea
                    name="additionalInfo"
                    className="form-control"
                    rows={3}
                    placeholder="Specify what additional information is needed..."
                    ref={additionalInfoRef}
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-${getActionColor()}`}
              >
                Confirm {getActionLabel()}
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
