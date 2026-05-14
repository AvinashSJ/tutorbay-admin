export const mockSupabase = {
  auth: {
    admin: {
      listUsers: jest.fn(),
      inviteUserByEmail: jest.fn(),
      updateUserById: jest.fn(),
      deleteUser: jest.fn(),
    },
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    then: jest.fn(),
  })),
  rpc: jest.fn(),
};

export function createAdminClient() {
  return mockSupabase;
}

export function createClient() {
  return mockSupabase;
}
