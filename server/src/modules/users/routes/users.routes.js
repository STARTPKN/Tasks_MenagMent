import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { isAdmin } from "../../../middleware/admin.middleware.js";
import {
  validate,
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
} from "../users.validation.js";

const router = Router();

// All user routes require authentication
router.use(protect);

// Read-only routes: accessible to all authenticated users (for task assignment)
router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);

// Management routes: admin only
router.post("/", isAdmin, validate(createUserSchema), usersController.createUser);
router.put("/:id", isAdmin, validate(updateUserSchema), usersController.updateUser);
router.delete("/:id", isAdmin, usersController.deleteUser);
router.patch("/:id/status", isAdmin, usersController.toggleUserStatus);
router.patch(
  "/:id/password",
  isAdmin,
  validate(changePasswordSchema),
  usersController.changeUserPassword,
);

export default router;
