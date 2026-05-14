const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();
const mockSignOut = jest.fn();

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
    },
  }),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn((url) => {
    throw new Error(url);
  }),
  revalidatePath: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("signIn", () => {
  it("redirects to /dashboard on success", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });

    const { signIn } = await import("../actions");
    const fd = new FormData();
    fd.set("email", "admin@tutorbay.com");
    fd.set("password", "correct-password");

    await expect(signIn(fd)).rejects.toThrow("/dashboard");
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "admin@tutorbay.com",
      password: "correct-password",
    });
  });

  it("sanitizes error messages", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });

    const { signIn } = await import("../actions");
    const fd = new FormData();
    fd.set("email", "bad@test.com");
    fd.set("password", "wrong");

    await expect(signIn(fd)).rejects.toThrow("/auth/login?error=Invalid%20email%20or%20password.");
  });
});

describe("signUp", () => {
  it("redirects to login on success", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });

    const { signUp } = await import("../actions");
    const fd = new FormData();
    fd.set("email", "new@test.com");
    fd.set("password", "pass123");

    await expect(signUp(fd)).rejects.toThrow();
    expect(mockSignUp).toHaveBeenCalledWith({
      email: "new@test.com",
      password: "pass123",
    });
  });
});

describe("signOut", () => {
  it("signs out and redirects", async () => {
    mockSignOut.mockResolvedValue({ error: null });

    const { signOut } = await import("../actions");

    await expect(signOut()).rejects.toThrow();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
