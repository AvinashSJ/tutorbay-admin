import React from "react";
import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import RequirementDetailClient from "../RequirementDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
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

export default async function RequirementDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: requirement, error } = await supabase
    .from("Requirement")
    .select(`
      id, title, subject, area, status, "tuitionType",
      "publishedAt", "createdAt", "updatedAt",
      "curriculum", "grade", "locationUrl", "modeOfTeaching",
      "expectedFeePerHour", availability, notes, "ownerId",
      owner:User!ownerId(id, email, "fullName")
    `)
    .eq("id", id)
    .single();

  if (error || !requirement) notFound();

  const { data: matches } = await supabase.rpc("admin_get_requirement_matches", {
    p_requirement_id: id,
  });

  const owner = requirement.owner as unknown as { id: string; email: string; fullName: string } | null;

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h2 className="fw-semibold mb-4">{requirement.title}</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-secondary-light fw-normal">Dashboard</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/requirements" className="text-secondary-light fw-normal">Requirements</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {requirement.title}
              </li>
            </ol>
          </nav>
        </div>
        <a href="/requirements" className="btn btn-outline-secondary">
          <i className="ri-arrow-left-line me-2" />Back
        </a>
      </div>

      <RequirementDetailClient
        requirement={{
          id: requirement.id,
          title: requirement.title,
          subject: requirement.subject,
          area: requirement.area,
          status: requirement.status,
          tuitionType: requirement.tuitionType,
          publishedAt: formatDate(requirement.publishedAt),
          createdAt: formatDate(requirement.createdAt),
          updatedAt: formatDate(requirement.updatedAt),
          curriculum: requirement.curriculum,
          grade: requirement.grade,
          locationUrl: requirement.locationUrl,
          modeOfTeaching: requirement.modeOfTeaching,
          expectedFeePerHour: requirement.expectedFeePerHour,
          notes: requirement.notes,
          ownerName: owner?.fullName ?? null,
          ownerEmail: owner?.email ?? null,
        }}
        matches={
          matches?.map((m: Record<string, unknown>) => ({
            matchId: m.matchId as string,
            tutorId: m.tutorId as string,
            tutorName: m.tutorName as string,
            tutorEmail: m.tutorEmail as string,
            tutorPhone: m.tutorPhone as string,
            subjects: m.subjects as string[],
            areas: m.areas as string[],
            matchScore: m.matchScore as number | null,
            status: m.status as string,
            tutorNotes: m.tutorNotes as string | null,
            parentNotes: m.parentNotes as string | null,
            sessionCount: m.sessionCount as number,
            lastSessionDate: m.lastSessionDate as string | null,
            createdAt: formatDate(m.createdAt as string),
          })) ?? []
        }
      />
    </>
  );
}
