import { Router } from "express";
import tasksController from "../controllers/tasks.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";
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
router.post("/", validate(createTaskSchema), tasksController.createTask);
router.put("/:id", validate(updateTaskSchema), tasksController.updateTask);

// Trash operations
router.patch("/:id/trash", tasksController.trashTask);
router.patch("/:id/restore", tasksController.restoreTask);
router.delete("/:id", tasksController.deleteTask);

// Bulk trash operations
router.post("/restore-all", tasksController.restoreAllTasks);
router.delete("/trash/delete-all", tasksController.deleteAllTrashed);

// Sub-tasks
router.post(
  "/:id/subtasks",
  validate(createSubTaskSchema),
  tasksController.createSubTask
);
router.put(
  "/subtasks/:subTaskId",
  validate(createSubTaskSchema),
  tasksController.updateSubTask
);
router.delete(
  "/subtasks/:subTaskId",
  tasksController.deleteSubTask
);


// Activities
router.post(
  "/:id/activities",
  validate(createActivitySchema),
  tasksController.createActivity
);

export default router;
