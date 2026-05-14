import { baseApi } from "./baseApi";

export interface UserRow {
  id: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  lastSignIn: string;
  isBanned: boolean;
  tutorApplicationStatus: string | null;
  tutorAdminNotes: string | null;
}

interface UsersResponse {
  data?: UserRow[];
  total?: number;
  error?: string;
}

export interface PaginatedUsers {
  items: UserRow[];
  total: number;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedUsers, { page?: number; limit?: number } | void>({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 20;
        return `/users?page=${page}&limit=${limit}`;
      },
      transformResponse: (res: UsersResponse) => ({
        items: res.data ?? [],
        total: res.total ?? 0,
      }),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
