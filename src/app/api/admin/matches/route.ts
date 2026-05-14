import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));

    const supabase = createAdminClient();

    const { data: stats, error: statsError } = await supabase.rpc(
      "admin_get_pipeline_stats",
    );
    const { data: matches, error: matchesError } = await supabase.rpc(
      "admin_get_all_matches",
    );

    if (statsError) {
      return NextResponse.json({ error: statsError.message }, { status: 400 });
    }
    if (matchesError) {
      return NextResponse.json({ error: matchesError.message }, { status: 400 });
    }

    const allMatches = matches ?? [];
    const total = Array.isArray(allMatches) ? allMatches.length : 0;
    const start = (page - 1) * limit;
    const data_ = Array.isArray(allMatches) ? allMatches.slice(start, start + limit) : [];

    return NextResponse.json({
      data: {
        stats: stats ?? null,
        matches: data_,
        total,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
