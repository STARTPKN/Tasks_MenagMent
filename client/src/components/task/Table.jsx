import React, { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import {
  BGS,
  PRIOTITYSTYELS,
  TASK_TYPE,
  formatDate,
  PRIORITY_THAI,
  formatThaiDateTime,
} from "../../utils";
import clsx from "clsx";
import { FaList } from "react-icons/fa";
import UserInfo from "../UserInfo";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import AddTask from "./AddTask";
import { RiFileEditLine } from "react-icons/ri";
import { useTrashTaskMutation } from "../../redux/slices/taskApiSlice";
import { useGetSettingsQuery } from "../../redux/slices/settingsApiSlice";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { data: settings } = useGetSettingsQuery();
  const { user } = useSelector((state) => state.auth);
  const canEdit = user?.role === "ADMIN" || settings?.data?.allowUsersEditTasks === "true" || settings?.data?.allowUsersEditTasks === true;
  const canDelete = user?.role === "ADMIN" || settings?.data?.allowUsersDeleteTasks === "true" || settings?.data?.allowUsersDeleteTasks === true;

  const editClick = (task) => {
    setSelectedTask(task);
    setOpenEdit(true);
  };

  const [trashTask] = useTrashTaskMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const deleteHandler = async () => {
    try {
      await trashTask(selected).unwrap();
      toast.success("ย้ายงานลงถังขยะเรียบร้อยแล้ว");
      setOpenDialog(false);
    } catch (error) {
      toast.error(error?.data?.message || "เกิดข้อผิดพลาดในการลบงาน");
    }
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-black  text-left">
        <th className="py-2">ชื่องาน</th>
        <th className="py-2">ความสำคัญ</th>
        <th className="py-2 hidden md:table-cell line-clamp-1">สร้างเมื่อ</th>
        <th className="py-2 hidden md:table-cell">ไฟล์แนบ</th>
        <th className="py-2 hidden sm:table-cell">ทีม</th>
        {(canEdit || canDelete) && <th className="py-2 text-right">จัดการ</th>}
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => {
    const priority = task.priority?.toLowerCase();
    const stage = task.stage?.toLowerCase()?.replace("_", " ");

    return (
      <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
        <td className="py-2">
          <div className="flex items-center gap-2">
            <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[stage])} />
            <p className="w-full line-clamp-2 text-base text-black">
              {task?.title}
            </p>
          </div>
        </td>

        <td className="py-2">
          <div className={"flex gap-1 items-center"}>
            <span className={clsx("text-lg", PRIOTITYSTYELS[priority])}>
              {ICONS[priority]}
            </span>
            <span className="capitalize line-clamp-1">
              ความสำคัญ {PRIORITY_THAI[priority] || task?.priority}
            </span>
          </div>
        </td>

        <td className="py-2 hidden md:table-cell">
          <span className="text-sm text-gray-600">
            {formatThaiDateTime(task?.date)}
          </span>
        </td>

        <td className="py-2 hidden md:table-cell">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400">
              <FaList />
              <span>0/{task?.subTasks?.length}</span>
            </div>
          </div>
        </td>

        <td className="py-2 hidden sm:table-cell">
          <div className="flex">
            {task?.team?.map((m, index) => (
              <div
                key={m?._id || index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS?.length],
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </td>

        {(canEdit || canDelete) && (
          <td className="py-2 flex gap-2 md:gap-4 justify-end ">
           
            {canEdit && (
              <Button
                className="text-blue-500 hover:text-blue-600 sm:px-0 text-sm md:text-base"
                label={<FaRegEdit  size={25} />}
                type="button"
                onClick={() => editClick(task)}
              />
            )}
            

            {canDelete && (
              <Button
                className="text-red-600 hover:text-red-500 sm:px-0 text-sm md:text-base"
                label={<FaTrash size={25} />}
                type="button"
                onClick={() => deleteClicks(task._id)}
              />
            )}
          </td>
        )}
      </tr>
    );
  };

  return (
    <>
      <div className="bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
        <div className="w-full overflow-visible">
          <table className="w-full ">
            <TableHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={task?._id || index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TODO */}
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selectedTask}
        key={selectedTask ? selectedTask._id : "new"}
      />
    </>
  );
};

export default Table;
