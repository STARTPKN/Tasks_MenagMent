import { AppError } from "../../utils/index.js";
import tasksRepository from "./tasks.repository.js";
import notificationsService from "../notifications/notifications.service.js";

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

  createTask: async (data, currentUser) => {
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

    const task = await tasksRepository.create(taskData);

    // สร้างแจ้งเตือนให้ team members ทุกคน
    if (currentUser && data.team && data.team.length > 0) {
      const recipientIds = data.team.filter((id) => id !== currentUser.id);
      await notificationsService.createTaskAssignedNotifications(
        task,
        recipientIds,
        currentUser.name
      );
    }

    return task;
  },

  updateTask: async (id, data, currentUser) => {
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

    const updatedTask = await tasksRepository.update(id, updateData);

    // ตรวจหา team members ใหม่ที่ถูกเพิ่มเข้ามา → แจ้งเตือน
    if (currentUser && data.team) {
      const oldTeamIds = task.team.map((m) => m.id);
      const newMembers = data.team.filter(
        (userId) => !oldTeamIds.includes(userId) && userId !== currentUser.id
      );
      if (newMembers.length > 0) {
        await notificationsService.createTaskAssignedNotifications(
          updatedTask,
          newMembers,
          currentUser.name
        );
      }
    }

    return updatedTask;
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

  updateSubTask: async (subTaskId, data) => {
    const subTask = await tasksRepository.findSubTaskById(subTaskId);
    if (!subTask) {
      throw new AppError("Sub-task not found", 404);
    }

    const subTaskData = {
      title: data.title,
      tag: data.tag,
    };

    if (data.date) {
      subTaskData.date = new Date(data.date);
    }

    return tasksRepository.updateSubTask(subTaskId, subTaskData);
  },

  deleteSubTask: async (subTaskId) => {
    const subTask = await tasksRepository.findSubTaskById(subTaskId);
    if (!subTask) {
      throw new AppError("Sub-task not found", 404);
    }

    return tasksRepository.deleteSubTask(subTaskId);
  },

  createActivity: async (taskId, userId, data, currentUser) => {
    const task = await tasksRepository.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const activity = await tasksRepository.createActivity(taskId, userId, {
      type: data.type,
      activity: data.activity,
    });

    // สร้างแจ้งเตือนให้ team members ทุกคน ยกเว้นผู้สร้าง activity
    if (currentUser) {
      await notificationsService.createActivityNotifications(
        task,
        activity,
        currentUser.id,
        currentUser.name
      );
    }

    return activity;
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
      priorities: stats.priorities,
      last10Task: recentTasks.slice(0, 10),
    };
  },
};

export default tasksService;

