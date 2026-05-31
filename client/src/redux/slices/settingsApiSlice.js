import { apiSlice } from "./apiSlice";

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: "/settings",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApiSlice;
