import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { ANALYTICS_EVENTS } from "./analyticsEvents";

export const metadata = {
  title: "Analytics | Tutorbay Admin",
  description: "Analytics and event tracking dashboard",
};

const EVENT_LABELS = {
  [ANALYTICS_EVENTS.PAGE_VIEW]: "Page Views",
  [ANALYTICS_EVENTS.REQUIREMENT_VIEW]: "Requirement Views",
  [ANALYTICS_EVENTS.TUTOR_PROFILE_VIEW]: "Tutor Profile Views",
  [ANALYTICS_EVENTS.UNLOCK_CONTACT_CLICK]: "Unlock Contact Clicks",
  [ANALYTICS_EVENTS.UNLOCK_CONTACT_SUCCESS]: "Unlock Contact Success",
  [ANALYTICS_EVENTS.UNLOCK_CONTACT_FAILED]: "Unlock Contact Failed",
  [ANALYTICS_EVENTS.APPLY_TUTOR_CLICK]: "Apply Tutor Clicks",
  [ANALYTICS_EVENTS.SAVE_REQUIREMENT_CLICK]: "Save Requirement Clicks",
  [ANALYTICS_EVENTS.USER_SIGNUP]: "User Signups",
  [ANALYTICS_EVENTS.USER_LOGIN]: "User Logins",
  [ANALYTICS_EVENTS.SEARCH_QUERY]: "Search Queries",
};

export default async function AnalyticsPage() {
  const supabase = createAdminClient();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    { data: totalEvents },
    { data: last30Days },
    { data: last7Days },
    { data: todayEvents },
    { data: eventsByName },
    { data: topRequirements },
    { data: topTutors },
    { data: recentEvents },
    { data: eventsByDay },
  ] = await Promise.all([
    supabase.from("analytics_events").select("id", { count: "exact", head: true }),
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString()),
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString()),
    supabase
      .from("analytics_events")
      .select("event_name, id")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("analytics_events")
      .select("entity_id, event_name, metadata")
      .eq("event_name", ANALYTICS_EVENTS.REQUIREMENT_VIEW)
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("analytics_events")
      .select("entity_id, event_name, metadata")
      .eq("event_name", ANALYTICS_EVENTS.TUTOR_PROFILE_VIEW)
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("analytics_events")
      .select("event_name, user_id, entity_id, entity_type, metadata, created_at, session_id")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("analytics_events")
      .select("event_name, created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true }),
  ]);

  const eventCounts: Record<string, number> = {};
  (eventsByName ?? []).forEach((e) => {
    eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1;
  });

  const reqViewCounts: Record<string, number> = {};
  (topRequirements ?? []).forEach((e) => {
    if (e.entity_id) reqViewCounts[e.entity_id] = (reqViewCounts[e.entity_id] || 0) + 1;
  });
  const topReqIds = Object.entries(reqViewCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => id);

  const tutorViewCounts: Record<string, number> = {};
  (topTutors ?? []).forEach((e) => {
    if (e.entity_id) tutorViewCounts[e.entity_id] = (tutorViewCounts[e.entity_id] || 0) + 1;
  });
  const topTutorIds = Object.entries(tutorViewCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => id);

  let topReqData: Array<{ id: string; subject: string; title: string; views: number }> = [];
  let topTutorData: Array<{ id: string; name: string; views: number }> = [];

  if (topReqIds.length > 0) {
    const { data: reqs } = await supabase
      .from("Requirement")
      .select("id, subject, title")
      .in("id", topReqIds);
    if (reqs) {
      topReqData = reqs.map((r) => ({
        id: r.id,
        subject: r.subject,
        title: r.title,
        views: reqViewCounts[r.id] || 0,
      }));
    }
  }

  if (topTutorIds.length > 0) {
    const { data: tutors } = await supabase
      .from("User")
      .select("id, fullName")
      .in("id", topTutorIds);
    if (tutors) {
      topTutorData = tutors.map((t) => ({
        id: t.id,
        name: t.fullName,
        views: tutorViewCounts[t.id] || 0,
      }));
    }
  }

  const dailyCounts: Record<string, Record<string, number>> = {};
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    days.push(key);
    dailyCounts[key] = {};
  }

  (eventsByDay ?? []).forEach((e) => {
    const key = String(e.created_at).split("T")[0];
    if (dailyCounts[key]) {
      dailyCounts[key][e.event_name] = (dailyCounts[key][e.event_name] || 0) + 1;
      dailyCounts[key]["_total"] = (dailyCounts[key]["_total"] || 0) + 1;
    }
  });

  const chartData = days.map((day) => ({
    date: day,
    ...dailyCounts[day],
  }));

  const allEventNames = Object.values(ANALYTICS_EVENTS);
  const eventSeries = allEventNames
    .map((name) => ({
      name: EVENT_LABELS[name] || name,
      key: name,
      data: days.map((day) => dailyCounts[day]?.[name] || 0),
    }))
    .filter((s) => (eventsByName ?? []).some((e) => e.event_name === s.key));

  const stats = {
    total: totalEvents ?? 0,
    last30Days: last30Days ?? 0,
    last7Days: last7Days ?? 0,
    today: todayEvents ?? 0,
    byEvent: eventCounts,
    eventLabels: EVENT_LABELS,
  };

  const recentFormatted = (recentEvents ?? []).map((e) => ({
    ...e,
    created_at: new Date(e.created_at).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h2 className="fw-semibold mb-4">Analytics</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-secondary-light fw-normal">
                  Dashboard
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Analytics
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-8">
          <span className="badge bg-primary-subtle text-primary px-16 py-8 radius-4">
            {todayStart.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <AnalyticsDashboard
        stats={stats}
        chartData={chartData}
        eventSeries={eventSeries}
        topRequirements={topReqData}
        topTutors={topTutorData}
        recentEvents={recentFormatted}
      />
    </>
  );
}