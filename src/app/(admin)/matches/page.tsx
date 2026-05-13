import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import MatchOverview from "./MatchOverview";
import type { Stats } from "./MatchOverview";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const supabase = createAdminClient();

  const { data: stats, error: statsError } = await supabase.rpc("admin_get_pipeline_stats");
  const { data: matches, error: matchesError } = await supabase.rpc("admin_get_all_matches");

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h2 className="fw-semibold mb-4">Pipeline Overview</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-secondary-light fw-normal">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Matches</li>
            </ol>
          </nav>
        </div>
      </div>

      {(statsError || matchesError) && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
          <i className="ri-error-warning-line text-xl" />
          {statsError?.message ?? matchesError?.message ?? "Failed to load data."}
        </div>
      )}

      <MatchOverview
        stats={stats as Stats | null}
        matches={matches as Record<string, unknown>[] ?? []}
      />
    </>
  );
}
