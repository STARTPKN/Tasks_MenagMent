import prisma from "../../config/prisma.js";

export const notificationsRepository = {
  findByUserId: async (userId) => {
    return prisma.notification.findMany({
      where: { userId },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            stage: true,
            priority: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  },

  create: async (data) => {
    return prisma.notification.create({
      data: {
        type: data.type,
        text: data.text,
        userId: data.userId,
        taskId: data.taskId,
      },
    });
  },

  createMany: async (dataArray) => {
    // Use a transaction to create multiple notifications
    return prisma.$transaction(
      dataArray.map((data) =>
        prisma.notification.create({
          data: {
            type: data.type,
            text: data.text,
            userId: data.userId,
            taskId: data.taskId,
          },
        })
      )
    );
  },

  markAsRead: async (id) => {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  markAllAsRead: async (userId) => {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  countUnread: async (userId) => {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  },
};

export default notificationsRepository;
