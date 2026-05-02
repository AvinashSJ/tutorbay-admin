import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import UserTable from "./UserTable";
import { InviteUserModal, EditRoleModal, DeleteUserModal } from "./modals";

type PageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });

  const users = (data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "(no email)",
    role: (u.user_metadata?.role as string) || "student",
    createdAt: formatDate(u.created_at),
    lastSignIn: formatDate(u.last_sign_in_at),
    isBanned: !!u.banned_until && new Date(u.banned_until) > new Date(),
  }));

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h2 className="fw-semibold mb-4">User Management</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-secondary-light fw-normal">
                  Dashboard
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                User Management
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Feedback banners */}
      {params.message && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
          <i className="ri-checkbox-circle-line text-xl" />
          {params.message}
        </div>
      )}
      {(params.error || error) && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
          <i className="ri-error-warning-line text-xl" />
          {params.error ?? "Failed to load users. Check your service-role key."}
        </div>
      )}

      <UserTable users={users} />

      {/* Modals (rendered in the DOM but only shown when triggered) */}
      <InviteUserModal />
      <EditRoleModal />
      <DeleteUserModal />
    </>
  );
}
