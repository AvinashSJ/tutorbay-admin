import { createMockSupabase } from "./_shared";

const mockSupabase = createMockSupabase();

export async function createClient() {
  return mockSupabase;
}

export { mockSupabase };
