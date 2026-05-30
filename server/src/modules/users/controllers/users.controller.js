import usersService from "../users.service.js";
import { apiSuccess } from "../../../utils/index.js";

export const usersController = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await usersService.getAllUsers();
      apiSuccess(res, "Users fetched successfully", users);
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req, res, next) => {
    try {
      const user = await usersService.getUserById(req.params.id);
      apiSuccess(res, "User fetched successfully", user);
    } catch (error) {
      next(error);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const user = await usersService.createUser(req.body);
      apiSuccess(res, "User created successfully", user, 201);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const user = await usersService.updateUser(req.params.id, req.body);
      apiSuccess(res, "User updated successfully", user);
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      await usersService.deleteUser(req.params.id);
      apiSuccess(res, "User deleted successfully", null);
    } catch (error) {
      next(error);
    }
  },

  toggleUserStatus: async (req, res, next) => {
    try {
      const user = await usersService.toggleUserStatus(req.params.id);
      apiSuccess(res, "User status updated successfully", user);
    } catch (error) {
      next(error);
    }
  },
};

export default usersController;
