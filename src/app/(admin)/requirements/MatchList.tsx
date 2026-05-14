"use client";

import React, { useState } from "react";
import { scheduleSession, updateSessionStatus, submitFeedback } from "./actions";
import SessionTimeline from "./SessionTimeline";
import type { MatchRow } from "@/lib/types/supabase";

interface MatchListProps {
  matches: MatchRow[];
}

const STATUS_BADGE: Record<string, string> = {
  MATCHED: "info",
  SCHEDULED: "primary",
  HIRED: "success",
  REJECTED: "danger",
};

function getBadgeClass(status: string): string {
  return STATUS_BADGE[status] || "secondary";
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-secondary-light">—</span>;
  const color = score >= 80 ? "success" : score >= 60 ? "warning" : "danger";
  return <span className={`text-${color} fw-semibold`}>{score}%</span>;
}

export default function MatchList({ matches }: MatchListProps) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const activeMatch = matches.find((m) => m.matchId === selectedMatch);

  async function handleSchedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const result = await scheduleSession({
      matchId: fd.get("matchId") as string,
      scheduledAt: fd.get("scheduledAt") as string,
      sessionType: fd.get("sessionType") as string,
      locationUrl: (fd.get("locationUrl") as string) || undefined,
      meetingLink: (fd.get("meetingLink") as string) || undefined,
    });
    if (result.success) {
      setMessage("Session scheduled successfully.");
      (document.getElementById("scheduleModal") as HTMLDialogElement)?.close();
      (document.querySelector("[data-bs-dismiss=modal]") as HTMLElement)?.click();
    } else {
      setMessage(`Error: ${result.error}`);
    }
  }

  async function handleFeedback(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const result = await submitFeedback({
      sessionId: fd.get("sessionId") as string,
      feedback: fd.get("feedback") as string,
      rating: parseInt(fd.get("rating") as string),
      outcome: fd.get("outcome") as string,
    });
    if (result.success) {
      setMessage("Feedback submitted successfully.");
    } else {
      setMessage(`Error: ${result.error}`);
    }
  }

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24">
        <h5 className="mb-0">
          Matched Tutors
          <span className="text-sm fw-normal text-secondary-light ms-2">({matches.length} total)</span>
        </h5>
      </div>

      <div className="card-body p-24">
        {message && (
          <div className="alert alert-success d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
            <i className="ri-checkbox-circle-line text-xl" />
            {message}
          </div>
        )}

        {matches.length === 0 ? (
          <p className="text-center text-secondary-light py-40 mb-0">No tutors have applied yet.</p>
        ) : (
          <div className="table-responsive scroll-sm">
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th>Tutor</th>
                  <th>Subjects</th>
                  <th>Match Score</th>
                  <th>Status</th>
                  <th>Sessions</th>
                  <th>Applied</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.matchId}>
                    <td>
                      <div>
                        <div className="fw-medium text-secondary-light">{m.tutorName}</div>
                        <div className="text-sm text-secondary-light">{m.tutorEmail}</div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-secondary-light">{m.subjects?.slice(0, 2).join(", ") || "—"}</span>
                    </td>
                    <td>
                      <ScoreBadge score={m.matchScore} />
                    </td>
                    <td>
                      <span className={`bg-${getBadgeClass(m.status)}-focus text-${getBadgeClass(m.status)}-600 border border-${getBadgeClass(m.status)}-main px-16 py-4 radius-4 fw-medium text-sm`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <span className="text-secondary-light">
                        {m.sessionCount}
                        {m.lastSessionDate && (
                          <span className="text-xs ms-1">(last: {m.lastSessionDate})</span>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="text-secondary-light text-sm">{m.createdAt}</span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center gap-2 justify-content-center">
                        <button
                          className="btn btn-sm btn-soft-info"
                          onClick={() => setSelectedMatch(m.matchId)}
                          data-bs-toggle="modal"
                          data-bs-target={`#scheduleModal-${m.matchId}`}
                        >
                          <i className="ri-calendar-line" /> Schedule
                        </button>
                        <button
                          className="btn btn-sm btn-soft-primary"
                          onClick={() => setSelectedMatch(m.matchId)}
                          data-bs-toggle="modal"
                          data-bs-target={`#timelineModal-${m.matchId}`}
                        >
                          <i className="ri-timeline-line" /> Timeline
                        </button>
                      </div>

                      {/* Schedule Modal */}
                      <div className="modal fade" id={`scheduleModal-${m.matchId}`} tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h6 className="modal-title">Schedule Session — {m.tutorName}</h6>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" />
                            </div>
                            <form onSubmit={handleSchedule}>
                              <div className="modal-body text-start">
                                <input type="hidden" name="matchId" value={m.matchId} />
                                <div className="mb-3">
                                  <label className="form-label">Session Type</label>
                                  <select name="sessionType" className="form-select" required>
                                    <option value="DEMO_VISIT">Demo Visit (In-Person)</option>
                                    <option value="DEMO_ONLINE">Demo Online</option>
                                    <option value="ASSESSMENT">Assessment</option>
                                    <option value="TRIAL">Trial Session</option>
                                  </select>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">Scheduled Date & Time</label>
                                  <input type="datetime-local" name="scheduledAt" className="form-control" required />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">Location URL (for in-person)</label>
                                  <input type="url" name="locationUrl" className="form-control" placeholder="https://maps.google.com/..." />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">Meeting Link (for online)</label>
                                  <input type="url" name="meetingLink" className="form-control" placeholder="https://zoom.us/..." />
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Schedule</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Modal */}
                      <div className="modal fade" id={`timelineModal-${m.matchId}`} tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h6 className="modal-title">Session Timeline — {m.tutorName}</h6>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" />
                            </div>
                            <div className="modal-body">
                              <SessionTimeline matchId={m.matchId} />
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
