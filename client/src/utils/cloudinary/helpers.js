/**
 * Check if file is image
 */
export const isImage = (file) => {
  const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return imageTypes.includes(file.type);
};

/**
 * Check file size (default 50MB)
 */
export const isFileSizeValid = (file, maxSizeMB = 50) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Get file size in MB
 */
export const getFileSizeMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2);
};

/**
 * Validate file before upload
 */
export const validateFile = (file, options = {}) => {
  const { maxSizeMB = 50, allowedTypes = [] } = options;

  if (!isFileSizeValid(file, maxSizeMB)) {
    return {
      valid: false,
      message: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
};
