import express from "express";
import multer from "multer";
import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
} from "./upload.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import settingsService from "../settings/settings.service.js";
import { AppError } from "../../utils/index.js";

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

// อนุญาตเฉพาะประเภทไฟล์ที่ใช้งานจริงในระบบ (เอกสาร/รูปภาพ/วิดีโอทั่วไป)
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "application/zip",
  "video/mp4",
  "video/quicktime",
]);

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", `File type ${file.mimetype} is not allowed`));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter,
});

const checkFileUploadSetting = async (req, res, next) => {
  try {
    const enableFileUpload = await settingsService.getSetting("enableFileUpload");
    if (enableFileUpload !== "true") {
      return next(new AppError("การอัปโหลดไฟล์ถูกปิดใช้งานโดยผู้ดูแลระบบ", 403));
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Upload single file
 * POST /api/upload/file
 * Required: Authorization header with JWT token
 * Body: FormData with 'file' field and optional 'folder' field
 */
router.post(
  "/file",
  protect,
  checkFileUploadSetting,
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
  checkFileUploadSetting,
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
