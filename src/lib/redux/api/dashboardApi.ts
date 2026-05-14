import { baseApi } from "./baseApi";
import type { PipelineStats } from "@/lib/types/supabase";

export interface DashboardData {
  pipelineStats: PipelineStats | null;
  totalUsers: number;
  recentSignUps: number;
}

interface DashboardResponse {
  data?: DashboardData;
  error?: string;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardData, void>({
      query: () => "/dashboard",
      transformResponse: (res: DashboardResponse) =>
        res.data ?? { pipelineStats: null, totalUsers: 0, recentSignUps: 0 },
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
