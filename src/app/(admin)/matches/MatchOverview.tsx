"use client";

import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import type { MatchRow, PipelineStats as Stats } from "@/lib/types/supabase";

interface MatchOverviewProps {
  stats: Stats | null;
  matches: MatchRow[];
}

const STATUS_BADGE: Record<string, string> = {
  MATCHED: "info",
  SCHEDULED: "primary",
  HIRED: "success",
  REJECTED: "danger",
};

function getBadgeColor(status: string): string {
  return STATUS_BADGE[status] || "secondary";
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "—";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day";
  if (diffDays < 7) return `${diffDays} days`;
  const weeks = Math.floor(diffDays / 7);
  const remainder = diffDays % 7;
  return remainder > 0 ? `${weeks}w ${remainder}d` : `${weeks}w`;
}

function daysSince(dateStr: string | null): number {
  if (!dateStr) return 0;
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export default function MatchOverview({ stats, matches }: MatchOverviewProps) {
  const [filter, setFilter] = useState<string | null>(null);

  const cards = useMemo(() => {
    if (!stats) return [];
    return [
      { label: "Total Matches", value: stats.totalMatches, key: null, icon: "mdi:account-switch", gradient: "bg-gradient-start-1", iconBg: "bg-cyan" },
      { label: "Matched", value: stats.matched, key: "MATCHED", icon: "mdi:account-plus", gradient: "bg-gradient-start-2", iconBg: "bg-info" },
      { label: "Scheduled", value: stats.scheduled, key: "SCHEDULED", icon: "mdi:calendar-check", gradient: "bg-gradient-start-3", iconBg: "bg-purple" },
      { label: "Hired", value: stats.hired, key: "HIRED", icon: "mdi:handshake", gradient: "bg-gradient-start-4", iconBg: "bg-success-main" },
      { label: "Rejected", value: stats.rejected, key: "REJECTED", icon: "mdi:account-remove", gradient: "bg-gradient-start-5", iconBg: "bg-red" },
    ];
  }, [stats]);

  const filtered = useMemo(() => {
    if (!filter) return matches;
    return matches.filter((m) => m.status === filter);
  }, [matches, filter]);

  const activeFilter = filter;

  return (
    <>
      {/* Overview Cards */}
      <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4 mb-24">
        {cards.map((card) => (
          <div className="col" key={card.label}>
            <button
              onClick={() => setFilter(card.key)}
              className={`card shadow-none border ${card.gradient} h-100 w-100 text-start border-0 ${
                activeFilter === card.key ? "ring-2 ring-primary" : ""
              }`}
              style={{ cursor: "pointer", outline: activeFilter === card.key ? "2px solid var(--primary-600)" : "none" }}
            >
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1">{card.label}</p>
                    <h6 className="mb-0">{card.value}</h6>
                  </div>
                  <div className={`w-50-px h-50-px ${card.iconBg} rounded-circle d-flex justify-content-center align-items-center`}>
                    <Icon icon={card.icon} className="text-white text-2xl mb-0" />
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Filtered List */}
      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <h5 className="mb-0">
            {filter ? `${filter} Matches` : "All Matches"}
            <span className="text-sm fw-normal text-secondary-light ms-2">({filtered.length} total)</span>
          </h5>
          {filter && (
            <button className="btn btn-sm btn-soft-secondary" onClick={() => setFilter(null)}>
              <i className="ri-close-line me-1" />Clear Filter
            </button>
          )}
        </div>

        <div className="card-body p-24">
          {filtered.length === 0 ? (
            <p className="text-center text-secondary-light py-40 mb-0">No matches found.</p>
          ) : (
            <div className="table-responsive scroll-sm">
              <table className="table bordered-table sm-table mb-0">
                <thead>
                  <tr>
                    <th>Tutor</th>
                    <th>Requirement</th>
                    <th>Subject / Area</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Scheduled Date</th>
                    <th>Sessions</th>
                    <th>Tutor Applied</th>
                    <th>Awaiting</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.matchId}>
                      <td>
                        <div>
                          <div className="fw-medium text-secondary-light">{m.tutorName}</div>
                          <div className="text-sm text-secondary-light">{m.tutorEmail}</div>
                        </div>
                      </td>
                      <td>
                        <a href={`/requirements/${m.requirementId}`} className="fw-medium text-primary-600 text-decoration-none">
                          {m.requirementTitle || m.requirementSubject}
                        </a>
                      </td>
                      <td>
                        <span className="text-sm text-secondary-light">
                          {m.requirementSubject}{m.requirementArea ? ` / ${m.requirementArea}` : ""}
                        </span>
                      </td>
                      <td>
                        {m.matchScore !== null ? (
                          <span className={`fw-semibold ${m.matchScore >= 80 ? "text-success" : m.matchScore >= 60 ? "text-warning" : "text-danger"}`}>
                            {m.matchScore}%
                          </span>
                        ) : (
                          <span className="text-secondary-light">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`bg-${getBadgeColor(m.status)}-focus text-${getBadgeColor(m.status)}-600 border border-${getBadgeColor(m.status)}-main px-16 py-4 radius-4 fw-medium text-sm`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary-light text-sm">
                          {m.status === "SCHEDULED" && m.scheduledAt
                            ? new Date(m.scheduledAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary-light text-sm">{m.sessionCount}</span>
                      </td>
                      <td>
                        <span className="text-secondary-light text-sm">
                          {m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </span>
                      </td>
                      <td>
                        {m.status === "MATCHED" ? (
                          <span className={`text-sm fw-medium ${daysSince(m.createdAt) >= 7 ? "text-danger" : "text-warning"}`}>
                            {timeAgo(m.createdAt)}
                          </span>
                        ) : (
                          <span className="text-secondary-light text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
