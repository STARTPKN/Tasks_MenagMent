import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { validate, loginSchema, registerSchema, changePasswordSchema } from "../auth.validation.js";

const router = Router();

// Public routes
router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);

// Protected routes
router.get("/profile", protect, authController.getProfile);
router.put("/profile", protect, authController.updateProfile);
router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
