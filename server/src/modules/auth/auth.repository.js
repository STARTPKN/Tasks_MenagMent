import prisma from "../../config/prisma.js";

export const authRepository = {
  findByEmail: async (email) => {
    return prisma.user.findUnique({ where: { email } });
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

  updatePassword: async (id, hashedPassword) => {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  updateProfile: async (id, data) => {
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
};

export default authRepository;
