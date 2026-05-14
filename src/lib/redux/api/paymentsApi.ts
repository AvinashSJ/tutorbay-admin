import { baseApi } from "./baseApi";
import type { PaymentRow } from "@/lib/types/supabase";

interface PaymentsResponse {
  data?: PaymentRow[];
  total?: number;
  error?: string;
}

export interface PaginatedPayments {
  items: PaymentRow[];
  total: number;
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaginatedPayments, { page?: number; limit?: number } | void>({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 20;
        return `/payments?page=${page}&limit=${limit}`;
      },
      transformResponse: (res: PaymentsResponse) => ({
        items: res.data ?? [],
        total: res.total ?? 0,
      }),
      providesTags: ["Payments"],
    }),
  }),
});

export { type PaymentRow };
export const { useGetPaymentsQuery } = paymentsApi;
