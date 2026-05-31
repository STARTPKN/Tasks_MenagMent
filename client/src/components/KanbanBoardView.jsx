import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import TaskTitle from "./TaskTitle";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useUpdateTaskMutation } from "../redux/slices/taskApiSlice";
import { toast } from "sonner";

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const KanbanBoardView = ({ tasks, canCreateTask, onAddTask }) => {
  const [columns, setColumns] = useState({
    todo: [],
    "in progress": [],
    completed: [],
  });

  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    setColumns({
      todo: tasks.filter((t) => t.stage === "todo"),
      "in progress": tasks.filter((t) => t.stage === "in progress"),
      completed: tasks.filter((t) => t.stage === "completed"),
    });
  }, [tasks]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceItems = Array.from(columns[sourceCol]);
    const destItems = sourceCol === destCol ? sourceItems : Array.from(columns[destCol]);

    const [movedItem] = sourceItems.splice(source.index, 1);
    const clonedMovedItem = { ...movedItem, stage: destCol };

    destItems.splice(destination.index, 0, clonedMovedItem);

    setColumns({
      ...columns,
      [sourceCol]: sourceItems,
      [destCol]: destItems,
    });

    if (sourceCol !== destCol) {
      try {
        const backendStage = destCol === "in progress" ? "IN_PROGRESS" : destCol.toUpperCase();
        
        await updateTask({
          id: clonedMovedItem._id,
          stage: backendStage,
        }).unwrap();
      } catch (error) {
        toast.error("อัปเดตสถานะงานไม่สำเร็จ");
        // Revert on error can be handled here if needed
      }
    }
  };

  const renderColumn = (stageId, title, className) => (
    <div className="flex flex-col gap-4">
      <TaskTitle
        label={title}
        className={className}
        onClick={canCreateTask ? () => onAddTask(title) : undefined}
      />
      <Droppable droppableId={stageId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex flex-col gap-4 mt-2 min-h-[200px] pb-10 ${
              snapshot.isDraggingOver ? "bg-gray-50 rounded-lg p-2" : ""
            }`}
          >
            {columns[stageId].map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transition-all duration-200 ${snapshot.isDragging ? "scale-105 shadow-xl opacity-90" : ""}`}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {columns[stageId].length === 0 && !snapshot.isDraggingOver && (
              <p className="text-gray-400 text-sm text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">ลากงานมาวางที่นี่</p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full py-4 grid grid-cols-1 md:grid-cols-3 gap-4 2xl:gap-10">
        {renderColumn("todo", "สิ่งที่ต้องทำ", TASK_TYPE.todo)}
        {renderColumn("in progress", "กำลังดำเนินการ", TASK_TYPE["in progress"])}
        {renderColumn("completed", "เสร็จสิ้น", TASK_TYPE.completed)}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoardView;
