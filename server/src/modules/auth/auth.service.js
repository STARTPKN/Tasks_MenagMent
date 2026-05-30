import bcrypt from "bcryptjs";
import { generateToken, AppError } from "../../utils/index.js";
import authRepository from "./auth.repository.js";

export const authService = {
  login: async (email, password) => {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("Account is disabled. Contact your administrator", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user.id);

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  getProfile: async (userId) => {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    const user = await authRepository.findByEmail(
      (await authRepository.findById(userId)).email
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError("Current password is incorrect", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await authRepository.updatePassword(userId, hashedPassword);
  },

  updateProfile: async (userId, data) => {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const allowedFields = { name: data.name, title: data.title };
    // Filter out undefined values
    const updateData = Object.fromEntries(
      Object.entries(allowedFields).filter(([_, v]) => v !== undefined)
    );

    return authRepository.updateProfile(userId, updateData);
  },
};

export default authService;
