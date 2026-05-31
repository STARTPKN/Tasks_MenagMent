import { Router } from "express";
import notificationsController from "../controllers/notifications.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = Router();

// All notification routes require authentication
router.use(protect);

// GET /api/notifications — ดึงแจ้งเตือนของ user ที่ login
router.get("/", notificationsController.getNotifications);

// PATCH /api/notifications/read-all — mark ทั้งหมดเป็นอ่านแล้ว
router.patch("/read-all", notificationsController.markAllAsRead);

// PATCH /api/notifications/:id/read — mark แจ้งเตือนเดี่ยวเป็นอ่านแล้ว
router.patch("/:id/read", notificationsController.markAsRead);

export default router;
