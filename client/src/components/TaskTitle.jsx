import clsx from "clsx";
import React from "react";
import { IoMdAdd } from "react-icons/io";

const TaskTitle = ({ label, className, onClick }) => {
  return (
    <div className='w-full h-10 md:h-12 px-2 md:px-4 rounded bg-white flex items-center justify-between shadow-sm border border-gray-100'>
      <div className='flex gap-2 items-center'>
        <div className={clsx("w-4 h-4 rounded-full ", className)} />
        <p className='text-sm md:text-base text-gray-700 font-semibold'>{label}</p>
      </div>

      <button
        onClick={onClick}
        className='flex items-center justify-center p-1.5 rounded-full hover:bg-gray-100 active:scale-90 transition-all duration-200 text-gray-500 hover:text-black'
        title={`เพิ่มงานในส่วน ${label}`}
      >
        <IoMdAdd className='text-xl' />
      </button>
    </div>
  );
};

export default TaskTitle;

