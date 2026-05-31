import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import usersRoutes from "../modules/users/routes/users.routes.js";
import tasksRoutes from "../modules/tasks/routes/tasks.routes.js";
import uploadRoutes from "../modules/upload/upload.routes.js";
import notificationRoutes from "../modules/notifications/routes/notifications.routes.js";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Module routes
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/tasks", tasksRoutes);
router.use("/upload", uploadRoutes);
router.use("/notifications", notificationRoutes);

export default router;
