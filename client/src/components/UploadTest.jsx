import React, { useState } from "react";
import { useSelector } from "react-redux";
import FileUpload from "./FileUpload";
import ImageUpload from "./ImageUpload";

/**
 * Quick Test Component for File Upload
 * Use this to test the upload functionality
 */
const UploadTest = () => {
  const [messages, setMessages] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const { token } = useSelector((state) => state.auth);

  const addMessage = (type, text) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages((prev) => [...prev, { type, text, timestamp }]);
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${text}`);
  };

  const handleFileUploadSuccess = (fileData) => {
    addMessage("success", `File uploaded: ${fileData.filename}`);
    console.log("File data:", fileData);
    setUploadedFile(fileData);
  };

  const handleFileUploadError = (error) => {
    addMessage("error", `File upload failed: ${error}`);
    console.error("File upload error:", error);
  };

  const handleImageUploadSuccess = (images) => {
    const imageNames = Array.isArray(images)
      ? images.map((img) => img.filename).join(", ")
      : images.filename;
    addMessage("success", `Images uploaded: ${imageNames}`);
    console.log("Images data:", images);
    setUploadedImages(Array.isArray(images) ? images : [images]);
  };

  const handleImageUploadError = (error) => {
    addMessage("error", `Image upload failed: ${error}`);
    console.error("Image upload error:", error);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">📤 Upload Test Component</h1>
      <p className="text-gray-600 mb-6">
        Test the Cloudinary file upload functionality
      </p>

      {!token && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          ⚠️ No authentication token found. Please login first.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Upload Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">📎 Single File Upload</h2>
          <FileUpload
            onUploadSuccess={handleFileUploadSuccess}
            onUploadError={handleFileUploadError}
            token={token}
            folder="task-manager/test-files"
            accept=".pdf,.doc,.docx,.txt,.zip"
            disabled={!token}
          />

          {uploadedFile && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-bold text-green-700 mb-2">
                ✅ Uploaded File:
              </h3>
              <p className="text-sm">
                <strong>Name:</strong> {uploadedFile.filename}
              </p>
              <p className="text-sm">
                <strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(2)}{" "}
                KB
              </p>
              <p className="text-sm">
                <strong>Type:</strong> {uploadedFile.type}
              </p>
              <a
                href={uploadedFile.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline text-sm mt-2 block"
              >
                View File
              </a>
            </div>
          )}
        </div>

        {/* Image Upload Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">🖼️ Multi Image Upload</h2>
          <ImageUpload
            onUploadSuccess={handleImageUploadSuccess}
            onUploadError={handleImageUploadError}
            token={token}
            folder="task-manager/test-images"
            multiple={true}
            maxFiles={3}
            disabled={!token}
          />

          {uploadedImages.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-bold text-green-700 mb-2">
                ✅ Uploaded Images ({uploadedImages.length}):
              </h3>
              <div className="space-y-2">
                {uploadedImages.map((img) => (
                  <div key={img.id || img.publicId}>
                    <p className="text-sm">
                      <strong>Name:</strong> {img.filename}
                    </p>
                    <p className="text-sm">
                      <strong>Size:</strong> {getFileSizeMB(img.size)} MB
                    </p>
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline text-sm"
                    >
                      View Image
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Console Messages Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">📋 Upload Messages</h2>
          <div className="bg-black text-white rounded p-3 h-96 overflow-y-auto font-mono text-xs">
            {messages.length === 0 ? (
              <p className="text-gray-400">Waiting for upload events...</p>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`py-1 ${
                    msg.type === "error"
                      ? "text-red-400"
                      : msg.type === "success"
                        ? "text-green-400"
                        : "text-yellow-400"
                  }`}
                >
                  <span className="text-gray-500">[{msg.timestamp}]</span>{" "}
                  <span className="uppercase font-bold">{msg.type}:</span>{" "}
                  {msg.text}
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setMessages([])}
            className="mt-3 w-full px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm font-medium"
          >
            Clear Messages
          </button>
        </div>
      </div>

      {/* Debug Information */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-bold text-blue-700 mb-2">🔍 Debug Information</h3>
        <div className="text-sm space-y-1">
          <p>
            <strong>Token Present:</strong>{" "}
            <span className={token ? "text-green-600" : "text-red-600"}>
              {token ? "✅ Yes" : "❌ No"}
            </span>
          </p>
          <p>
            <strong>API URL:</strong> http://localhost:8800/api
          </p>
          <p>
            <strong>Upload Endpoints:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• POST /api/upload/file (Single file)</li>
              <li>• POST /api/upload/files (Multiple files)</li>
              <li>• DELETE /api/upload/delete (Delete file)</li>
            </ul>
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
        <h3 className="font-bold text-yellow-700 mb-2">📝 Instructions</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Make sure you are logged in (token is present)</li>
          <li>
            Make sure the server is running:{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code>
          </li>
          <li>Select a file and click upload</li>
          <li>Check the messages console for results</li>
          <li>
            Open browser developer console (F12) for detailed error messages
          </li>
        </ol>
      </div>
    </div>
  );
};

// Helper function to convert bytes to MB
function getFileSizeMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

export default UploadTest;
