import React from "react";
import TaskCard from "./TaskCard";
import TaskTitle from "./TaskTitle";
import { TASK_TYPE_THAI } from "../utils";

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const KanbanBoardView = ({ tasks, canCreateTask, onAddTask }) => {
  const todoTasks = tasks.filter((t) => t.stage === "todo");
  const inProgressTasks = tasks.filter((t) => t.stage === "in progress");
  const completedTasks = tasks.filter((t) => t.stage === "completed");

  return (
    <div className="w-full py-4 grid grid-cols-1 md:grid-cols-3 gap-4 2xl:gap-10">
      {/* TODO Column */}
      <div className="flex flex-col gap-4">
        <TaskTitle
          label="สิ่งที่ต้องทำ"
          className={TASK_TYPE.todo}
          onClick={canCreateTask ? () => onAddTask("สิ่งที่ต้องทำ") : undefined}
        />
        <div className="flex flex-col gap-4 mt-2">
          {todoTasks.map((task, index) => (
            <TaskCard task={task} key={index} />
          ))}
          {todoTasks.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">ไม่มีงาน</p>
          )}
        </div>
      </div>

      {/* IN PROGRESS Column */}
      <div className="flex flex-col gap-4">
        <TaskTitle
          label="กำลังดำเนินการ"
          className={TASK_TYPE["in progress"]}
          onClick={canCreateTask ? () => onAddTask("กำลังดำเนินการ") : undefined}
        />
        <div className="flex flex-col gap-4 mt-2">
          {inProgressTasks.map((task, index) => (
            <TaskCard task={task} key={index} />
          ))}
          {inProgressTasks.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">ไม่มีงาน</p>
          )}
        </div>
      </div>

      {/* COMPLETED Column */}
      <div className="flex flex-col gap-4">
        <TaskTitle
          label="เสร็จสิ้น"
          className={TASK_TYPE.completed}
          onClick={canCreateTask ? () => onAddTask("เสร็จสิ้น") : undefined}
        />
        <div className="flex flex-col gap-4 mt-2">
          {completedTasks.map((task, index) => (
            <TaskCard task={task} key={index} />
          ))}
          {completedTasks.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">ไม่มีงาน</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoardView;
