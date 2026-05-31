import { Router } from "express";
import settingsController from "../controllers/settings.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { isAdmin } from "../../../middleware/admin.middleware.js";

const router = Router();

// GET is public so client can fetch appName and allowUserRegistration
router.get("/", settingsController.getSettings);

// PUT is restricted to ADMIN
router.put("/", protect, isAdmin, settingsController.updateSettings);

export default router;
