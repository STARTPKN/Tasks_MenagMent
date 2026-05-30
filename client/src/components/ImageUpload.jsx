import React, { useRef, useState, useCallback } from "react";
import { BiUpload } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
} from "../../utils/cloudinary/api";
import { validateFile, getFileSizeMB } from "../../utils/cloudinary/helpers";

const ImageUpload = ({
  onUploadSuccess,
  onUploadError,
  token,
  folder = "task-manager/images",
  disabled = false,
  className = "",
  maxFiles = 1,
  multiple = false,
}) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    await handleFileUpload(files);
  }, []);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    await handleFileUpload(files);
  };

  const handleFileUpload = async (files) => {
    if (!files.length) {
      console.log("No files selected");
      return;
    }

    console.log("🔍 Files selected:", files.length);

    // Check max files
    if (!multiple && files.length > 1) {
      console.warn("❌ Cannot upload multiple files when multiple=false");
      onUploadError?.("Can only upload one file");
      return;
    }

    if (uploadedFiles.length + files.length > maxFiles) {
      console.warn(`❌ Exceeds max files limit (${maxFiles})`);
      onUploadError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate files
    const validFiles = [];
    for (const file of files) {
      const validation = validateFile(file, {
        allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      });
      if (!validation.valid) {
        console.warn("❌ File validation failed:", validation.message);
        onUploadError?.(validation.message);
        return;
      }
      validFiles.push(file);
    }

    if (!token) {
      console.warn("❌ No token provided");
      onUploadError?.("No authentication token. Please login.");
      return;
    }

    console.log("✅ All validations passed, starting upload...");

    try {
      setLoading(true);

      let results;
      if (multiple && validFiles.length > 1) {
        console.log("📤 Uploading multiple files...");
        results = await uploadMultipleFiles(validFiles, folder, token);
      } else {
        console.log("📤 Uploading single file...");
        const result = await uploadFile(validFiles[0], folder, token);
        results = Array.isArray(result) ? result : [result];
      }

      console.log("✅ Upload successful:", results);

      const newFiles = results.map((result) => ({
        ...result,
        id: Math.random(),
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      onUploadSuccess?.(newFiles);

      // Reset input
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error("❌ Upload error:", error.message);
      onUploadError?.(error.message || "Failed to upload files");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId, publicId) => {
    try {
      await deleteFile(publicId, token);
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
      onUploadSuccess?.(uploadedFiles.filter((f) => f.id !== fileId));
    } catch (error) {
      onUploadError?.(error.message || "Failed to delete file");
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileSelect}
        disabled={disabled || loading || uploadedFiles.length >= maxFiles}
        accept="image/*"
        multiple={multiple}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-300
          ${
            disabled || loading || uploadedFiles.length >= maxFiles
              ? "border-gray-300 bg-gray-100 cursor-not-allowed"
              : "border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100"
          }
        `}
      >
        <BiUpload className="mx-auto mb-2 text-2xl text-blue-500" />
        <p className="text-sm font-medium text-gray-700">
          {loading ? "Uploading..." : "Drag and drop images or click to browse"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {`${uploadedFiles.length}/${maxFiles} files uploaded`}
        </p>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="relative group">
              <img
                src={file.url}
                alt={file.filename}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center">
                <button
                  onClick={() => handleDeleteFile(file.id, file.publicId)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 text-white rounded-lg"
                >
                  <RiDeleteBin6Line size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">
                {file.filename}
              </p>
              <p className="text-xs text-gray-500">
                {getFileSizeMB(file.size)} MB
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
