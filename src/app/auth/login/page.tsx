import Image from "next/image";
import { signIn, signUp } from "@/app/auth/actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center py-5 px-3">
      <div className="container" style={{ maxWidth: 980 }}>
        <div className="row g-0 shadow rounded-4 overflow-hidden bg-white">
          <div className="col-lg-6 p-5">
            <h1 className="h3 fw-bold mb-3">Tutorbay Admin</h1>

            {params.message ? (
              <div className="alert alert-success py-2" role="alert">
                {params.message}
              </div>
            ) : null}

            {params.error ? (
              <div className="alert alert-danger py-2" role="alert">
                {params.error}
              </div>
            ) : null}

            <form action={signIn} className="d-grid gap-3 mb-3">
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="form-control form-control-lg"
              />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="form-control form-control-lg"
              />
              <button type="submit" className="btn btn-primary btn-lg">
                Sign in
              </button>
              <button
                type="submit"
                formAction={signUp}
                className="btn btn-outline-secondary w-100"
              >
                Create account with same credentials
              </button>
            </form>
          </div>

          <div
            className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center"
          >
            <div className="text-center p-5">
              <Image
                src="/tutorbay_-removebg-preview.png"
                alt="Tutorbay"
                width={180}
                height={50}
                priority
                style={{ width: "auto", height: "auto" }}
                className="mb-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
