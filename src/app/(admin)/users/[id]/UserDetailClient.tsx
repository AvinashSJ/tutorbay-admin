"use client";

import React, { useState } from "react";
import { reviewTutorApplication } from "../actions";

interface UserInfo {
  id: string;
  email: string;
  phone: string | null;
  role: string;
  fullName: string | null;
  createdAt: string;
  lastSignIn: string;
  isBanned: boolean;
}

interface ApplicationHistoryEntry {
  action: string;
  timestamp: string;
  status: string;
  adminNotes?: string;
  additionalInfoRequired?: string;
}

interface WalletInfo {
  balance: number;
}

interface TransactionRow {
  id: string;
  type: string;
  source: string;
  amount: number;
  balanceAfter: number;
  description: string | null;
  createdAt: string;
}

interface TutorProfileData {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  nationality: string | null;
  highestQualification: string | null;
  modeOfTeaching: string | null;
  expectedFeePerHour: number | null;
  hasPrivateTutorLicense: boolean | null;
  emirateId: string | null;
  subjects: string[];
  areas: string[];
  bio: string | null;
  availability: unknown;
  location: unknown;
  licenseDocumentUrl: string | null;
  applicationStatus: string | null;
  applicationHistory: ApplicationHistoryEntry[];
  adminNotes: string | null;
  approvedNotified: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface Props {
  user: UserInfo;
  tutorProfile: TutorProfileData | null;
  wallet: WalletInfo | null;
  transactions: TransactionRow[];
}

function getInitials(str: string): string {
  return str.slice(0, 2).toUpperCase();
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 45%)`;
}

const STATUS_BADGE: Record<string, string> = {
  DRAFT: "bg-secondary-focus text-secondary border border-secondary-main",
  PENDING_REVIEW: "bg-warning-focus text-warning-600 border border-warning-main",
  APPROVED: "bg-success-focus text-success-600 border border-success-main",
  REJECTED: "bg-danger-focus text-danger-600 border border-danger-main",
  ADDITIONAL_INFO_REQUIRED: "bg-info-focus text-info-600 border border-info-main",
};

function StatusBadge({ status }: { status: string | null }) {
  const classes = STATUS_BADGE[status ?? ""] ?? "bg-dark-focus text-light border border-dark-main";
  return (
    <span className={`px-16 py-4 radius-4 fw-medium text-sm ${classes}`}>
      {(status ?? "UNKNOWN").replace(/_/g, " ")}
    </span>
  );
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stringify(val: unknown): string {
  if (val === null || val === undefined) return "\u2014";
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined | number | boolean }) {
  const display = value === null || value === undefined ? "\u2014" : String(value);
  return (
    <li className="d-flex align-items-center gap-1 mb-10">
      <span className="w-40 text-md fw-semibold text-primary-light">{label}</span>
      <span className="w-60 text-secondary-light fw-medium">: {display}</span>
    </li>
  );
}

export default function UserDetailClient({ user, tutorProfile, wallet, transactions }: Props) {
  const [activeTab, setActiveTab] = useState<string>("info");
  const [showNotes, setShowNotes] = useState(false);
  const [reviewAction, setReviewAction] = useState("PENDING_REVIEW");
  const isTutor = user.role.toUpperCase() === "TUTOR" && !!tutorProfile;

  const handleReviewActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setReviewAction(val);
    setShowNotes(val === "REJECTED" || val === "ADDITIONAL_INFO_REQUIRED");
  };

  return (
    <div className="row gy-4">
      {/* ── Left Column: Profile Card ── */}
      <div className="col-lg-4">
        <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
          <div
            className="w-100 d-flex align-items-center justify-content-center"
            style={{ height: 140, background: stringToColor(user.email) }}
          >
            <div
              className="w-80-px h-80-px rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
              style={{ fontSize: 28, background: "rgba(255,255,255,0.2)" }}
            >
              {getInitials(user.email)}
            </div>
          </div>
          <div className="p-24">
            <div className="text-center border-bottom pb-16 mb-16">
              {user.fullName && <h6 className="mb-4">{user.fullName}</h6>}
              <p className="text-secondary-light mb-8 text-sm">{user.email}</p>
              <span className={`badge bg-${user.role === "admin" ? "primary" : user.role === "tutor" ? "info" : "secondary"} text-white px-12 py-6 radius-4 text-sm fw-medium`}>
                {user.role.toUpperCase()}
              </span>
            </div>
            <ul>
              <InfoRow label="User ID" value={user.id.slice(0, 8) + "..."} />
              <InfoRow label="Phone" value={user.phone} />
              <InfoRow label="Created At" value={user.createdAt} />
              <InfoRow label="Last Sign In" value={user.lastSignIn} />
              <li className="d-flex align-items-center gap-1 mb-10">
                <span className="w-40 text-md fw-semibold text-primary-light">Status</span>
                <span className="w-60">
                  {user.isBanned ? (
                    <span className="badge bg-danger text-white px-12 py-6 radius-4 text-sm fw-medium">Banned</span>
                  ) : (
                    <span className="badge bg-success text-white px-12 py-6 radius-4 text-sm fw-medium">Active</span>
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Right Column: Tabs ── */}
      <div className="col-lg-8">
        <div className="card h-100">
          <div className="card-body p-24">
            {/* Tab Navigation */}
            <ul className="nav border-gradient-tab nav-pills mb-20 d-inline-flex" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link d-flex align-items-center px-24 ${activeTab === "info" ? "active" : ""}`}
                  onClick={() => setActiveTab("info")}
                  type="button"
                  role="tab"
                >
                  User Info
                </button>
              </li>
              {isTutor && (
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link d-flex align-items-center px-24 ${activeTab === "tutor" ? "active" : ""}`}
                    onClick={() => setActiveTab("tutor")}
                    type="button"
                    role="tab"
                  >
                    Tutor Profile
                  </button>
                </li>
              )}
              {isTutor && (
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link d-flex align-items-center px-24 ${activeTab === "review" ? "active" : ""}`}
                    onClick={() => setActiveTab("review")}
                    type="button"
                    role="tab"
                  >
                    Application Review
                  </button>
                </li>
              )}
              {wallet && (
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link d-flex align-items-center px-24 ${activeTab === "wallet" ? "active" : ""}`}
                    onClick={() => setActiveTab("wallet")}
                    type="button"
                    role="tab"
                  >
                    Wallet
                  </button>
                </li>
              )}
            </ul>

            {/* ── Tab: User Info ── */}
            {activeTab === "info" && (
              <div>
                <h6 className="text-md text-primary-light mb-16">Account Details</h6>
                <ul>
                  <InfoRow label="User ID" value={user.id} />
                  <InfoRow label="Full Name" value={user.fullName} />
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Phone" value={user.phone} />
                  <InfoRow label="Role" value={user.role.toUpperCase()} />
                  <InfoRow label="Created" value={user.createdAt} />
                  <InfoRow label="Last Sign In" value={user.lastSignIn} />
                </ul>
              </div>
            )}

            {/* ── Tab: Tutor Profile ── */}
            {activeTab === "tutor" && tutorProfile && (
              <div>
                <h6 className="text-md text-primary-light mb-16">Tutor Application Details</h6>
                <div className="row">
                  <div className="col-md-6">
                    <ul>
                      <InfoRow label="Full Name" value={user.fullName} />
                      <InfoRow label="First Name" value={tutorProfile.firstName} />
                      <InfoRow label="Last Name" value={tutorProfile.lastName} />
                      <InfoRow label="Phone" value={tutorProfile.phone} />
                      <InfoRow label="Nationality" value={tutorProfile.nationality} />
                      <InfoRow label="Emirates ID" value={tutorProfile.emirateId} />
                      <InfoRow label="Qualification" value={tutorProfile.highestQualification} />
                      <InfoRow label="Mode of Teaching" value={tutorProfile.modeOfTeaching} />
                      <InfoRow label="Expected Fee/Hour" value={tutorProfile.expectedFeePerHour ? `AED ${tutorProfile.expectedFeePerHour}` : null} />
                      <InfoRow label="Has License" value={tutorProfile.hasPrivateTutorLicense ? "Yes" : "No"} />
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul>
                      <InfoRow label="Subjects" value={tutorProfile.subjects?.length ? tutorProfile.subjects.join(", ") : null} />
                      <InfoRow label="Areas" value={tutorProfile.areas?.length ? tutorProfile.areas.join(", ") : null} />
                      {tutorProfile.licenseDocumentUrl && (
                        <li className="d-flex align-items-center gap-1 mb-10">
                          <span className="w-40 text-md fw-semibold text-primary-light">License Doc</span>
                          <span className="w-60">
                            <a href={tutorProfile.licenseDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
                              View Document
                            </a>
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                {tutorProfile.bio && (
                  <div className="mt-16">
                    <h6 className="text-sm fw-semibold text-primary-light mb-8">Bio</h6>
                    <p className="text-secondary-light">{tutorProfile.bio}</p>
                  </div>
                )}
                {(() => {
                  const slots = Array.isArray(tutorProfile.availability)
                    ? tutorProfile.availability.filter(
                        (s): s is { days: string; startTime: string; endTime: string } =>
                          typeof s === "object" && s !== null && "days" in s && "startTime" in s && "endTime" in s
                      )
                    : [];
                  if (slots.length === 0) return null;
                  return (
                    <div className="mt-16">
                      <h6 className="text-sm fw-semibold text-primary-light mb-8">Availability</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {slots.map((slot, idx) => (
                          <div
                            key={idx}
                            className="d-flex align-items-center gap-2 border rounded px-12 py-8 bg-base"
                          >
                            <span className="badge bg-primary text-white px-10 py-6 fw-medium text-sm">
                              {slot.days}
                            </span>
                            <span className="text-secondary-light fw-medium">
                              {slot.startTime} — {slot.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── Tab: Application Review ── */}
            {activeTab === "review" && tutorProfile && (
              <div>
                <div className="d-flex align-items-center gap-3 mb-20">
                  <h6 className="text-md text-primary-light mb-0">Application Status</h6>
                  <StatusBadge status={tutorProfile.applicationStatus} />
                </div>

                {/* Review Form */}
                <form action={reviewTutorApplication} className="border rounded p-16 mb-24">
                  <input type="hidden" name="userId" value={user.id} />
                  <input type="hidden" name="redirectTo" value={`/users/${user.id}`} />

                  <div className="mb-16">
                    <label className="form-label fw-medium">Change Status</label>
                    <select
                      name="action"
                      className="form-select"
                      defaultValue={tutorProfile.applicationStatus || "PENDING_REVIEW"}
                      onChange={handleReviewActionChange}
                    >
                      <option value="PENDING_REVIEW">Pending Review</option>
                      <option value="APPROVED">Approve</option>
                      <option value="ADDITIONAL_INFO_REQUIRED">Request Resubmission</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                  </div>

                  {showNotes && (
                    <div className="mb-16">
                      <label className="form-label fw-medium">
                        {reviewAction === "REJECTED" ? "Rejection Reason" : "Additional Information Required"}
                      </label>
                      <textarea
                        name="adminNotes"
                        className="form-control"
                        rows={3}
                        placeholder={reviewAction === "REJECTED" ? "Please provide reason for rejection..." : "Specify what additional information is needed..."}
                        required
                      />
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary">
                    <i className="ri-save-line me-2" />Update Status
                  </button>
                </form>

                {/* Application History Timeline */}
                {tutorProfile.applicationHistory && tutorProfile.applicationHistory.length > 0 ? (
                  <div>
                    <h6 className="text-md text-primary-light mb-16">Application History</h6>
                    <div className="timeline" style={{ position: "relative", paddingLeft: 24 }}>
                      {[...tutorProfile.applicationHistory].reverse().map((entry, idx) => (
                        <div key={idx} className="mb-16" style={{ position: "relative", borderLeft: "2px solid #dee2e6", paddingLeft: 20, marginLeft: 0 }}>
                          <div
                            className="position-absolute rounded-circle"
                            style={{
                              width: 12, height: 12,
                              left: -7, top: 4,
                              background: entry.status === "APPROVED" ? "#198754" : entry.status === "REJECTED" ? "#dc3545" : "#ffc107",
                              border: "2px solid #fff",
                            }}
                          />
                          <div className="d-flex align-items-center gap-2 mb-4">
                            <StatusBadge status={entry.status} />
                            <span className="text-xs text-secondary-light">{formatDateTime(entry.timestamp)}</span>
                          </div>
                          {entry.adminNotes && (
                            <p className="text-sm text-secondary-light mb-0 mt-4">
                              <span className="fw-medium">Notes:</span> {entry.adminNotes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-secondary-light text-sm">No application history yet.</p>
                )}
              </div>
            )}

            {/* ── Tab: Wallet ── */}
            {activeTab === "wallet" && wallet && (
              <div>
                {/* Balance Card */}
                <div className="bg-primary-focus border border-primary-main rounded p-24 mb-24 text-center">
                  <h6 className="text-sm text-primary-600 fw-medium mb-8">Current Balance</h6>
                  <div className="text-primary-600 fw-bold" style={{ fontSize: 36 }}>
                    {wallet.balance}
                    <span className="text-md fw-medium ms-2">credits</span>
                  </div>
                </div>

                {/* Transaction History */}
                <h6 className="text-md text-primary-light mb-16">Transaction History</h6>
                {transactions.length === 0 ? (
                  <p className="text-secondary-light text-sm">No transactions yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table bordered-table sm-table mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Date</th>
                          <th scope="col">Type</th>
                          <th scope="col">Source</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Balance After</th>
                          <th scope="col">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id}>
                            <td>
                              <span className="text-sm text-secondary-light">{formatDateTime(tx.createdAt)}</span>
                            </td>
                            <td>
                              <span className={`badge ${tx.type === "CREDIT" ? "bg-success" : "bg-danger"} text-white px-12 py-6 radius-4 text-sm fw-medium`}>
                                {tx.type}
                              </span>
                            </td>
                            <td>
                              <span className="text-sm text-secondary-light">{tx.source.replace(/_/g, " ")}</span>
                            </td>
                            <td>
                              <span className={`fw-semibold text-sm ${tx.type === "CREDIT" ? "text-success-600" : "text-danger-600"}`}>
                                {tx.type === "CREDIT" ? "+" : "-"}{tx.amount}
                              </span>
                            </td>
                            <td>
                              <span className="text-sm text-secondary-light">{tx.balanceAfter}</span>
                            </td>
                            <td>
                              <span className="text-sm text-secondary-light">{tx.description ?? "\u2014"}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {!isTutor && activeTab !== "info" && activeTab !== "wallet" && (
              <p className="text-secondary-light">This user is not a tutor.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
