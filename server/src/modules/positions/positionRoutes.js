import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { isAdmin } from "../../middleware/admin.middleware.js";
import {
  createPosition,
  deletePosition,
  getPositions,
  updatePosition,
} from "./positionController.js";

const router = express.Router();

router.get("/", protect, getPositions);
router.post("/", protect, isAdmin, createPosition);
router.put("/:id", protect, isAdmin, updatePosition);
router.delete("/:id", protect, isAdmin, deletePosition);

export default router;
