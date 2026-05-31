import { apiSlice } from "./apiSlice";

const POSITION_URL = "/positions";

export const positionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPositions: builder.query({
      query: () => ({
        url: `${POSITION_URL}`,
        method: "GET",
      }),
      providesTags: ["Position"],
    }),

    createPosition: builder.mutation({
      query: (data) => ({
        url: `${POSITION_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Position"],
    }),

    updatePosition: builder.mutation({
      query: (data) => ({
        url: `${POSITION_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Position"],
    }),

    deletePosition: builder.mutation({
      query: (id) => ({
        url: `${POSITION_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Position"],
    }),
  }),
});

export const {
  useGetPositionsQuery,
  useCreatePositionMutation,
  useUpdatePositionMutation,
  useDeletePositionMutation,
} = positionApiSlice;
