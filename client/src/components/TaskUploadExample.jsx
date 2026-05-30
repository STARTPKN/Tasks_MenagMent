import React, { useState } from "react";
import { useSelector } from "react-redux";
import ImageUpload from "./ImageUpload";
import FileUpload from "./FileUpload";
import { uploadFile } from "../utils/cloudinary/api";

/**
 * Example component showing how to integrate Cloudinary uploads
 * into existing components like AddTask or TaskDetails
 */
const TaskUploadExample = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    images: [],
    attachments: [],
  });

  const { token } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle image upload success
  const handleImageUploadSuccess = (uploadedImages) => {
    setTaskData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedImages],
    }));
    setSuccess("Images uploaded successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  // Handle image upload error
  const handleImageUploadError = (errorMsg) => {
    setError(errorMsg);
    setTimeout(() => setError(null), 3000);
  };

  // Handle document/attachment upload
  const handleAttachmentUploadSuccess = (uploadedFile) => {
    setTaskData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, uploadedFile],
    }));
    setSuccess("File attached successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  // Handle attachment upload error
  const handleAttachmentUploadError = (errorMsg) => {
    setError(errorMsg);
    setTimeout(() => setError(null), 3000);
  };

  // Remove image from task
  const removeImage = (imageId) => {
    setTaskData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  // Remove attachment from task
  const removeAttachment = (attachmentId) => {
    setTaskData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== attachmentId),
    }));
  };

  // Submit task with uploaded files
  const handleSubmitTask = async () => {
    try {
      // Prepare task data with file URLs and public IDs
      const submitData = {
        title: taskData.title,
        description: taskData.description,
        attachments: taskData.attachments.map((file) => ({
          url: file.url,
          publicId: file.publicId,
          filename: file.filename,
          size: file.size,
        })),
        images: taskData.images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          filename: img.filename,
        })),
      };

      // Submit to your API
      console.log("Submitting task:", submitData);
      // await createTask(submitData).unwrap();

      setSuccess("Task created successfully!");
      setTaskData({ title: "", description: "", images: [], attachments: [] });
    } catch (err) {
      setError(err.message || "Failed to create task");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Task with Files</h2>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Task Title Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Task Title</label>
        <input
          type="text"
          value={taskData.title}
          onChange={(e) =>
            setTaskData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Enter task title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Task Description Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={taskData.description}
          onChange={(e) =>
            setTaskData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Enter task description"
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Image Upload Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">📸 Task Images</h3>
        <ImageUpload
          onUploadSuccess={handleImageUploadSuccess}
          onUploadError={handleImageUploadError}
          token={token}
          folder="task-manager/task-images"
          multiple={true}
          maxFiles={5}
        />

        {/* Display Uploaded Images */}
        {taskData.images.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Uploaded Images ({taskData.images.length})
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {taskData.images.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* File/Attachment Upload Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">📎 Attachments</h3>
        <FileUpload
          onUploadSuccess={handleAttachmentUploadSuccess}
          onUploadError={handleAttachmentUploadError}
          token={token}
          folder="task-manager/attachments"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
        />

        {/* Display Attached Files */}
        {taskData.attachments.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Attached Files ({taskData.attachments.length})
            </p>
            <div className="space-y-2">
              {taskData.attachments.map((file) => (
                <div
                  key={file.publicId}
                  className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">
                      {file.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => removeAttachment(file.publicId)}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitTask}
        disabled={!taskData.title.trim()}
        className={`w-full py-3 rounded-lg font-semibold transition-all
          ${
            taskData.title.trim()
              ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
      >
        Create Task
      </button>

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2">Summary</h4>
        <ul className="text-sm space-y-1">
          <li>Title: {taskData.title || "Not filled"}</li>
          <li>Images: {taskData.images.length}</li>
          <li>Attachments: {taskData.attachments.length}</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskUploadExample;
