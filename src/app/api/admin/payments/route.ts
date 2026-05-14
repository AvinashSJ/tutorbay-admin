import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));

    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc("admin_get_all_payments");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const all = data ?? [];
    const total = Array.isArray(all) ? all.length : 0;
    const start = (page - 1) * limit;
    const data_ = Array.isArray(all) ? all.slice(start, start + limit) : [];

    return NextResponse.json({ data: data_, total });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
