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

    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { data: tutorProfiles } = await supabase
      .from("TutorProfile")
      .select("userId, applicationStatus, adminNotes");

    const tutorProfileMap = new Map(
      (tutorProfiles ?? []).map((p) => [p.userId, p]),
    );

    const allUsers = (data?.users ?? []).map((u) => {
      const tutorProfile = tutorProfileMap.get(u.id);
      return {
        id: u.id,
        email: u.email ?? "(no email)",
        phone: u.phone ?? null,
        role: (u.user_metadata?.role as string) || "student",
        createdAt: formatDate(u.created_at),
        lastSignIn: formatDate(u.last_sign_in_at),
        isBanned:
          !!u.banned_until && new Date(u.banned_until) > new Date(),
        tutorApplicationStatus: tutorProfile?.applicationStatus ?? null,
        tutorAdminNotes: tutorProfile?.adminNotes ?? null,
      };
    });

    const total = allUsers.length;
    const start = (page - 1) * limit;
    const data_ = allUsers.slice(start, start + limit);

    return NextResponse.json({ data: data_, total });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
