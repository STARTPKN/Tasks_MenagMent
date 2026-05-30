import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary/uploader.js";

/**
 * Upload single file to Cloudinary
 */
export const uploadFile = async (req, res, next) => {
  try {
    console.log("📤 Upload file endpoint called");
    console.log("User:", req.user?.email);
    console.log(
      "File received:",
      req.file
        ? `${req.file.originalname} (${req.file.size} bytes)`
        : "NO FILE",
    );

    if (!req.file) {
      console.warn("⚠️ No file provided in request");
      return res.status(400).json({
        status: "fail",
        message: "No file provided",
      });
    }

    const folder = req.body?.folder || "task-manager/files";
    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;

    if (!fileBuffer || fileBuffer.length === 0) {
      console.warn("⚠️ File buffer is empty");
      return res.status(400).json({
        status: "fail",
        message: "File is empty",
      });
    }

    console.log(`📁 Uploading to folder: ${folder}`);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(fileBuffer, folder, null);

    console.log("✅ File uploaded successfully");
    console.log("Public ID:", result.public_id);
    console.log("URL:", result.secure_url);

    return res.status(201).json({
      status: "success",
      message: "File uploaded successfully",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        filename: originalName,
        size: result.bytes,
        type: result.resource_type,
      },
    });
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    console.error(error);
    next(error);
  }
};

/**
 * Upload multiple files to Cloudinary
 */
export const uploadMultipleFiles = async (req, res, next) => {
  try {
    console.log("📤 Upload multiple files endpoint called");
    console.log("User:", req.user?.email);
    console.log(
      "Files received:",
      req.files ? `${req.files.length} files` : "NO FILES",
    );

    if (!req.files || req.files.length === 0) {
      console.warn("⚠️ No files provided in request");
      return res.status(400).json({
        status: "fail",
        message: "No files provided",
      });
    }

    const folder = req.body?.folder || "task-manager/files";
    console.log(`📁 Uploading ${req.files.length} files to folder: ${folder}`);

    const uploadPromises = req.files.map((file) => {
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error(`File ${file.originalname} is empty`);
      }
      return uploadToCloudinary(file.buffer, folder, null);
    });

    const results = await Promise.all(uploadPromises);

    const uploadedFiles = results.map((result, index) => ({
      url: result.secure_url,
      publicId: result.public_id,
      filename: req.files[index].originalname,
      size: result.bytes,
      type: result.resource_type,
    }));

    console.log("✅ Files uploaded successfully:", uploadedFiles.length);

    return res.status(201).json({
      status: "success",
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error("❌ Upload multiple files error:", error.message);
    console.error(error);
    next(error);
  }
};

/**
 * Delete file from Cloudinary
 */
export const deleteFile = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        status: "fail",
        message: "Public ID is required",
      });
    }

    const result = await deleteFromCloudinary(publicId);

    return res.status(200).json({
      status: "success",
      message: "File deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete error:", error);
    next(error);
  }
};
