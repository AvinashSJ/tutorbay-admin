import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/admin" }),
  tagTypes: [
    "Users",
    "Payments",
    "Matches",
    "Requirements",
    "Subscribers",
    "Dashboard",
  ],
  endpoints: () => ({}),
});
