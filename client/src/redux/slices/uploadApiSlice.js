import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "http://localhost:8800/api";

export const uploadApiSlice = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.user?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    /**
     * Upload single file
     */
    uploadFile: builder.mutation({
      queryFn: async (
        { file, folder = "task-manager/files" },
        _queryApi,
        _extraOptions,
        fetchWithBQ,
      ) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);

          const response = await fetch(`${API_URL}/upload/file`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${_queryApi.getState().auth?.user?.token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();
          return { data: data.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: error.message,
            },
          };
        }
      },
    }),

    /**
     * Upload multiple files
     */
    uploadMultipleFiles: builder.mutation({
      queryFn: async (
        { files, folder = "task-manager/files" },
        _queryApi,
        _extraOptions,
        fetchWithBQ,
      ) => {
        try {
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("files", file);
          });
          formData.append("folder", folder);

          const response = await fetch(`${API_URL}/upload/files`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${_queryApi.getState().auth?.user?.token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();
          return { data: data.data };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: error.message,
            },
          };
        }
      },
    }),

    /**
     * Delete file
     */
    deleteFile: builder.mutation({
      query: ({ publicId }) => ({
        url: "/upload/delete",
        method: "DELETE",
        body: { publicId },
      }),
    }),
  }),
});

export const {
  useUploadFileMutation,
  useUploadMultipleFilesMutation,
  useDeleteFileMutation,
} = uploadApiSlice;
