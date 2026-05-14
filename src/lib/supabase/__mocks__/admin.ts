import { createMockSupabase } from "./_shared";

const mockSupabase = createMockSupabase();

export function createAdminClient() {
  return mockSupabase;
}

export { mockSupabase };
