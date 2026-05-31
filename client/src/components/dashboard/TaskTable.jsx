import React from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import clsx from "clsx";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, PRIORITY_THAI, formatThaiDateTime } from "../../utils";
import UserInfo from "../UserInfo";

const TaskTable = ({ tasks, isFullWidth }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300 '>
      <tr className='text-black text-left'>
        <th className='py-2'>ชื่องาน</th>
        <th className='py-2'>ความสำคัญ</th>
        <th className='py-2'>ทีม</th>
        <th className='py-2 hidden md:block'>สร้างเมื่อ</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => {
    const priority = task.priority?.toLowerCase();
    const stage = task.stage?.toLowerCase()?.replace("_", " ");

    return (
      <tr className='border-b border-gray-300 text-gray-600 hover:bg-gray-300/10'>
        <td className='py-2'>
          <div className='flex items-center gap-2'>
            <div
              className={clsx("w-4 h-4 rounded-full", TASK_TYPE[stage])}
            />

            <p className='text-base text-black'>{task.title}</p>
          </div>
        </td>

        <td className='py-2'>
          <div className='flex gap-1 items-center'>
            <span className={clsx("text-lg", PRIOTITYSTYELS[priority])}>
              {ICONS[priority]}
            </span>
            <span className='capitalize'>{PRIORITY_THAI[priority] || task.priority}</span>
          </div>
        </td>

        <td className='py-2'>
          <div className='flex'>
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                  BGS[index % BGS.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </td>
        <td className='py-2 hidden md:block'>
          <span className='text-base text-gray-600'>
            {formatThaiDateTime(task?.date)}
          </span>
        </td>
      </tr>
    );
  };
  return (
    <>
      <div
        className={clsx(
          "bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded",
          isFullWidth ? "w-full" : "w-full md:w-2/3"
        )}
      >
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks?.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TaskTable;
