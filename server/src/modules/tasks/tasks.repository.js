import prisma from "../../config/prisma.js";

export const tasksRepository = {
  findAll: async (filter = {}) => {
    return prisma.task.findMany({
      where: filter,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            email: true,
            title: true,
            role: true,
          },
        },
        subTasks: true,
        activities: {
          include: {
            by: {
              select: { id: true, name: true },
            },
          },
          orderBy: { date: "desc" },
        },
        assets: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: async (id) => {
    return prisma.task.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            email: true,
            title: true,
            role: true,
          },
        },
        subTasks: true,
        activities: {
          include: {
            by: {
              select: { id: true, name: true },
            },
          },
          orderBy: { date: "desc" },
        },
        assets: true,
      },
    });
  },

  create: async (data) => {
    const { team, assets, ...taskData } = data;

    return prisma.task.create({
      data: {
        ...taskData,
        team: {
          connect: team?.map((userId) => ({ id: userId })) || [],
        },
        assets: {
          create: assets?.map((url) => ({ url })) || [],
        },
      },
      include: {
        team: {
          select: { id: true, name: true, email: true, title: true },
        },
        subTasks: true,
        assets: true,
      },
    });
  },

  update: async (id, data) => {
    const { team, assets, ...updateData } = data;

    const updatePayload = { ...updateData };

    if (team) {
      updatePayload.team = {
        set: team.map((userId) => ({ id: userId })),
      };
    }

    if (assets) {
      updatePayload.assets = {
        create: assets.map((url) => ({ url })),
      };
    }

    return prisma.task.update({
      where: { id },
      data: updatePayload,
      include: {
        team: {
          select: { id: true, name: true, email: true, title: true },
        },
        subTasks: true,
        assets: true,
      },
    });
  },

  trash: async (id) => {
    return prisma.task.update({
      where: { id },
      data: { isTrashed: true },
    });
  },

  restore: async (id) => {
    return prisma.task.update({
      where: { id },
      data: { isTrashed: false },
    });
  },

  delete: async (id) => {
    return prisma.task.delete({ where: { id } });
  },

  restoreAll: async () => {
    return prisma.task.updateMany({
      where: { isTrashed: true },
      data: { isTrashed: false },
    });
  },

  deleteAllTrashed: async () => {
    return prisma.task.deleteMany({
      where: { isTrashed: true },
    });
  },

  // Sub-tasks
  createSubTask: async (taskId, data) => {
    return prisma.subTask.create({
      data: {
        ...data,
        taskId,
      },
    });
  },

  findSubTaskById: async (id) => {
    return prisma.subTask.findUnique({
      where: { id },
    });
  },

  updateSubTask: async (id, data) => {
    return prisma.subTask.update({
      where: { id },
      data,
    });
  },

  deleteSubTask: async (id) => {
    return prisma.subTask.delete({
      where: { id },
    });
  },

  // Activities
  createActivity: async (taskId, userId, data) => {
    return prisma.activity.create({
      data: {
        ...data,
        taskId,
        byUserId: userId,
      },
      include: {
        by: {
          select: { id: true, name: true },
        },
      },
    });
  },

  // Dashboard stats
  getTaskStats: async () => {
    const [total, todo, inProgress, completed] = await Promise.all([
      prisma.task.count({ where: { isTrashed: false } }),
      prisma.task.count({ where: { stage: "TODO", isTrashed: false } }),
      prisma.task.count({ where: { stage: "IN_PROGRESS", isTrashed: false } }),
      prisma.task.count({ where: { stage: "COMPLETED", isTrashed: false } }),
    ]);

    return { total, todo, inProgress, completed };
  },
};

export default tasksRepository;
