import { Router } from "express";
import rateLimit from "express-rate-limit";
import authController from "../controllers/auth.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { validate, loginSchema, registerSchema, changePasswordSchema } from "../auth.validation.js";

const router = Router();

// จำกัดจำนวนครั้งการ login/register เพื่อป้องกัน brute-force และ credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "พยายามเข้าสู่ระบบบ่อยเกินไป กรุณาลองใหม่ภายหลัง",
  },
});

// Public routes
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/register", authLimiter, validate(registerSchema), authController.register);

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
