import clsx from "clsx";
import React, { useState, Fragment } from "react";
import { FaTasks } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Menu, Transition } from "@headlessui/react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdTaskAlt,
  MdOutlineEdit,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { useGetTasksQuery, useDeleteSubTaskMutation } from "../redux/slices/taskApiSlice";
import Tabs from "../components/Tabs";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials, PRIORITY_THAI, TASK_TYPE_THAI, formatThaiDate } from "../utils";
import Activities from "../components/task/Activities";
import AddSubTask from "../components/task/AddSubTask";
import ConfirmatioDialog from "../components/Dialogs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "รายละเอียดงาน", icon: <FaTasks /> },
  { title: "กิจกรรม/ไทม์ไลน์", icon: <RxActivityLog /> },
];

const TaskDetails = () => {
  const { id } = useParams();

  const [selected, setSelected] = useState(0);
  const { data: tasksData, isLoading } = useGetTasksQuery();
  const task = (tasksData?.data || []).find((t) => t._id === id || t.id === id) || {};

  const priority = task?.priority?.toLowerCase();
  const stage = task?.stage?.toLowerCase()?.replace("_", " ");

  const [openSubTask, setOpenSubTask] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const [openDeleteSubTask, setOpenDeleteSubTask] = useState(false);

  const [deleteSubTask] = useDeleteSubTaskMutation();

  const handleEditSubTask = (subTask) => {
    setSelectedSubTask(subTask);
    setOpenSubTask(true);
  };

  const handleDeleteSubTaskClick = (subTask) => {
    setSelectedSubTask(subTask);
    setOpenDeleteSubTask(true);
  };

  const handleDeleteSubTask = async () => {
    try {
      const subTaskId = selectedSubTask?.id || selectedSubTask?._id;
      await deleteSubTask(subTaskId).unwrap();
      toast.success("ลบงานย่อยสำเร็จ!");
      setOpenDeleteSubTask(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "เกิดข้อผิดพลาดในการลบงานย่อย");
    }
  };

  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
      <h1 className='text-2xl text-gray-600 font-bold'>{task?.title}</h1>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className='w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-8 overflow-y-auto'>
              {/* LEFT */}
              <div className='w-full md:w-1/2 space-y-8'>
                <div className='flex items-center gap-5'>
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                      PRIOTITYSTYELS[priority],
                      bgColor[priority]
                    )}
                  >
                    <span className='text-lg'>{ICONS[priority]}</span>
                    <span>ความสำคัญ {PRIORITY_THAI[priority] || task?.priority}</span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <div
                      className={clsx(
                        "w-4 h-4 rounded-full",
                        TASK_TYPE[stage]
                      )}
                    />
                    <span className='text-black font-semibold'>{TASK_TYPE_THAI[stage] || task?.stage}</span>
                  </div>
                </div>

                <p className='text-gray-500'>
                  สร้างเมื่อ: {formatThaiDate(task?.date)}
                </p>

                <div className='flex items-center gap-8 p-4 border-y border-gray-200'>
                  <div className='space-x-2'>
                    <span className='font-semibold'>ไฟล์แนบ :</span>
                    <span>{task?.assets?.length}</span>
                  </div>

                  <span className='text-gray-400'>|</span>

                  <div className='space-x-2'>
                    <span className='font-semibold'>งานย่อย :</span>
                    <span>{task?.subTasks?.length}</span>
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <p className='text-gray-600 font-semibold test-sm'>
                    ทีมงาน
                  </p>
                  <div className='space-y-3'>
                    {task?.team?.map((m, index) => (
                      <div
                        key={index}
                        className='flex gap-4 py-2 items-center border-t border-gray-200'
                      >
                        <div
                          className={
                            "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600"
                          }
                        >
                          <span className='text-center'>
                            {getInitials(m?.name)}
                          </span>
                        </div>

                        <div>
                          <p className='text-lg font-semibold'>{m?.name}</p>
                          <span className='text-gray-500'>{m?.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <p className='text-gray-500 font-semibold text-sm'>
                    งานย่อย
                  </p>
                  <div className='space-y-4 max-h-[400px] overflow-y-auto pr-2 pb-24'>
                    {task?.subTasks?.map((el, index) => (
                      <div
                        key={index}
                        className='flex justify-between items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100 group'
                      >
                        <div className='flex gap-3'>
                          <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-100 flex-shrink-0'>
                            <MdTaskAlt className='text-violet-600' size={26} />
                          </div>

                          <div className='space-y-1'>
                            <div className='flex gap-2 items-center'>
                              <span className='text-sm text-gray-500'>
                                {formatThaiDate(el?.date)}
                              </span>

                              <span className='px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold'>
                                {el?.tag}
                              </span>
                            </div>

                            <p className='text-gray-700 font-medium'>{el?.title}</p>
                          </div>
                        </div>

                        {/* Edit and Delete Actions dropdown */}
                        <div className='flex items-center z-10'>
                          <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:scale-95 transition-all duration-150" title='จัดการงานย่อย'>
                              <BsThreeDots size={18} />
                            </Menu.Button>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute p-1 right-0 mt-1 w-32 origin-top-right divide-y divide-gray-100  bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-20">
                                <div className="py-1 space-y-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => handleEditSubTask(el)}
                                        className={`${
                                          active ? "bg-blue-500 text-white" : "text-gray-700"
                                        } group flex w-full items-center  px-2 py-1.5 text-sm gap-2`}
                                      >
                                        <MdOutlineEdit size={16} className={active ? "text-white" : ""} />
                                        <span>แก้ไข</span>
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => handleDeleteSubTaskClick(el)}
                                        className={`${
                                          active ? "bg-red-500 text-white" : ""
                                        } group flex w-full items-center  px-2 py-1.5 text-sm gap-2`}
                                      >
                                        <RiDeleteBin6Line size={16} className={active ? "text-white" : ""} />
                                        <span>ลบ</span>
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* RIGHT */}
              <div className='w-full md:w-1/2 space-y-8'>
                <p className='text-lg font-semibold'>ไฟล์แนบ</p>

                <div className='w-full grid grid-cols-2 gap-4'>
                  {task?.assets?.map((el, index) => (
                    <img
                      key={index}
                      src={el?.url || el}
                      alt={task?.title}
                      className='w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-700 hover:scale-125 hover:z-50'
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Activities activity={task?.activities} id={id} />
          </>
        )}
      </Tabs>

      <AddSubTask
        open={openSubTask}
        setOpen={setOpenSubTask}
        id={id}
        subTask={selectedSubTask}
        key={selectedSubTask ? selectedSubTask.id || selectedSubTask._id : "new"}
      />

      <ConfirmatioDialog
        open={openDeleteSubTask}
        setOpen={setOpenDeleteSubTask}
        onClick={handleDeleteSubTask}
      />
    </div>
  );
};

export default TaskDetails;

