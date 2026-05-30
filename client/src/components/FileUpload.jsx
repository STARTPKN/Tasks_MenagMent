import React, { useRef, useState } from "react";
import { BiUpload } from "react-icons/bi";
import { uploadFile } from "../../utils/cloudinary/api";
import { validateFile, getFileSizeMB } from "../../utils/cloudinary/helpers";

const FileUpload = ({
  onUploadSuccess,
  onUploadError,
  token,
  folder = "task-manager/files",
  accept = "*/*",
  disabled = false,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("🔍 File selected:", file.name, `(${file.size} bytes)`);

    const validation = validateFile(file);
    if (!validation.valid) {
      console.warn("❌ Validation failed:", validation.message);
      onUploadError?.(validation.message);
      return;
    }

    if (!token) {
      console.warn("❌ No token provided");
      onUploadError?.("No authentication token. Please login.");
      return;
    }

    console.log("✅ Validation passed, starting upload...");

    try {
      setLoading(true);
      setProgress(0);

      // Simulate progress (since we can't get real progress from fetch)
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      console.log("📤 Sending file to server...");
      const result = await uploadFile(file, folder, token);

      console.log("✅ Upload successful:", result);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        onUploadSuccess?.(result);
      }, 500);

      // Reset input
      inputRef.current.value = "";
    } catch (error) {
      console.error("❌ Upload error:", error.message);
      setLoading(false);
      setProgress(0);
      onUploadError?.(error.message || "Failed to upload file");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileSelect}
        disabled={disabled || loading}
        accept={accept}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || loading}
        className={`
          flex items-center justify-center gap-2 px-4 py-2 rounded-lg
          transition-all duration-300 font-medium
          ${
            disabled || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
          }
        `}
      >
        <BiUpload size={20} />
        {loading ? `Uploading... ${progress}%` : "Upload File"}
      </button>

      {progress > 0 && loading && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
