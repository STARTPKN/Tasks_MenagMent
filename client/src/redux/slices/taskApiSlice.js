import { apiSlice } from "./apiSlice";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (params) => ({
        url: "/tasks",
        method: "GET",
        params,
      }),
      providesTags: ["Tasks"],
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: "/tasks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: "/tasks/dashboard",
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),
    getTrashedTasks: builder.query({
      query: () => ({
        url: "/tasks/trashed",
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),
    trashTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}/trash`,
        method: "PATCH",
      }),
      invalidatesTags: ["Tasks"],
    }),
    restoreTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: ["Tasks"],
    }),
    restoreAllTasks: builder.mutation({
      query: () => ({
        url: "/tasks/restore-all",
        method: "POST",
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteAllTrashed: builder.mutation({
      query: () => ({
        url: "/tasks/trash/delete-all",
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    // New endpoint: add sub‑task to a task
    addSubTask: builder.mutation({
      // `arg` should be an object like { id: taskId, data: subTaskData }
      query: ({ id, data }) => ({
        url: `/tasks/${id}/subtasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
    postTaskActivity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tasks/${id}/activities`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateSubTask: builder.mutation({
      query: ({ subTaskId, data }) => ({
        url: `/tasks/subtasks/${subTaskId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteSubTask: builder.mutation({
      query: (subTaskId) => ({
        url: `/tasks/subtasks/${subTaskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskActivity: builder.mutation({
      query: ({ activityId, data }) => ({
        url: `/tasks/activities/${activityId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTaskActivity: builder.mutation({
      query: (activityId) => ({
        url: `/tasks/activities/${activityId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetDashboardStatsQuery,
  useAddSubTaskMutation,
  usePostTaskActivityMutation,
  useUpdateSubTaskMutation,
  useDeleteSubTaskMutation,
  useGetTrashedTasksQuery,
  useTrashTaskMutation,
  useRestoreTaskMutation,
  useRestoreAllTasksMutation,
  useDeleteAllTrashedMutation,
  useUpdateTaskActivityMutation,
  useDeleteTaskActivityMutation,
} = taskApiSlice;

