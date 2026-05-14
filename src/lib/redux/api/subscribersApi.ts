import { baseApi } from "./baseApi";
import type { SubscriberRow } from "@/lib/types/supabase";

interface SubscribersResponse {
  data?: SubscriberRow[];
  total?: number;
  error?: string;
}

export interface PaginatedSubscribers {
  items: SubscriberRow[];
  total: number;
}

export const subscribersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribers: builder.query<PaginatedSubscribers, { page?: number; limit?: number } | void>({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 20;
        return `/subscribers?page=${page}&limit=${limit}`;
      },
      transformResponse: (res: SubscribersResponse) => ({
        items: res.data ?? [],
        total: res.total ?? 0,
      }),
      providesTags: ["Subscribers"],
    }),
  }),
});

export { type SubscriberRow, type PaginatedSubscribers };
export const { useGetSubscribersQuery } = subscribersApi;
