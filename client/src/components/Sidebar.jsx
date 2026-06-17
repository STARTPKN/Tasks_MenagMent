import React from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdOutlineAssignment,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";

const linkData = [
  {
    label: "แดชบอร์ด",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "งานทั้งหมด",
    link: "tasks",
    icon: <FaTasks />,
  },
   {
    label: "ที่ต้องทำ",
    link: "todo/todo",
    icon: <MdOutlineAssignment />,
  },
    {
    label: "กำลังดำเนินการ",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "เสร็จสิ้น",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },

 
  {
    label: "จัดการทีมงาน",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "ถังขยะ",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];

  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    const isActive = path === el.link.split("/")[0];
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          "w-full flex gap-3 px-4 py-2.5 rounded-xl items-center text-base transition-all duration-200 font-medium",
          isActive
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
        )}
      >
        <span className={clsx("text-xl", isActive ? "text-white" : "text-gray-500")}>
          {el.icon}
        </span>
        <span>{el.label}</span>
      </Link>
    );
  };
  return (
    <div className='w-full h-full flex flex-col gap-6 p-5'>
      <h1 className='flex gap-2 items-center px-2'>
        <p className='bg-blue-600 p-2 rounded-xl shadow-md shadow-blue-600/20'>
          <MdOutlineAddTask className='text-white text-2xl font-black' />
        </p>
        <span className='text-2xl font-bold text-gray-900 tracking-tight'>TaskMe</span>
      </h1>

      <div className='flex-1 flex flex-col gap-y-2 py-8'>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      {user?.isAdmin && (
        <div className='w-full border-t border-gray-100 pt-4'>
          <Link
            to='/settings'
            onClick={closeSidebar}
            className='w-full flex gap-3 px-4 py-2.5 rounded-xl items-center text-base font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200'
          >
            <MdSettings className='text-xl text-gray-500' />
            <span>ตั้งค่า</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

