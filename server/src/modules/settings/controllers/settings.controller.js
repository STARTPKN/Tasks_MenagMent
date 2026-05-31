import settingsService from "../settings.service.js";
import { apiSuccess } from "../../../utils/index.js";

export const settingsController = {
  getSettings: async (req, res, next) => {
    try {
      const settings = await settingsService.getAllSettings();
      apiSuccess(res, "Settings fetched successfully", settings);
    } catch (error) {
      next(error);
    }
  },

  updateSettings: async (req, res, next) => {
    try {
      const updatedSettings = await settingsService.updateSettings(req.body);
      apiSuccess(res, "Settings updated successfully", updatedSettings);
    } catch (error) {
      next(error);
    }
  },
};

export default settingsController;
