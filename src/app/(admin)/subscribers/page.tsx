import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import SubscriberTable from "./SubscriberTable";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const supabase = createAdminClient();

  const { data: subscribers, error } = await supabase.rpc("admin_get_subscribers");

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h2 className="fw-semibold mb-4">Subscribers</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-secondary-light fw-normal">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Subscribers</li>
            </ol>
          </nav>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
          <i className="ri-error-warning-line text-xl" />
          {error.message ?? "Failed to load subscribers."}
        </div>
      )}

      <SubscriberTable subscribers={(subscribers as Record<string, unknown>[]) ?? []} />
    </>
  );
}
