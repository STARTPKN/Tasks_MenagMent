import notificationsService from "../notifications.service.js";
import { apiSuccess } from "../../../utils/index.js";

export const notificationsController = {
  getNotifications: async (req, res, next) => {
    try {
      const notifications = await notificationsService.getNotifications(req.user.id);
      apiSuccess(res, "Notifications fetched successfully", notifications);
    } catch (error) {
      next(error);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      await notificationsService.markAsRead(req.params.id);
      apiSuccess(res, "Notification marked as read", null);
    } catch (error) {
      next(error);
    }
  },

  markAllAsRead: async (req, res, next) => {
    try {
      await notificationsService.markAllAsRead(req.user.id);
      apiSuccess(res, "All notifications marked as read", null);
    } catch (error) {
      next(error);
    }
  },
};

export default notificationsController;
