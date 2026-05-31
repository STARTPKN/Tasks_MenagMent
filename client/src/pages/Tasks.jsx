import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { TASK_TYPE_THAI } from "../utils";
import { useGetTasksQuery } from "../redux/slices/taskApiSlice";
import { useGetSettingsQuery } from "../redux/slices/settingsApiSlice";
import { useSelector } from "react-redux";

const TABS = [
  { title: "มุมมองกระดาน", icon: <MdGridView /> },
  { title: "มุมมองรายการ", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

// Map backend stage (e.g. "TODO", "IN_PROGRESS") to UI stage (e.g. "todo", "in progress")
const mapStageToUI = (stage) => {
  const s = stage?.toUpperCase();
  if (s === "TODO") return "todo";
  if (s === "IN_PROGRESS") return "in progress";
  if (s === "COMPLETED") return "completed";
  return stage?.toLowerCase() || "todo";
};

const Tasks = () => {
  const params = useParams();
  const { data: tasksData, isLoading } = useGetTasksQuery();
  const { data: settings } = useGetSettingsQuery();
  const { user } = useSelector((state) => state.auth);

  const canCreateTask = user?.role === "ADMIN" || settings?.data?.allowUsersCreateTasks === "true" || settings?.data?.allowUsersCreateTasks === true;

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [initialStage, setInitialStage] = useState(null);

  const status = params?.status || "";

  const handleAddTaskClick = (stageName) => {
    setInitialStage(stageName);
    setOpen(true);
  };

  // Normalize tasks from DB: map stage to lowercase UI format
  const allTasks = (tasksData?.data || []).map((task) => ({
    ...task,
    _id: task.id || task._id,
    stage: mapStageToUI(task.stage),
    priority: task.priority?.toLowerCase() || "normal",
  }));

  const filteredTasks = status
    ? allTasks.filter((task) => task.stage.toLowerCase() === status.toLowerCase())
    : allTasks;

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `งานสถานะ: ${TASK_TYPE_THAI[status] || status}` : "งานทั้งหมด"} />

        {!status && canCreateTask && (
          <Button
            onClick={() => {
              setInitialStage(null);
              setOpen(true);
            }}
            label='สร้างงาน'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
            <TaskTitle
              label='สิ่งที่ต้องทำ'
              className={TASK_TYPE.todo}
              onClick={canCreateTask ? () => handleAddTaskClick("สิ่งที่ต้องทำ") : undefined}
            />
            <TaskTitle
              label='กำลังดำเนินการ'
              className={TASK_TYPE["in progress"]}
              onClick={canCreateTask ? () => handleAddTaskClick("กำลังดำเนินการ") : undefined}
            />
            <TaskTitle
              label='เสร็จสิ้น'
              className={TASK_TYPE.completed}
              onClick={canCreateTask ? () => handleAddTaskClick("เสร็จสิ้น") : undefined}
            />
          </div>
        )}

        {selected !== 1 ? (
          <BoardView tasks={filteredTasks} />
        ) : (
          <div className='w-full'>
            <Table tasks={filteredTasks} />
          </div>
        )}
      </Tabs>

      <AddTask
        open={open}
        setOpen={setOpen}
        initialStage={initialStage}
        key={open ? (initialStage || "generic") : "closed"}
      />
    </div>
  );
};

export default Tasks;
