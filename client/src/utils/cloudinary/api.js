const API_URL = "http://localhost:8800/api";

/**
 * Upload single file to Cloudinary via server
 * @param {File} file - File to upload
 * @param {string} folder - Folder in Cloudinary
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - Upload response with file details
 */
export const uploadFile = async (
  file,
  folder = "task-manager/files",
  token,
) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    if (!token) {
      throw new Error("No authentication token provided");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch(`${API_URL}/upload/file`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Upload failed with status ${response.status}`,
      );
    }

    return data.data;
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
};

/**
 * Upload multiple files to Cloudinary via server
 * @param {File[]} files - Array of files to upload
 * @param {string} folder - Folder in Cloudinary
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object[]>} - Array of upload responses
 */
export const uploadMultipleFiles = async (
  files,
  folder = "task-manager/files",
  token,
) => {
  try {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }
    if (!token) {
      throw new Error("No authentication token provided");
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("folder", folder);

    const response = await fetch(`${API_URL}/upload/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Upload failed with status ${response.status}`,
      );
    }

    return data.data;
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
};

/**
 * Delete file from Cloudinary via server
 * @param {string} publicId - Public ID of file to delete
 * @param {string} token - JWT token for authentication
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFile = async (publicId, token) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required");
    }
    if (!token) {
      throw new Error("No authentication token provided");
    }

    const response = await fetch(`${API_URL}/upload/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ publicId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Delete failed with status ${response.status}`,
      );
    }

    return true;
  } catch (error) {
    console.error("File delete error:", error);
    throw error;
  }
};
