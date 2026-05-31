import { Router } from "express";
import tasksController from "../controllers/tasks.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { isAdmin } from "../../../middleware/admin.middleware.js";
import {
  validate,
  createTaskSchema,
  updateTaskSchema,
  createSubTaskSchema,
  createActivitySchema,
} from "../tasks.validation.js";

const router = Router();

// All task routes require authentication
router.use(protect);

// Dashboard
router.get("/dashboard", tasksController.getDashboard);

// Task CRUD
router.get("/", tasksController.getAllTasks);
router.get("/trashed", tasksController.getTrashedTasks);
router.get("/:id", tasksController.getTaskById);
router.post("/", isAdmin, validate(createTaskSchema), tasksController.createTask);
router.put("/:id", isAdmin, validate(updateTaskSchema), tasksController.updateTask);

// Trash operations
router.patch("/:id/trash", isAdmin, tasksController.trashTask);
router.patch("/:id/restore", isAdmin, tasksController.restoreTask);
router.delete("/:id", isAdmin, tasksController.deleteTask);

// Bulk trash operations
router.post("/restore-all", isAdmin, tasksController.restoreAllTasks);
router.delete("/trash/delete-all", isAdmin, tasksController.deleteAllTrashed);

// Sub-tasks
router.post(
  "/:id/subtasks",
  isAdmin,
  validate(createSubTaskSchema),
  tasksController.createSubTask
);
router.put(
  "/subtasks/:subTaskId",
  isAdmin,
  validate(createSubTaskSchema),
  tasksController.updateSubTask
);
router.delete(
  "/subtasks/:subTaskId",
  isAdmin,
  tasksController.deleteSubTask
);


// Activities
router.post(
  "/:id/activities",
  validate(createActivitySchema),
  tasksController.createActivity
);

export default router;
