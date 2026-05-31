import tasksService from "../tasks.service.js";
import { apiSuccess } from "../../../utils/index.js";

export const tasksController = {
  getAllTasks: async (req, res, next) => {
    try {
      const { stage } = req.query;
      const tasks = await tasksService.getAllTasks(stage);
      apiSuccess(res, "Tasks fetched successfully", tasks);
    } catch (error) {
      next(error);
    }
  },

  getTaskById: async (req, res, next) => {
    try {
      const task = await tasksService.getTaskById(req.params.id);
      apiSuccess(res, "Task fetched successfully", task);
    } catch (error) {
      next(error);
    }
  },

  createTask: async (req, res, next) => {
    try {
      const task = await tasksService.createTask(req.body, req.user);
      apiSuccess(res, "Task created successfully", task, 201);
    } catch (error) {
      next(error);
    }
  },

  updateTask: async (req, res, next) => {
    try {
      const task = await tasksService.updateTask(req.params.id, req.body, req.user);
      apiSuccess(res, "Task updated successfully", task);
    } catch (error) {
      next(error);
    }
  },

  trashTask: async (req, res, next) => {
    try {
      await tasksService.trashTask(req.params.id, req.user);
      apiSuccess(res, "Task moved to trash successfully", null);
    } catch (error) {
      next(error);
    }
  },

  restoreTask: async (req, res, next) => {
    try {
      await tasksService.restoreTask(req.params.id);
      apiSuccess(res, "Task restored successfully", null);
    } catch (error) {
      next(error);
    }
  },

  deleteTask: async (req, res, next) => {
    try {
      await tasksService.deleteTask(req.params.id);
      apiSuccess(res, "Task permanently deleted", null);
    } catch (error) {
      next(error);
    }
  },

  restoreAllTasks: async (req, res, next) => {
    try {
      await tasksService.restoreAllTasks();
      apiSuccess(res, "All tasks restored successfully", null);
    } catch (error) {
      next(error);
    }
  },

  deleteAllTrashed: async (req, res, next) => {
    try {
      await tasksService.deleteAllTrashed();
      apiSuccess(res, "All trashed tasks permanently deleted", null);
    } catch (error) {
      next(error);
    }
  },

  getTrashedTasks: async (req, res, next) => {
    try {
      const tasks = await tasksService.getTrashedTasks();
      apiSuccess(res, "Trashed tasks fetched successfully", tasks);
    } catch (error) {
      next(error);
    }
  },

  createSubTask: async (req, res, next) => {
    try {
      const subTask = await tasksService.createSubTask(req.params.id, req.body);
      apiSuccess(res, "Sub-task created successfully", subTask, 201);
    } catch (error) {
      next(error);
    }
  },

  updateSubTask: async (req, res, next) => {
    try {
      const subTask = await tasksService.updateSubTask(req.params.subTaskId, req.body);
      apiSuccess(res, "Sub-task updated successfully", subTask);
    } catch (error) {
      next(error);
    }
  },

  deleteSubTask: async (req, res, next) => {
    try {
      await tasksService.deleteSubTask(req.params.subTaskId);
      apiSuccess(res, "Sub-task deleted successfully", null);
    } catch (error) {
      next(error);
    }
  },


  createActivity: async (req, res, next) => {
    try {
      const activity = await tasksService.createActivity(
        req.params.id,
        req.user.id,
        req.body,
        req.user
      );
      apiSuccess(res, "Activity posted successfully", activity, 201);
    } catch (error) {
      next(error);
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const dashboard = await tasksService.getDashboard();
      apiSuccess(res, "Dashboard data fetched successfully", dashboard);
    } catch (error) {
      next(error);
    }
  },
};

export default tasksController;
