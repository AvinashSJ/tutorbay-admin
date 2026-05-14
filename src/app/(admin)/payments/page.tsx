import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import PaymentTable from "./PaymentTable";
import type { PaymentRow } from "@/lib/types/supabase";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const supabase = createAdminClient();

  const { data: payments, error } = await supabase.rpc("admin_get_all_payments");

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h2 className="fw-semibold mb-4">Payments</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-secondary-light fw-normal">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Payments</li>
            </ol>
          </nav>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
          <i className="ri-error-warning-line text-xl" />
          {error.message ?? "Failed to load payments."}
        </div>
      )}

      <PaymentTable payments={payments as PaymentRow[] ?? []} />
    </>
  );
}
