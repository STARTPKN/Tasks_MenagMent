import { AppError } from "../../utils/index.js";
import tasksRepository from "./tasks.repository.js";

export const tasksService = {
  getAllTasks: async (stage) => {
    const filter = { isTrashed: false };
    if (stage) {
      filter.stage = stage.toUpperCase().replace(" ", "_");
    }
    return tasksRepository.findAll(filter);
  },

  getTaskById: async (id) => {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    return task;
  },

  createTask: async (data) => {
    const taskData = {
      title: data.title,
      priority: data.priority || "NORMAL",
      stage: data.stage || "TODO",
      team: data.team || [],
      assets: data.assets || [],
    };

    if (data.date) {
      taskData.date = new Date(data.date);
    }

    return tasksRepository.create(taskData);
  },

  updateTask: async (id, data) => {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const updateData = {};
    if (data.title) updateData.title = data.title;
    if (data.priority) updateData.priority = data.priority;
    if (data.stage) updateData.stage = data.stage;
    if (data.date) updateData.date = new Date(data.date);
    if (data.team) updateData.team = data.team;
    if (data.assets) updateData.assets = data.assets;

    return tasksRepository.update(id, updateData);
  },

  trashTask: async (id) => {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    return tasksRepository.trash(id);
  },

  restoreTask: async (id) => {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    return tasksRepository.restore(id);
  },

  deleteTask: async (id) => {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    return tasksRepository.delete(id);
  },

  restoreAllTasks: async () => {
    return tasksRepository.restoreAll();
  },

  deleteAllTrashed: async () => {
    return tasksRepository.deleteAllTrashed();
  },

  getTrashedTasks: async () => {
    return tasksRepository.findAll({ isTrashed: true });
  },

  createSubTask: async (taskId, data) => {
    const task = await tasksRepository.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const subTaskData = {
      title: data.title,
      tag: data.tag,
    };

    if (data.date) {
      subTaskData.date = new Date(data.date);
    }

    return tasksRepository.createSubTask(taskId, subTaskData);
  },

  createActivity: async (taskId, userId, data) => {
    const task = await tasksRepository.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return tasksRepository.createActivity(taskId, userId, {
      type: data.type,
      activity: data.activity,
    });
  },

  getDashboard: async () => {
    const stats = await tasksRepository.getTaskStats();
    const recentTasks = await tasksRepository.findAll({ isTrashed: false });

    return {
      totalTasks: stats.total,
      tasks: {
        todo: stats.todo,
        "in progress": stats.inProgress,
        completed: stats.completed,
      },
      last10Task: recentTasks.slice(0, 10),
    };
  },
};

export default tasksService;
