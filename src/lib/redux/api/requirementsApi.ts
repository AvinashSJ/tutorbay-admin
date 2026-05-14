import { baseApi } from "./baseApi";

export interface RequirementRow {
  id: string;
  title: string;
  subject: string;
  area: string;
  status: string;
  tuitionType: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  curriculum: string;
  grade: string;
  locationUrl: string | null;
  modeOfTeaching: string | null;
  expectedFeePerHour: number | null;
  availability: unknown;
  notes: string | null;
  ownerId: string | null;
  ownerEmail: string | null;
  ownerName: string | null;
  matchCount: number;
}

interface RequirementsResponse {
  data?: RequirementRow[];
  total?: number;
  error?: string;
}

export interface PaginatedRequirements {
  items: RequirementRow[];
  total: number;
}

export const requirementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequirements: builder.query<PaginatedRequirements, { page?: number; limit?: number } | void>({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit ?? 20;
        return `/requirements?page=${page}&limit=${limit}`;
      },
      transformResponse: (res: RequirementsResponse) => ({
        items: res.data ?? [],
        total: res.total ?? 0,
      }),
      providesTags: ["Requirements"],
    }),
  }),
});

export const { useGetRequirementsQuery } = requirementsApi;
