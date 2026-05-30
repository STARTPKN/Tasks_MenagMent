import express from "express";
import multer from "multer";
import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
} from "./upload.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Configure multer for in-memory storage
const storage = multer.memoryStorage();

// Custom error handler for multer
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(400).json({
        status: "fail",
        message: "File too large. Maximum size is 50MB",
      });
    }
    return res.status(400).json({
      status: "fail",
      message: `Upload error: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).json({
      status: "fail",
      message: `Error: ${err.message}`,
    });
  }
  next();
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

/**
 * Upload single file
 * POST /api/upload/file
 * Required: Authorization header with JWT token
 * Body: FormData with 'file' field and optional 'folder' field
 */
router.post(
  "/file",
  protect,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: "fail",
          message: `Upload error: ${err.message}`,
        });
      }
      next();
    });
  },
  uploadFile,
);

/**
 * Upload multiple files
 * POST /api/upload/files
 * Required: Authorization header with JWT token
 * Body: FormData with 'files' field (multiple) and optional 'folder' field
 */
router.post(
  "/files",
  protect,
  (req, res, next) => {
    upload.array("files", 10)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: "fail",
          message: `Upload error: ${err.message}`,
        });
      }
      next();
    });
  },
  uploadMultipleFiles,
);

/**
 * Delete file
 * DELETE /api/upload/delete
 * Required: Authorization header with JWT token
 * Body: JSON with 'publicId' field
 */
router.delete("/delete", protect, deleteFile);

export default router;
