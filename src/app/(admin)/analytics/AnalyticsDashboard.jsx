"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const EVENT_COLORS = {
  page_view: "#4F46E5",
  requirement_view: "#0EA5E9",
  tutor_profile_view: "#8B5CF6",
  unlock_contact_click: "#F59E0B",
  unlock_contact_success: "#10B981",
  unlock_contact_failed: "#EF4444",
  apply_tutor_click: "#EC4899",
  save_requirement_click: "#6366F1",
  user_signup: "#14B8A6",
  user_login: "#22C55E",
  search_query: "#F97316",
};

function StatCard({ label, value, subtext, color }) {
  return (
    <div className="card radius-8 border-0 shadow-sm h-100">
      <div className="card-body p-20">
        <div className="d-flex align-items-center justify-content-between mb-12">
          <span className="text-secondary-light fw-medium text-sm">{label}</span>
        </div>
        <h3 className="fw-semibold mb-4" style={{ fontSize: "1.75rem" }}>
          {value.toLocaleString()}
        </h3>
        {subtext && (
          <span className="text-xs" style={{ color }}>
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsDashboard({
  stats,
  chartData,
  eventSeries,
  topRequirements,
  topTutors,
  recentEvents,
}) {
  const [selectedEvents, setSelectedEvents] = useState(
    eventSeries.map((s) => s.key)
  );

  const toggleEvent = (key) => {
    setSelectedEvents((prev) =>
      prev.includes(key)
        ? prev.length > 1
          ? prev.filter((k) => k !== key)
          : prev
        : [...prev, key]
    );
  };

  const visibleSeries = eventSeries.filter((s) => selectedEvents.includes(s.key));

  const lineOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true },
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: chartData.map((d) =>
        new Date(d.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })
      ),
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: { labels: { fontSize: "11px" } },
    legend: { position: "top", fontSize: "11px" },
    grid: { borderColor: "#f1f1f1" },
    tooltip: { theme: "light" },
    dataLabels: { enabled: false },
  };

  const barOptions = {
    chart: {
      type: "bar",
      toolbar: {show: false},
      animations: { enabled: true },
    },
    plotOptions: { bar: { horizontal: false, columnWidth: "40%", borderRadius: 4 } },
    xaxis: { labels: { style: { fontSize: "11px" } } },
    yaxis: { labels: { fontSize: "11px" } },
    grid: { borderColor: "#f1f1f1" },
    dataLabels: { enabled: false },
  };

  const allEventNames = Object.keys(EVENT_COLORS);

  const eventBarData = allEventNames.map((name) => ({
    name: stats.eventLabels[name] || name,
    data: [stats.byEvent[name] || 0],
  }));

  return (
    <div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-20 mb-24">
        <div className="col">
          <StatCard label="Total Events" value={stats.total} subtext="All time" color="#4F46E5" />
        </div>
        <div className="col">
          <StatCard label="Last 30 Days" value={stats.last30Days} subtext="+30d" color="#0EA5E9" />
        </div>
        <div className="col">
          <StatCard label="Last 7 Days" value={stats.last7Days} subtext="+7d" color="#10B981" />
        </div>
        <div className="col">
          <StatCard label="Today" value={stats.today} subtext="So far" color="#F59E0B" />
        </div>
      </div>

      <div className="row g-20 mb-24">
        <div className="col-lg-8">
          <div className="card radius-8 border-0 shadow-sm h-100">
            <div className="card-header border-0 bg-transparent d-flex align-items-center justify-content-between pb-0">
              <h6 className="fw-semibold mb-0">Events Over Time</h6>
              <div className="d-flex flex-wrap gap-8">
                {allEventNames.map((name) => (
                  <label
                    key={name}
                    className="d-flex align-items-center gap-4 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(name)}
                      onChange={() => toggleEvent(name)}
                      className="form-check-input"
                    />
                    <span
                      className="badge border-0"
                      style={{
                        backgroundColor: EVENT_COLORS[name],
                        fontSize: "10px",
                        padding: "3px 8px",
                        opacity: selectedEvents.includes(name) ? 1 : 0.35,
                      }}
                    >
                      {stats.eventLabels[name] || name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="card-body pt-12">
              {visibleSeries.length > 0 ? (
                <Chart
                  options={lineOptions}
                  series={visibleSeries}
                  type="line"
                  height={280}
                />
              ) : (
                <div className="text-center py-5 text-secondary-light">Select at least one event type</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card radius-8 border-0 shadow-sm h-100">
            <div className="card-header border-0 bg-transparent">
              <h6 className="fw-semibold mb-0">Events Breakdown (30d)</h6>
            </div>
            <div className="card-body pt-12">
              <Chart
                options={{
                  ...barOptions,
                  xaxis: {
                    categories: ["Events"],
                    labels: { show: false },
                  },
                  colors: allEventNames.map((n) => EVENT_COLORS[n]),
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      barHeight: "70%",
                      borderRadius: 4,
                    },
                  },
                }}
                series={eventBarData}
                type="bar"
                height={320}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-20 mb-24">
        <div className="col-lg-6">
          <div className="card radius-8 border-0 shadow-sm h-100">
            <div className="card-header border-0 bg-transparent">
              <h6 className="fw-semibold mb-0">Top Requirements (30d)</h6>
            </div>
            <div className="card-body pt-0">
              {topRequirements.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="text-xs text-secondary-light fw-medium">#</th>
                        <th className="text-xs text-secondary-light fw-medium">Subject</th>
                        <th className="text-xs text-secondary-light fw-medium text-end">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRequirements.map((req, i) => (
                        <tr key={req.id}>
                          <td className="text-sm">{i + 1}</td>
                          <td>
                            <div>
                              <div className="text-sm fw-medium">{req.subject}</div>
                              <div className="text-xs text-secondary-light">{req.title}</div>
                            </div>
                          </td>
                          <td className="text-end">
                            <span
                              className="badge bg-primary-subtle text-primary radius-4 px-12"
                              style={{ fontSize: "12px" }}
                            >
                              {req.views}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5 text-secondary-light">No data yet</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card radius-8 border-0 shadow-sm h-100">
            <div className="card-header border-0 bg-transparent">
              <h6 className="fw-semibold mb-0">Top Tutors (30d)</h6>
            </div>
            <div className="card-body pt-0">
              {topTutors.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="text-xs text-secondary-light fw-medium">#</th>
                        <th className="text-xs text-secondary-light fw-medium">Name</th>
                        <th className="text-xs text-secondary-light fw-medium text-end">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topTutors.map((tutor, i) => (
                        <tr key={tutor.id}>
                          <td className="text-sm">{i + 1}</td>
                          <td className="text-sm fw-medium">{tutor.name}</td>
                          <td className="text-end">
                            <span
                              className="badge bg-secondary-subtle text-secondary radius-4 px-12"
                              style={{ fontSize: "12px" }}
                            >
                              {tutor.views}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5 text-secondary-light">No data yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card radius-8 border-0 shadow-sm">
        <div className="card-header border-0 bg-transparent">
          <h6 className="fw-semibold mb-0">Recent Events</h6>
        </div>
        <div className="card-body pt-0">
          {recentEvents.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="text-xs text-secondary-light fw-medium">Event</th>
                    <th className="text-xs text-secondary-light fw-medium">Entity</th>
                    <th className="text-xs text-secondary-light fw-medium">Session</th>
                    <th className="text-xs text-secondary-light fw-medium text-end">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((e, i) => (
                    <tr key={i}>
                      <td>
                        <span
                          className="badge radius-4 px-12"
                          style={{
                            backgroundColor: EVENT_COLORS[e.event_name] + "20",
                            color: EVENT_COLORS[e.event_name],
                            fontSize: "11px",
                          }}
                        >
                          {stats.eventLabels[e.event_name] || e.event_name}
                        </span>
                      </td>
                      <td className="text-xs">
                        {e.entity_id ? (
                          <code className="text-secondary-light" style={{ fontSize: "11px" }}>
                            {e.entity_type}/{e.entity_id?.slice(0, 8)}...
                          </code>
                        ) : (
                          <span className="text-secondary-light">—</span>
                        )}
                      </td>
                      <td className="text-xs text-secondary-light">
                        {e.session_id?.slice(0, 16)}...
                      </td>
                      <td className="text-end">
                        <span className="text-xs text-secondary-light">{e.created_at}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-secondary-light">
              No events recorded yet. Once you add the GA4 Measurement ID and events fire, data will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}