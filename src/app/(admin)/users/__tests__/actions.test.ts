const mockInviteUser = jest.fn();
const mockUpdateUser = jest.fn();
const mockDeleteUser = jest.fn();

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(() => ({
    auth: {
      admin: {
        inviteUserByEmail: mockInviteUser,
        updateUserById: mockUpdateUser,
        deleteUser: mockDeleteUser,
      },
    },
    from: jest.fn(() => {
      const chain: Record<string, jest.Mock> = {
        select: jest.fn(() => chain),
        insert: jest.fn(() => chain),
        update: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      };
      return chain;
    }),
    rpc: jest.fn(),
  })),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("inviteUser", () => {
  it("rejects invalid email", async () => {
    const { inviteUser } = await import("../actions");
    const fd = new FormData();
    fd.set("email", "not-an-email");

    await expect(inviteUser(fd)).rejects.toThrow("/users?error=");
  });

  it("calls supabase admin invite on valid email", async () => {
    mockInviteUser.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });

    const { inviteUser } = await import("../actions");
    const fd = new FormData();
    fd.set("email", "newuser@test.com");

    await expect(inviteUser(fd)).rejects.toThrow("/users?message=");
    expect(mockInviteUser).toHaveBeenCalledWith("newuser@test.com");
  });
});

describe("updateUserRole", () => {
  it("rejects invalid role", async () => {
    const { updateUserRole } = await import("../actions");
    const fd = new FormData();
    fd.set("userId", "u1");
    fd.set("role", "SUPERADMIN");

    await expect(updateUserRole(fd)).rejects.toThrow("/users?error=");
  });

  it("updates user metadata for valid role", async () => {
    mockUpdateUser.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });

    const { updateUserRole } = await import("../actions");
    const fd = new FormData();
    fd.set("userId", "u1");
    fd.set("role", "ADMIN");

    await expect(updateUserRole(fd)).rejects.toThrow("/users?message=");
    expect(mockUpdateUser).toHaveBeenCalledWith("u1", {
      user_metadata: { role: "ADMIN" },
    });
  });
});

describe("toggleBanUser", () => {
  it("bans a user", async () => {
    mockUpdateUser.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });

    const { toggleBanUser } = await import("../actions");
    const fd = new FormData();
    fd.set("userId", "u1");
    fd.set("isBanned", "false");

    await expect(toggleBanUser(fd)).rejects.toThrow();
    expect(mockUpdateUser).toHaveBeenCalledWith("u1", {
      ban_duration: "876600h",
    });
  });

  it("unbans a user", async () => {
    mockUpdateUser.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });

    const { toggleBanUser } = await import("../actions");
    const fd = new FormData();
    fd.set("userId", "u1");
    fd.set("isBanned", "true");

    await expect(toggleBanUser(fd)).rejects.toThrow();
    expect(mockUpdateUser).toHaveBeenCalledWith("u1", {
      ban_duration: "none",
    });
  });
});

describe("deleteUser", () => {
  it("deletes user via admin API", async () => {
    mockDeleteUser.mockResolvedValue({
      data: { user: { id: "u1" } },
      error: null,
    });

    const { deleteUser } = await import("../actions");
    const fd = new FormData();
    fd.set("userId", "u1");

    await expect(deleteUser(fd)).rejects.toThrow("/users?message=");
    expect(mockDeleteUser).toHaveBeenCalledWith("u1");
  });
});

describe("reviewTutorApplication", () => {
  it("rejects invalid action", async () => {
    const { reviewTutorApplication } = await import("../actions");
    const fd = new FormData();
    fd.set("userId", "tutor-1");
    fd.set("action", "INVALID");

    await expect(reviewTutorApplication(fd)).rejects.toThrow("/users?error=");
  });
});
