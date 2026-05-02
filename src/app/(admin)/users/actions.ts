"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

const USERS_PATH = "/users";

function sanitizeError(msg: string): string {
  // Don't leak internal Supabase error details to the UI
  if (msg.toLowerCase().includes("not found")) return "User not found.";
  if (msg.toLowerCase().includes("already registered")) return "A user with that email already exists.";
  if (msg.toLowerCase().includes("invalid")) return "Invalid input provided.";
  return "An error occurred. Please try again.";
}

export async function inviteUser(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    redirect(`${USERS_PATH}?error=${encodeURIComponent("A valid email address is required.")}`);
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.inviteUserByEmail(email);

  if (error) {
    redirect(`${USERS_PATH}?error=${encodeURIComponent(sanitizeError(error.message))}`);
  }

  revalidatePath(USERS_PATH);
  redirect(`${USERS_PATH}?message=${encodeURIComponent(`Invitation sent to ${email}.`)}`);
}

export async function updateUserRole(formData: FormData) {
  const userId = String(formData.get("userId") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();

  const allowedRoles = ["admin", "tutor", "student"];
  if (!userId || !allowedRoles.includes(role)) {
    redirect(`${USERS_PATH}?error=${encodeURIComponent("Invalid user or role.")}`);
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  });

  if (error) {
    redirect(`${USERS_PATH}?error=${encodeURIComponent(sanitizeError(error.message))}`);
  }

  revalidatePath(USERS_PATH);
  redirect(`${USERS_PATH}?message=${encodeURIComponent("User role updated.")}`);
}

export async function deleteUser(formData: FormData) {
  const userId = String(formData.get("userId") ?? "").trim();

  if (!userId) {
    redirect(`${USERS_PATH}?error=${encodeURIComponent("Invalid user.")}`);
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    redirect(`${USERS_PATH}?error=${encodeURIComponent(sanitizeError(error.message))}`);
  }

  revalidatePath(USERS_PATH);
  redirect(`${USERS_PATH}?message=${encodeURIComponent("User deleted successfully.")}`);
}

export async function toggleBanUser(formData: FormData) {
  const userId = String(formData.get("userId") ?? "").trim();
  const isBanned = formData.get("isBanned") === "true";

  if (!userId) {
    redirect(`${USERS_PATH}?error=${encodeURIComponent("Invalid user.")}`);
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    // Setting ban_duration to "none" lifts the ban; "876600h" (~100 years) bans indefinitely
    ban_duration: isBanned ? "none" : "876600h",
  });

  if (error) {
    redirect(`${USERS_PATH}?error=${encodeURIComponent(sanitizeError(error.message))}`);
  }

  revalidatePath(USERS_PATH);
  redirect(
    `${USERS_PATH}?message=${encodeURIComponent(isBanned ? "User unbanned." : "User banned.")}`,
  );
}
