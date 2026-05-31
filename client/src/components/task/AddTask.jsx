import React, { useState, useEffect } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import { useUploadMultipleFilesMutation } from "../../redux/slices/uploadApiSlice";
import Button from "../Button";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/taskApiSlice";
import { toast } from "sonner";

const LISTS = ["ที่ต้องทำ", "กำลังดำเนินการ", "เสร็จสิ้น"];
const PRIORIRY = ["สูง", "ปานกลาง", "ปกติ", "ต่ำ"];

const STAGE_MAP = {
  "ที่ต้องทำ": "TODO",
  "กำลังดำเนินการ": "IN_PROGRESS",
  "เสร็จสิ้น": "COMPLETED",
};

const PRIORITY_MAP = {
  "สูง": "HIGH",
  "ปานกลาง": "MEDIUM",
  "ปกติ": "NORMAL",
  "ต่ำ": "LOW",
};

const mapStageToThai = (stage) => {
  const s = stage?.toLowerCase()?.replace("_", " ");
  if (s === "todo") return LISTS[0];
  if (s === "in progress" || s === "in_progress") return LISTS[1];
  if (s === "completed") return LISTS[2];
  return LISTS[0];
};

const mapPriorityToThai = (priority) => {
  const p = priority?.toLowerCase();
  if (p === "high") return PRIORIRY[0];
  if (p === "medium") return PRIORIRY[1];
  if (p === "normal") return PRIORIRY[2];
  if (p === "low") return PRIORIRY[3];
  return PRIORIRY[2];
};

const AddTask = ({ open, setOpen, task = null, initialStage = null }) => {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      date: task?.date ? task.date.split("T")[0] : "",
    },
  });
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(initialStage || mapStageToThai(task?.stage));
  const [priority, setPriority] = useState(mapPriorityToThai(task?.priority));
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Note: Base64 conversion is no longer used; files will be uploaded directly to Cloudinary via the upload API.

  const [uploadMultipleFiles] = useUploadMultipleFilesMutation();

  const submitHandler = async (data) => {
    try {
      let assetUrls = [];
      // If there are files selected, upload them first
      if (assets && assets.length > 0) {
        setUploading(true);
        const uploadResult = await uploadMultipleFiles({ files: Array.from(assets) }).unwrap();
        // uploadResult is expected to be an array of uploaded file info (e.g., URLs)
        assetUrls = uploadResult.map((file) => file.url);
        setUploading(false);
      }

      const basePayload = {
        title: data.title,
        date: data.date,
        stage: STAGE_MAP[stage] || "TODO",
        priority: PRIORITY_MAP[priority] || "NORMAL",
        team: team.map((t) => (typeof t === "string" ? t : t.id || t._id)),
        assets: assetUrls,
      };

      // If editing, preserve existing assets and merge new ones
      const payload = task
        ? { ...basePayload, assets: [...(task.assets || []), ...assetUrls] }
        : basePayload;

      if (task) {
        await updateTask({ id: task.id || task._id, ...payload }).unwrap();
        toast.success("แก้ไขงานสำเร็จ!");
      } else {
        await createTask(payload).unwrap();
        toast.success("สร้างงานสำเร็จ!");
      }
      setOpen(false);
      setAssets([]);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "เกิดข้อผิดพลาด");
    } finally {
      setUploading(false);
    }
  };

  // reset local state when modal opens or task changes
  useEffect(() => {
    reset({
      title: task?.title || "",
      date: task?.date ? task.date.split("T")[0] : "",
    });
    setTeam(task?.team || []);
    setStage(task ? mapStageToThai(task?.stage) : (initialStage || LISTS[0]));
    setPriority(mapPriorityToThai(task?.priority));
  }, [task, open, reset, initialStage]);

  const handleSelect = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setAssets((prev) => [...prev, ...newFiles]);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const removeFile = (index) => {
    setAssets((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {task ? "แก้ไขงาน" : "สร้างงาน"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="ชื่องาน"
              type="text"
              name="title"
              label="ชื่องาน"
              className="w-full rounded"
              register={register("title", { required: "กรุณาระบุชื่องาน" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className="flex gap-4">
              <SelectList
                label="สถานะงาน"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className="w-full">
                <Textbox
                  placeholder="วันที่"
                  type="date"
                  name="date"
                  label="วันที่"
                  className="w-full rounded"
                  register={register("date", {
                    required: "กรุณาระบุวันที่!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <SelectList
                label="ระดับความสำคัญ"
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className="w-full flex items-center justify-center mt-4">
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                  htmlFor="imgUpload"
                >
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    onChange={(e) => handleSelect(e)}
                    accept=".jpg,.png,.jpeg,.gif,.webp,.pdf,.doc,.docx"
                    multiple={true}
                  />
                  <BiImages />
                  <span>เพิ่มไฟล์แนบ</span>
                  {assets.length > 0 && (
                    <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                      {assets.length}
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* File Preview */}
            {assets.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                <p className="text-sm font-semibold text-gray-600">
                  ไฟล์ที่เลือก ({assets.length} ไฟล์):
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {assets.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 rounded px-3 py-1.5 text-sm"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-blue-500">
                          {file.type?.startsWith("image/") ? "🖼️" : "📄"}
                        </span>
                        <span className="truncate text-gray-700">{file.name}</span>
                        <span className="text-gray-400 text-xs flex-shrink-0">
                          ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0"
                        title="ลบไฟล์"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              {uploading ? (
                <span className="text-sm py-2 text-red-500">
                  กำลังอัปโหลด...
                </span>
              ) : (
                <Button
                  label="บันทึก"
                  type="submit"
                  className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                />
              )}

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="ยกเลิก"
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
