import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import UserDetailClient from "./UserDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function UserDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { error: errParam, message } = await searchParams;
  const supabase = createAdminClient();

  const { data: authData, error: authError } = await supabase.auth.admin.getUserById(id);
  if (authError || !authData?.user) notFound();
  const user = authData.user;

  const { data: tutorProfile } = await supabase
    .from("TutorProfile")
    .select("*")
    .eq("userId", id)
    .single();

  const { data: userRecord } = await supabase
    .from("User")
    .select("fullName")
    .eq("id", id)
    .single();

  // Fetch wallet + transactions
  const { data: wallet } = await supabase
    .from("TutorWallet")
    .select("id, balance")
    .eq("tutorId", id)
    .single();

  const { data: transactions } = wallet
    ? await supabase
        .from("WalletTransaction")
        .select("*")
        .eq("walletId", wallet.id)
        .order("createdAt", { ascending: false })
    : { data: [] };

  const userData = {
    id: user.id,
    email: user.email ?? "(no email)",
    phone: user.phone ?? null,
    role: (user.user_metadata?.role as string) || "student",
    fullName: userRecord?.fullName ?? null,
    createdAt: formatDate(user.created_at),
    lastSignIn: formatDate(user.last_sign_in_at),
    isBanned: !!user.banned_until && new Date(user.banned_until) > new Date(),
  };

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h2 className="fw-semibold mb-4">User Profile</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/dashboard" className="text-secondary-light fw-normal">Dashboard</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/users" className="text-secondary-light fw-normal">Users</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {userData.email}
              </li>
            </ol>
          </nav>
        </div>
        <a href="/users" className="btn btn-outline-secondary">
          <i className="ri-arrow-left-line me-2" />Back
        </a>
      </div>

      {message && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
          <i className="ri-checkbox-circle-line text-xl" />
          {message}
        </div>
      )}
      {errParam && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-12 px-16 mb-20 radius-8" role="alert">
          <i className="ri-error-warning-line text-xl" />
          {errParam}
        </div>
      )}

      <UserDetailClient
        user={userData}
        tutorProfile={tutorProfile}
        wallet={wallet ? { balance: wallet.balance } : null}
        transactions={transactions ?? []}
      />
    </>
  );
}
