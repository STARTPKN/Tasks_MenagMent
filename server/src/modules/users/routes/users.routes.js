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

// All user routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);
router.post("/", validate(createUserSchema), usersController.createUser);
router.put("/:id", validate(updateUserSchema), usersController.updateUser);
router.delete("/:id", usersController.deleteUser);
router.patch("/:id/status", usersController.toggleUserStatus);
router.patch(
  "/:id/password",
  validate(changePasswordSchema),
  usersController.changeUserPassword,
);

export default router;
