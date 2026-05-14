"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

const REQUIREMENTS_PATH = "/requirements";

export async function changeRequirementStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  const allowedStatuses = ["DRAFT", "PUBLISHED", "OPEN", "CLOSED", "CANCELLED"];
  if (!id || !allowedStatuses.includes(status)) {
    redirect(`${REQUIREMENTS_PATH}?error=${encodeURIComponent("Invalid requirement or status.")}`);
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("Requirement")
    .update({ status, updatedAt: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    redirect(`${REQUIREMENTS_PATH}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(REQUIREMENTS_PATH);
  redirect(`${REQUIREMENTS_PATH}?message=${encodeURIComponent("Requirement status updated.")}`);
}

export async function deleteRequirement(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect(`${REQUIREMENTS_PATH}?error=${encodeURIComponent("Invalid requirement.")}`);
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("Requirement").delete().eq("id", id);

  if (error) {
    redirect(`${REQUIREMENTS_PATH}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(REQUIREMENTS_PATH);
  redirect(`${REQUIREMENTS_PATH}?message=${encodeURIComponent("Requirement deleted.")}`);
}

// --- JSON-returning server actions for match/session operations ---

export async function scheduleSession(formData: {
  matchId: string;
  scheduledAt: string;
  sessionType: string;
  locationUrl?: string;
  meetingLink?: string;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.rpc("schedule_match_session", {
    p_match_id: formData.matchId,
    p_scheduled_at: formData.scheduledAt,
    p_session_type: formData.sessionType,
    p_location_url: formData.locationUrl ?? null,
    p_meeting_link: formData.meetingLink ?? null,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`${REQUIREMENTS_PATH}/[id]`);
  return { success: true };
}

export async function updateSessionStatus(sessionId: string, status: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.rpc("update_session_status", {
    p_session_id: sessionId,
    p_status: status,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`${REQUIREMENTS_PATH}/[id]`);
  return { success: true };
}

export async function getMatchTimeline(matchId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("admin_get_match_timeline", {
    p_match_id: matchId,
  });
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function submitFeedback(formData: {
  sessionId: string;
  feedback: string;
  rating: number;
  outcome: string;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.rpc("submit_session_feedback", {
    p_session_id: formData.sessionId,
    p_feedback: formData.feedback,
    p_rating: formData.rating,
    p_outcome: formData.outcome,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`${REQUIREMENTS_PATH}/[id]`);
  return { success: true };
}