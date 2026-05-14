import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const supabase = createAdminClient();

    const { data: requirements, count, error } = await supabase
      .from("Requirement")
      .select(
        `id, title, subject, area, status, "tuitionType",
         "publishedAt", "createdAt", "updatedAt",
         "curriculum", "grade", "locationUrl", "modeOfTeaching",
         "expectedFeePerHour", availability, notes,
         owner:User!ownerId(id, email, "fullName")`,
        { count: "exact", head: false },
      )
      .order("createdAt", { ascending: false })
      .range(start, end);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const ids = (requirements ?? []).map((r) => r.id);
    const { data: matchCounts } = await supabase
      .from("RequirementMatch")
      .select('"requirementId", id')
      .in("requirementId", ids.length > 0 ? ids : ["__none__"])
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
      const owner = r.owner as unknown as {
        id: string;
        email: string;
        fullName: string;
      } | null;
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

    return NextResponse.json({ data: mapped, total: count ?? 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
