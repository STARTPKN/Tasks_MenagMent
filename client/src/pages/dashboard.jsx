import React from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { useGetDashboardStatsQuery } from "../redux/slices/taskApiSlice";
import Loading from "../components/Loader";
import clsx from "clsx";
import { Chart } from "../components/Chart";
import { TaskTable, UserTable } from "../components/dashboard";
import { useSelector } from "react-redux";
import { useGetUsersQuery } from "../redux/slices/userApiSlice";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: usersData } = useGetUsersQuery(undefined, { skip: !user?.isAdmin });
  const { data: dashboardData, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loading />
      </div>
    );
  }

  const summaryData = dashboardData?.data || {};
  const totals = summaryData.tasks || {};

  const stats = [
    {
      _id: "1",
      label: "งานทั้งหมด",
      total: summaryData?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "งานที่เสร็จแล้ว",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "งานที่กำลังดำเนินการ",
      total: totals["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "สิ่งที่ต้องทำ",
      total: totals["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]",
    },
  ];

  const Card = ({ label, count, bg, icon }) => {
    return (
      <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between">
        <div className="h-full flex flex-1 flex-col justify-between">
          <p className="text-base text-gray-600">{label}</p>
          <span className="text-2xl font-semibold">{count}</span>
          <span className="text-sm text-gray-400">{"110 เดือนที่แล้ว"}</span>
        </div>

        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg,
          )}
        >
          {icon}
        </div>
      </div>
    );
  };
  return (
    <div className="h-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>

      <div className="w-full bg-white my-16 p-4 rounded shadow-sm">
        <h4 className="text-xl text-gray-600 font-semibold mb-10 ">
          กราฟแยกตามความสำคัญ
        </h4>
        <Chart data={summaryData?.priorities} />
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
        {/* /left */}

        <TaskTable tasks={summaryData?.last10Task || []} isFullWidth={!user?.isAdmin} />

        {/* /right */}

        {user?.isAdmin && (
          <UserTable users={usersData?.data || []} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
