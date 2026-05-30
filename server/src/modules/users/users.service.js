import bcrypt from "bcryptjs";
import { AppError } from "../../utils/index.js";
import usersRepository from "./users.repository.js";

export const usersService = {
  getAllUsers: async () => {
    return usersRepository.findAll();
  },

  getUserById: async (id) => {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  },

  createUser: async (data) => {
    const existingUser = await usersRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return usersRepository.create({
      ...data,
      password: hashedPassword,
    });
  },

  updateUser: async (id, data) => {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await usersRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AppError("Email already in use", 400);
      }
    }

    const { password, ...updateData } = data;
    return usersRepository.update(id, updateData);
  },

  deleteUser: async (id) => {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return usersRepository.delete(id);
  },

  toggleUserStatus: async (id) => {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return usersRepository.toggleStatus(id, !user.isActive);
  },
};

export default usersService;
