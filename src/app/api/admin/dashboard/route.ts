import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: stats, error: statsError } = await supabase.rpc(
      "admin_get_pipeline_stats",
    );
    const { data: users, error: usersError } =
      await supabase.auth.admin.listUsers({ perPage: 1000 });

    if (statsError) {
      return NextResponse.json({ error: statsError.message }, { status: 400 });
    }
    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 400 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentSignUps = (users?.users ?? []).filter((u) => {
      return u.created_at && new Date(u.created_at) > thirtyDaysAgo;
    }).length;

    return NextResponse.json({
      data: {
        pipelineStats: stats ?? null,
        totalUsers: users?.users?.length ?? 0,
        recentSignUps,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
