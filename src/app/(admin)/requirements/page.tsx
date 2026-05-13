import React from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import RequirementTable from "./RequirementTable";

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

export default async function RequirementsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const supabase = createAdminClient();

  const { data: requirements, error } = await supabase
    .from("Requirement")
    .select(`
      id, title, subject, area, status, "tuitionType",
      "publishedAt", "createdAt", "updatedAt",
      "curriculum", "grade", "locationUrl", "modeOfTeaching",
      "expectedFeePerHour", availability, notes,
      owner:User!ownerId(id, email, "fullName")
    `)
    .order("createdAt", { ascending: false });

  // Fetch match counts per requirement
  const { data: matchCounts } = await supabase
    .from("RequirementMatch")
    .select('"requirementId", id')
    .then((res) => {
      if (res.error) return { data: null };
      const counts: Record<string, number> = {};
      for (const row of res.data ?? []) {
        const rid = row.requirementId as string;
        counts[rid] = (counts[rid] || 0) + 1;
      }
      return { data: counts };
    });

  const mapped = (requirements ?? []).map((r) => {
    const owner = r.owner as unknown as { id: string; email: string; fullName: string } | null;
    return {
      id: r.id,
      title: r.title,
      subject: r.subject,
      area: r.area,
      status: r.status,
      tuitionType: r.tuitionType,
      publishedAt: r.publishedAt,
      createdAt: formatDate(r.createdAt),
      updatedAt: formatDate(r.updatedAt),
      curriculum: r.curriculum,
      grade: r.grade,
      locationUrl: r.locationUrl,
      modeOfTeaching: r.modeOfTeaching,
      expectedFeePerHour: r.expectedFeePerHour,
      availability: r.availability,
      notes: r.notes,
      ownerId: owner?.id ?? null,
      ownerEmail: owner?.email ?? null,
      ownerName: owner?.fullName ?? null,
      matchCount: matchCounts?.[r.id] ?? 0,
    };
  });

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h2 className="fw-semibold mb-4">Requirements Management</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-secondary-light fw-normal">
                  Dashboard
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Requirements
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {params.message && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
          <i className="ri-checkbox-circle-line text-xl" />
          {params.message}
        </div>
      )}
      {(params.error || error) && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
          <i className="ri-error-warning-line text-xl" />
          {params.error ?? "Failed to load requirements."}
        </div>
      )}

      <RequirementTable requirements={mapped} />
    </>
  );
}