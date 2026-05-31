import authService from "../auth.service.js";
import { apiSuccess } from "../../../utils/index.js";

export const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      apiSuccess(res, "Login successful", result);
    } catch (error) {
      next(error);
    }
  },

  register: async (req, res, next) => {
    try {
      const { name, email, password, title } = req.body;
      const result = await authService.register(name, email, password, title);
      apiSuccess(res, "Registration successful", result, 201);
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const user = await authService.getProfile(req.user.id);
      apiSuccess(res, "Profile fetched successfully", user);
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, currentPassword, newPassword);
      apiSuccess(res, "Password changed successfully", null);
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);
      apiSuccess(res, "Profile updated successfully", user);
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
