"use client";

import React, { useEffect, useState } from "react";
import { getMatchTimeline } from "./actions";
import type { TimelineEvent } from "@/lib/types/supabase";

interface SessionTimelineProps {
  matchId: string;
}

const STATUS_ICONS: Record<string, string> = {
  SCHEDULED: "ri-calendar-check-line text-primary",
  COMPLETED: "ri-checkbox-circle-line text-success",
  CANCELLED: "ri-close-circle-line text-danger",
  NO_SHOW: "ri-user-unfollow-line text-warning",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SessionTimeline({ matchId }: SessionTimelineProps) {
  const [sessions, setSessions] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const { data, error } = await getMatchTimeline(matchId);
        if (!error && data) setSessions(data as unknown as TimelineEvent[]);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, [matchId]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return <p className="text-center text-secondary-light py-20 mb-0">No sessions yet.</p>;
  }

  return (
    <div className="position-relative">
      {sessions.map((session, index) => (
        <div key={session.sessionId} className="d-flex gap-3 mb-24 position-relative">
          <div className="d-flex flex-column align-items-center">
            <span className={`${STATUS_ICONS[session.status] || "ri-question-line"} fs-5`} />
            {index < sessions.length - 1 && (
              <div className="vr h-100 mt-1" style={{ minHeight: "40px" }} />
            )}
          </div>
          <div className="flex-grow-1">
            <div
              className="d-flex align-items-center gap-2 cursor-pointer"
              onClick={() => setExpanded(expanded === session.sessionId ? null : session.sessionId)}
              style={{ cursor: "pointer" }}
            >
              <h6 className="mb-0 text-capitalize">
                {session.sessionType.replace(/_/g, " ").toLowerCase()}
              </h6>
              <span
                className={`badge bg-${session.status === "COMPLETED" ? "success" : session.status === "CANCELLED" ? "danger" : session.status === "NO_SHOW" ? "warning" : "primary"} text-white px-12 py-4 radius-4 fw-medium text-sm`}
              >
                {session.status}
              </span>
              <i className={`ri-${expanded === session.sessionId ? "arrow-up-s" : "arrow-down-s"}-line text-secondary-light`} />
            </div>
            <p className="text-sm text-secondary-light mb-1">
              <i className="ri-time-line me-1" />
              {formatDateTime(session.scheduledAt)}
            </p>

            {expanded === session.sessionId && (
              <div className="mt-8 p-12 bg-light rounded-2">
                {session.locationUrl && (
                  <p className="mb-1 text-sm">
                    <i className="ri-map-pin-line me-1" />
                    <a href={session.locationUrl} target="_blank" rel="noopener noreferrer">Location</a>
                  </p>
                )}
                {session.meetingLink && (
                  <p className="mb-1 text-sm">
                    <i className="ri-video-on-line me-1" />
                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">Meeting Link</a>
                  </p>
                )}
                {session.feedback && (
                  <p className="mb-1 text-sm">
                    <i className="ri-chat-1-line me-1" />
                    {session.feedback}
                  </p>
                )}
                {session.rating && (
                  <p className="mb-1 text-sm">
                    <i className="ri-star-line me-1" />
                    Rating: {session.rating}/5
                  </p>
                )}
                {session.outcome && (
                  <p className="mb-1 text-sm">
                    <i className="ri-flag-line me-1" />
                    Outcome: <strong>{session.outcome}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
