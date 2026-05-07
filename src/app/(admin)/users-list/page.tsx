import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";

type PageProps = {
  searchParams: Promise<{ error?: string; message?: string; q?: string }>;
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string, email: string): string {
  if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return email.slice(0, 2).toUpperCase();
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 45%)`;
}

export default async function UsersListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = (params.q || "").toLowerCase();

  const supabase = createAdminClient();

  // Fetch users from Supabase Auth
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });

  // Fetch tutor profiles for application status
  const { data: tutorProfiles } = await supabase
    .from("TutorProfile")
    .select("userId, applicationStatus");

  const tutorProfileMap = new Map(
    (tutorProfiles ?? []).map((p) => [p.userId, p.applicationStatus])
  );

  const users = (data?.users ?? [])
    .map((u) => ({
      id: u.id,
      email: u.email ?? "(no email)",
      fullName: (u.user_metadata?.fullName as string) || "",
      phone: (u.user_metadata?.phone as string) || "",
      role: (u.user_metadata?.role as string) || "student",
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at,
      isBanned: !!u.banned_until && new Date(u.banned_until) > new Date(),
      tutorApplicationStatus: tutorProfileMap.get(u.id) ?? null,
    }))
    .filter((u) => {
      if (!query) return true;
      return (
        u.email.toLowerCase().includes(query) ||
        u.fullName.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
      );
    });

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h2 className="fw-semibold mb-4">Users List</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-secondary-light fw-normal">
                  Dashboard
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Users List
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
      {params.error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
          <i className="ri-error-warning-line text-xl" />
          {params.error}
        </div>
      )}

      {/* Search */}
      <div className="card mb-24">
        <div className="card-body p-16">
          <form method="GET" className="d-flex gap-2">
            <div className="flex-grow-1 position-relative">
              <input
                type="text"
                name="q"
                className="form-control"
                placeholder="Search by email, name, or role..."
                defaultValue={params.q || ""}
              />
              <i className="ri-search-line position-absolute top-50 translate-middle-y" style={{ right: 12 }} />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Users List */}
      {error ? (
        <div className="alert alert-danger">
          Failed to load users. Check your service-role key.
        </div>
      ) : (
        <div className="row g-3">
          {users.length === 0 ? (
            <div className="col-12">
              <div className="card p-40 text-center text-secondary-light">
                No users found.
              </div>
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="w-40-px h-40-px rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center fw-semibold text-white"
                        style={{ background: stringToColor(user.email), fontSize: 14 }}
                      >
                        {getInitials(user.fullName, user.email)}
                      </div>
                      <div className="flex-grow-1 min-width-0">
                        <h6 className="mb-0 text-truncate">{user.fullName || user.email}</h6>
                        <small className="text-secondary-light text-truncate d-block">{user.email}</small>
                      </div>
                      {user.isBanned ? (
                        <span className="badge bg-danger-subtle text-danger-600 border border-danger-main px-8 py-2 radius-4 fw-medium text-xs">
                          Banned
                        </span>
                      ) : (
                        <span className="badge bg-success-subtle text-success-600 border border-success-main px-8 py-2 radius-4 fw-medium text-xs">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary-light text-sm">Role:</span>
                        <span className="text-dark text-sm fw-medium text-capitalize">{user.role}</span>
                      </div>
                      {user.role === "tutor" && user.tutorApplicationStatus && (
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-secondary-light text-sm">Application:</span>
                          <span className={`badge bg-${
                            user.tutorApplicationStatus === "APPROVED" ? "success" :
                            user.tutorApplicationStatus === "PENDING_REVIEW" ? "warning" :
                            user.tutorApplicationStatus === "REJECTED" ? "danger" :
                            user.tutorApplicationStatus === "ADDITIONAL_INFO_REQUIRED" ? "info" : "secondary"
                          }-subtle text-${
                            user.tutorApplicationStatus === "APPROVED" ? "success" :
                            user.tutorApplicationStatus === "PENDING_REVIEW" ? "warning" :
                            user.tutorApplicationStatus === "REJECTED" ? "danger" :
                            user.tutorApplicationStatus === "ADDITIONAL_INFO_REQUIRED" ? "info" : "secondary"
                          }-600 px-8 py-2 radius-4 fw-medium text-xs`}>
                            {                            user.tutorApplicationStatus.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                          </span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary-light text-sm">Created:</span>
                        <span className="text-dark text-sm">{formatDate(user.createdAt)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-secondary-light text-sm">Last Sign In:</span>
                        <span className="text-dark text-sm">{formatDate(user.lastSignIn)}</span>
                      </div>
                    </div>

                    <div className="border-top pt-3 mt-3">
                      <a href={`/users?q=${encodeURIComponent(user.email)}`} className="btn btn-sm btn-outline-primary w-100">
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Count */}
      <div className="mt-3 text-center text-secondary-light text-sm">
        Showing {users.length} of {data?.users?.length ?? 0} users
      </div>
    </>
  );
}
