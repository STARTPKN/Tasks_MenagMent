import prisma from "../../config/prisma.js";

export const usersRepository = {
  findAll: async () => {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        title: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: async (id) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        title: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findByEmail: async (email) => {
    return prisma.user.findUnique({ where: { email } });
  },

  create: async (data) => {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        title: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  update: async (id, data) => {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        title: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  delete: async (id) => {
    return prisma.user.delete({ where: { id } });
  },

  toggleStatus: async (id, isActive) => {
    return prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        title: true,
        isActive: true,
      },
    });
  },
};

export default usersRepository;
