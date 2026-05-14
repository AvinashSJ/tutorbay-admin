import { baseApi } from "./baseApi";
import type { PipelineStats, MatchRow } from "@/lib/types/supabase";

interface MatchesResponse {
  data?: {
    stats: PipelineStats | null;
    matches: MatchRow[];
    total: number;
  };
  error?: string;
}

export interface PaginatedMatches {
  stats: PipelineStats | null;
  matches: MatchRow[];
  total: number;
}

export const matchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMatches: builder.query<PaginatedMatches, { page?: number; limit?: number } | void>({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 20;
        return `/matches?page=${page}&limit=${limit}`;
      },
      transformResponse: (res: MatchesResponse) =>
        res.data ?? { stats: null, matches: [], total: 0 },
      providesTags: ["Matches"],
    }),
  }),
});

export { type PipelineStats, type MatchRow };
export const { useGetMatchesQuery } = matchesApi;
