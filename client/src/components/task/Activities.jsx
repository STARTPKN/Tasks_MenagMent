import React, { useState } from "react";
import moment from "moment";
import { FaBug, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import { MdOutlineDoneAll, MdOutlineMessage, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import Loading from "../Loader";
import Button from "../Button";
import { toast } from "sonner";
import {
  usePostTaskActivityMutation,
  useUpdateTaskActivityMutation,
  useDeleteTaskActivityMutation,
} from "../../redux/slices/taskApiSlice";
import ConfirmatioDialog from "../Dialogs";

const TASKTYPEICON = {
  commented: (
    <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
      <MdOutlineMessage size={20} />
    </div>
  ),
  started: (
    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className='w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className='text-red-600'>
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white'>
      <GrInProgress size={16} />
    </div>
  ),
  in_progress: (
    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white'>
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "เริ่มแล้ว",
  "เสร็จสิ้น",
  "กำลังดำเนินการ",
  "แสดงความคิดเห็น",
  "พบบั๊ก",
  "มอบหมาย",
];

const ACT_TYPES_THAI = {
  started: "เริ่มแล้ว",
  completed: "เสร็จสิ้น",
  "in progress": "กำลังดำเนินการ",
  in_progress: "กำลังดำเนินการ",
  commented: "แสดงความคิดเห็น",
  bug: "พบบั๊ก",
  assigned: "มอบหมาย",
};

const MAP_THAI_TO_ENG = {
  "เริ่มแล้ว": "started",
  "เสร็จสิ้น": "completed",
  "กำลังดำเนินการ": "in_progress",
  "แสดงความคิดเห็น": "commented",
  "พบบั๊ก": "bug",
  "มอบหมาย": "assigned",
};

const Activities = ({ activity, id }) => {
  const { user } = useSelector((state) => state.auth);

  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();
  const [updateActivity, { isLoading: isUpdating }] = useUpdateTaskActivityMutation();
  const [deleteActivity, { isLoading: isDeleting }] = useDeleteTaskActivityMutation();

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("กรุณากรอกข้อความกิจกรรม");
      return;
    }
    try {
      const type = MAP_THAI_TO_ENG[selected];
      await postActivity({
        id,
        data: {
          type,
          activity: text,
        },
      }).unwrap();

      toast.success("เพิ่มกิจกรรมสำเร็จ!");
      setText("");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "เกิดข้อผิดพลาดในการเพิ่มกิจกรรม");
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id || item._id);
    setEditText(item.activity);
  };

  const handleSaveEdit = async (activityId) => {
    if (!editText.trim()) {
      toast.error("กรุณากรอกข้อความกิจกรรม");
      return;
    }
    try {
      await updateActivity({
        activityId,
        data: { activity: editText },
      }).unwrap();
      toast.success("แก้ไขกิจกรรมสำเร็จ!");
      setEditingId(null);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "เกิดข้อผิดพลาดในการแก้ไขกิจกรรม");
    }
  };

  const handleDeleteClick = (activityId) => {
    setDeletingId(activityId);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteActivity(deletingId).unwrap();
      toast.success("ลบกิจกรรมสำเร็จ!");
      setOpenDelete(false);
      setDeletingId(null);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "เกิดข้อผิดพลาดในการลบกิจกรรม");
    }
  };

  const Card = ({ item, isConnected }) => {
    const isOwnerOrAdmin = item?.byUserId === user?.id || item?.by?.id === user?.id || user?.role === "ADMIN";
    const isEditing = editingId === item?.id || editingId === item?._id;

    return (
      <div className='flex space-x-4 w-full group'>
        <div className='flex flex-col items-center flex-shrink-0'>
          <div className='w-10 h-10 flex items-center justify-center'>
            {TASKTYPEICON[item?.type]}
          </div>
          <div className='w-full flex items-center justify-center flex-grow'>
            {isConnected && <div className='w-0.5 bg-gray-200 h-full min-h-[40px]'></div>}
          </div>
        </div>

        <div className='flex flex-col gap-y-1 mb-8 flex-grow w-full'>
          <div className='flex justify-between items-start w-full gap-2'>
            <div>
              <p className='font-semibold text-gray-800'>{item?.by?.name}</p>
              <div className='text-gray-400 text-xs flex gap-2 items-center mt-0.5'>
                <span className='capitalize font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-600'>{ACT_TYPES_THAI[item?.type] || item?.type}</span>
                <span>•</span>
                <span>{moment(item?.date).fromNow()}</span>
              </div>
            </div>

            {/* Action buttons (only show if owner/admin and not currently editing) */}
            {isOwnerOrAdmin && !isEditing && (
              <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                <button
                  onClick={() => handleEditClick(item)}
                  className='p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors'
                  title='แก้ไขกิจกรรม'
                >
                  <MdOutlineEdit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClick(item?.id || item?._id)}
                  className='p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors'
                  title='ลบกิจกรรม'
                >
                  <RiDeleteBin6Line size={16} />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className='mt-2 w-full space-y-2'>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className='w-full p-2 border border-blue-400 rounded outline-none focus:ring-1 ring-blue-500 bg-white text-base text-gray-800'
              />
              <div className='flex gap-2 justify-end'>
                <Button
                  type='button'
                  label={isUpdating ? "กำลังบันทึก..." : "บันทึก"}
                  onClick={() => handleSaveEdit(item?.id || item?._id)}
                  className='bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 font-semibold'
                />
                <Button
                  type='button'
                  label='ยกเลิก'
                  onClick={() => setEditingId(null)}
                  className='bg-white border text-gray-700 px-3 py-1 text-sm rounded hover:bg-gray-50 font-semibold'
                />
              </div>
            </div>
          ) : (
            <div className='text-gray-700 text-base mt-2 whitespace-pre-line bg-gray-50/50 p-2.5 rounded border border-gray-100/50'>{item?.activity}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto'>
      <div className='w-full md:w-1/2'>
        <h4 className='text-gray-600 font-semibold text-lg mb-5'>กิจกรรม</h4>

        <div className='w-full'>
          {activity?.map((el, index) => (
            <Card
              key={index}
              item={el}
              isConnected={index < activity.length - 1}
            />
          ))}
        </div>
      </div>

      <div className='w-full md:w-1/3'>
        <h4 className='text-gray-600 font-semibold text-lg mb-5'>
          เพิ่มกิจกรรม
        </h4>
        <div className='w-full flex flex-wrap gap-5'>
          {act_types.map((item, index) => (
            <div key={item} className='flex gap-2 items-center'>
              <input
                type='checkbox'
                className='w-4 h-4'
                checked={selected === item}
                onChange={(e) => setSelected(item)}
              />
              <p>{item}</p>
            </div>
          ))}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='พิมพ์ข้อความ...'
            className='bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500'
          ></textarea>
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type='button'
              label='ยืนยัน'
              onClick={handleSubmit}
              className='bg-blue-600 text-white rounded'
            />
          )}
        </div>
      </div>

      <ConfirmatioDialog
        open={openDelete}
        setOpen={setOpenDelete}
        onClick={handleConfirmDelete}
      />
    </div>
  );
};

export default Activities;
