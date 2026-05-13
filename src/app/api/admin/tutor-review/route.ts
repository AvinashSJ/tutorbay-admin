import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function sanitizeError(msg: string): string {
  if (msg.toLowerCase().includes("not found")) return "User not found.";
  if (msg.toLowerCase().includes("already registered")) return "A user with that email already exists.";
  if (msg.toLowerCase().includes("invalid")) return "Invalid input provided.";
  return "An error occurred. Please try again.";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const userId = String(formData.get("userId") ?? "").trim();
  const action = String(formData.get("action") ?? "").trim();
  const adminNotes = String(formData.get("adminNotes") ?? "").trim() || null;
  const additionalInfo = String(formData.get("additionalInfo") ?? "").trim() || null;

  if (!userId || !action) {
    return NextResponse.redirect(
      new URL("/users?error=Invalid application or action.", request.url)
    );
  }

  const allowedActions = ["APPROVED", "REJECTED", "ADDITIONAL_INFO_REQUIRED", "PENDING_REVIEW"];
  if (!allowedActions.includes(action)) {
    return NextResponse.redirect(
      new URL("/users?error=Invalid action.", request.url)
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.redirect(
      new URL("/users?error=Server configuration error.", request.url)
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const now = new Date().toISOString();

  const { data: currentProfile } = await supabase
    .from("TutorProfile")
    .select("applicationHistory")
    .eq("userId", userId)
    .single();

  const historyEntry = {
    action,
    timestamp: now,
    status: action,
    adminNotes,
    additionalInfoRequired: additionalInfo,
  };

  const { error } = await supabase
    .from("TutorProfile")
    .update({
      applicationStatus: action,
      adminNotes,
      applicationHistory: [...(currentProfile?.applicationHistory || []), historyEntry],
      updatedAt: now,
    })
    .eq("userId", userId);

  if (error) {
    return NextResponse.redirect(
      new URL(`/users?error=${encodeURIComponent(sanitizeError(error.message))}`, request.url)
    );
  }

  if (action === "APPROVED") {
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

  return NextResponse.redirect(
    new URL(`/users?message=${encodeURIComponent(`Application ${action.toLowerCase()}d successfully.`)}`, request.url)
  );
}
