"use client";

import React from "react";
import MatchList from "./MatchList";

interface RequirementInfo {
  id: string;
  title: string;
  subject: string;
  area: string;
  status: string;
  tuitionType: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  curriculum: string | null;
  grade: string | null;
  locationUrl: string | null;
  modeOfTeaching: string | null;
  expectedFeePerHour: number | null;
  notes: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
}

interface MatchRow {
  matchId: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  tutorPhone: string;
  subjects: string[];
  areas: string[];
  matchScore: number | null;
  status: string;
  tutorNotes: string | null;
  parentNotes: string | null;
  sessionCount: number;
  lastSessionDate: string | null;
  createdAt: string;
}

interface Props {
  requirement: RequirementInfo;
  matches: MatchRow[];
}

const STATUS_BADGE: Record<string, string> = {
  DRAFT: "secondary",
  PUBLISHED: "success",
  OPEN: "success",
  CLOSED: "danger",
  CANCELLED: "danger",
};

export default function RequirementDetailClient({ requirement, matches }: Props) {
  const badgeColor = STATUS_BADGE[requirement.status] || "secondary";

  return (
    <div className="row gy-4">
      {/* Info Panel */}
      <div className="col-12 col-lg-4">
        <div className="card h-100 p-0 radius-12">
          <div className="card-header border-bottom bg-base py-16 px-24">
            <h5 className="mb-0">Requirement Details</h5>
          </div>
          <div className="card-body p-24">
            <dl className="mb-0">
              <div className="mb-3">
                <dt className="text-secondary-light fw-medium text-sm mb-1">Subject</dt>
                <dd className="mb-0">{requirement.subject}</dd>
              </div>
              <div className="mb-3">
                <dt className="text-secondary-light fw-medium text-sm mb-1">Area</dt>
                <dd className="mb-0">{requirement.area || "—"}</dd>
              </div>
              <div className="mb-3">
                <dt className="text-secondary-light fw-medium text-sm mb-1">Curriculum / Grade</dt>
                <dd className="mb-0">
                  {requirement.curriculum || "—"}
                  {requirement.curriculum && requirement.grade ? " / " : ""}
                  {requirement.grade ? `Year ${requirement.grade}` : ""}
                </dd>
              </div>
              <div className="mb-3">
                <dt className="text-secondary-light fw-medium text-sm mb-1">Tuition Type</dt>
                <dd className="mb-0 text-capitalize">{requirement.tuitionType?.toLowerCase() || "—"}</dd>
              </div>
              <div className="mb-3">
                <dt className="text-secondary-light fw-medium text-sm mb-1">Mode of Teaching</dt>
                <dd className="mb-0 text-capitalize">{requirement.modeOfTeaching || "—"}</dd>
              </div>
              <div className="mb-3">
                <dt className="text-secondary-light fw-medium text-sm mb-1">Expected Fee</dt>
                <dd className="mb-0 fw-semibold">
                  {requirement.expectedFeePerHour ? `AED ${requirement.expectedFeePerHour}/hr` : "—"}
                </dd>
              </div>
              <div className="mb-3">
                <dt className="text-secondary-light fw-medium text-sm mb-1">Status</dt>
                <dd className="mb-0">
                  <span className={`bg-${badgeColor}-focus text-${badgeColor}-600 border border-${badgeColor}-main px-16 py-4 radius-4 fw-medium text-sm`}>
                    {requirement.status?.replace(/_/g, " ") || "—"}
                  </span>
                </dd>
              </div>
              <div className="mb-3">
                <dt className="text-secondary-light fw-medium text-sm mb-1">Owner</dt>
                <dd className="mb-0">{requirement.ownerName || requirement.ownerEmail || "—"}</dd>
              </div>
              {requirement.notes && (
                <div className="mb-3">
                  <dt className="text-secondary-light fw-medium text-sm mb-1">Notes</dt>
                  <dd className="mb-0 text-sm">{requirement.notes}</dd>
                </div>
              )}
              <div className="mb-0">
                <dt className="text-secondary-light fw-medium text-sm mb-1">Created</dt>
                <dd className="mb-0">{requirement.createdAt}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Match List Panel */}
      <div className="col-12 col-lg-8">
        <MatchList matches={matches} />
      </div>
    </div>
  );
}
