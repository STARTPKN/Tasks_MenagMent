import prisma from "../../config/prisma.js";
import { AppError } from "../../utils/index.js";

const DEFAULT_SETTINGS = {
  appName: "TaskMe",
  allowUserRegistration: "true",
  allowUsersCreateTasks: "true",
  allowUsersEditTasks: "true",
  allowUsersDeleteTasks: "true",
  maxSubTasks: "5",
  enableFileUpload: "true",
  defaultUserRole: "USER",
  defaultUserTitle: "Member",
};

export const settingsService = {
  // Get a single setting value (with default fallback & auto-seeding)
  getSetting: async (key) => {
    let setting = await prisma.systemSetting.findUnique({
      where: { key },
    });

    if (!setting) {
      const defaultValue = DEFAULT_SETTINGS[key];
      if (defaultValue === undefined) {
        throw new AppError(`Setting key ${key} is invalid`, 400);
      }
      
      // Auto-create in database if missing
      try {
        setting = await prisma.systemSetting.create({
          data: { key, value: defaultValue },
        });
      } catch (err) {
        // Fallback in case of unique constraint or DB issues during concurrent requests
        return defaultValue;
      }
    }

    return setting.value;
  },

  // Get all settings merged with defaults
  getAllSettings: async () => {
    try {
      const settings = await prisma.systemSetting.findMany();
      const result = { ...DEFAULT_SETTINGS };

      for (const setting of settings) {
        result[setting.key] = setting.value;
      }

      return result;
    } catch (err) {
      // Fallback in case table doesn't exist yet or connection issue
      return DEFAULT_SETTINGS;
    }
  },

  // Update settings in database
  updateSettings: async (settingsData) => {
    const keys = Object.keys(settingsData);

    for (const key of keys) {
      if (DEFAULT_SETTINGS[key] === undefined) {
        throw new AppError(`Setting key ${key} is invalid`, 400);
      }

      const value = String(settingsData[key]);

      await prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    return settingsService.getAllSettings();
  },
};

export default settingsService;
