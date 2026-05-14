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

  const allowedRoles = ["ADMIN", "TUTOR", "STUDENT"];
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

 // ---------------------------------------------------------------------------
// Tutor Application Review
// ---------------------------------------------------------------------------
// Tutor Registration Credit Issuance
async function grantWelcomeCredits(userId: string, supabase: ReturnType<typeof createAdminClient>) {
  const WELCOME_CREDITS = 15;

  const { data: existingWallet } = await supabase
    .from("TutorWallet")
    .select("id, balance")
    .eq("tutorId", userId)
    .single();

  if (existingWallet) {
    const newBalance = existingWallet.balance + WELCOME_CREDITS;
    await supabase
      .from("TutorWallet")
      .update({ balance: newBalance })
      .eq("id", existingWallet.id);

    await supabase.from("WalletTransaction").insert({
      walletId: existingWallet.id,
      type: "CREDIT",
      source: "WELCOME_BONUS",
      amount: WELCOME_CREDITS,
      balanceAfter: newBalance,
      description: "Welcome bonus credits on tutor approval",
    });
  } else {
    const { data: newWallet, error: walletErr } = await supabase
      .from("TutorWallet")
      .insert({ tutorId: userId, balance: WELCOME_CREDITS })
      .select("id")
      .single();

    if (!walletErr && newWallet) {
      await supabase.from("WalletTransaction").insert({
        walletId: newWallet.id,
        type: "CREDIT",
        source: "WELCOME_BONUS",
        amount: WELCOME_CREDITS,
        balanceAfter: WELCOME_CREDITS,
        description: "Welcome bonus credits on tutor approval",
      });
    }
  }
}

export async function reviewTutorApplication(formData: FormData) {
  const userId = String(formData.get("userId") ?? "").trim();
  const action = String(formData.get("action") ?? "").trim();
  const adminNotes = String(formData.get("adminNotes") ?? "").trim() || null;
  const additionalInfo = String(formData.get("additionalInfo") ?? "").trim() || null;
  const redirectTo = String(formData.get("redirectTo") ?? "").trim() || USERS_PATH;

  if (!userId || !action) {
    redirect(`${USERS_PATH}?error=${encodeURIComponent("Invalid application or action.")}`);
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  let newStatus: string;
  switch (action) {
    case "APPROVED":
      newStatus = "APPROVED";
      break;
    case "REJECTED":
      newStatus = "REJECTED";
      break;
    case "ADDITIONAL_INFO_REQUIRED":
      newStatus = "ADDITIONAL_INFO_REQUIRED";
      break;
    case "PENDING_REVIEW":
      newStatus = "PENDING_REVIEW";
      break;
    default:
      redirect(`${USERS_PATH}?error=${encodeURIComponent("Invalid action.")}`);
  }

  // Get current application history
  const { data: currentProfile } = await supabase
    .from("TutorProfile")
    .select("applicationHistory")
    .eq("userId", userId)
    .single();

  const historyEntry = {
    action,
    timestamp: now,
    status: newStatus,
    adminNotes,
    additionalInfoRequired: additionalInfo,
  };

  const { error } = await supabase
    .from("TutorProfile")
    .update({
      applicationStatus: newStatus,
      adminNotes: adminNotes,
      applicationHistory: [...(currentProfile?.applicationHistory || []), historyEntry],
      updatedAt: now,
    })
    .eq("userId", userId);

  if (error) {
    redirect(`${USERS_PATH}?error=${encodeURIComponent(sanitizeError(error.message))}`);
  }

  // Grant welcome credits when tutor is approved
  if (action === "APPROVED") {
    await grantWelcomeCredits(userId, supabase);
  }

  revalidatePath(USERS_PATH);
  revalidatePath(redirectTo);
  const label = newStatus.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  redirect(`${redirectTo}?message=${encodeURIComponent(`Application status set to ${label}.`)}`);
}
