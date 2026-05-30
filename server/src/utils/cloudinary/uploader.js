import cloudinary from "./config.js";
import { Readable } from "stream";

/**
 * Upload file/image to Cloudinary
 * @param {Buffer} buffer - File buffer from multer or similar
 * @param {string} folder - Folder name in Cloudinary (e.g., 'task-manager/tasks')
 * @param {string} publicId - Optional custom public ID
 * @returns {Promise<Object>} - Cloudinary upload response
 */
export const uploadToCloudinary = (buffer, folder, publicId = null) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || "task-manager/files",
        public_id: publicId,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    // Convert buffer to stream
    Readable.from(buffer).pipe(uploadStream);
  });
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @returns {Promise<Object>} - Cloudinary deletion response
 */
export const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

/**
 * Get Cloudinary URL for a public ID
 * @param {string} publicId - Public ID of the file
 * @param {Object} options - Additional transformation options
 * @returns {string} - Cloudinary URL
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  });
};

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryUrl,
};
