import React, { useState } from "react";
import Button from "./Button";
import Loader from "./Loader";
import ConfirmatioDialog from "./Dialogs";
import AddPosition from "./AddPosition";
import {
  useGetPositionsQuery,
  useDeletePositionMutation,
} from "../redux/slices/positionApiSlice";
import { toast } from "sonner";
import { IoMdAdd } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
const PositionsTable = () => {
  const { data, isLoading, error } = useGetPositionsQuery();
  const [deletePosition] = useDeletePositionMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const positionsList = data?.data || [];

  const deleteHandler = async () => {
    try {
      await deletePosition(selected).unwrap();
      toast.success("ลบตำแหน่งสำเร็จ!");
      setOpenDialog(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "ลบตำแหน่งไม่สำเร็จ");
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (position) => {
    setSelected(position);
    setOpen(true);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">ชื่อตำแหน่ง</th>
        <th className="py-2">รายละเอียด</th>
        <th className="py-2 text-right">การจัดการ</th>
      </tr>
    </thead>
  );

  const TableRow = ({ position }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2 font-medium">{position.name}</td>
      <td className="p-2">{position.description || "-"}</td>

      <td className="p-2 flex gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
          label={<FaRegEdit size={25} />}
          type="button"
          onClick={() => editClick(position)}
        />
        <Button
          className="text-red-600 hover:text-red-500 font-semibold sm:px-0"
          label={<FaTrash size={25} />}
          type="button"
          onClick={() => deleteClick(position.id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full">
        <div className="flex justify-end mb-4">
          <Button
            label="เพิ่มตำแหน่ง"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5 px-4 font-semibold text-sm hover:bg-blue-700 transition-colors"
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          />
        </div>

        {isLoading ? (
          <div className="w-full py-20 flex items-center justify-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="w-full py-10 text-center text-red-500 font-semibold">
            Failed to load positions: {error?.data?.message || "Connection error"}
          </div>
        ) : (
          <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
            <div className="overflow-x-auto">
              <table className="w-full mb-5">
                <TableHeader />
                <tbody>
                  {positionsList.map((pos) => (
                    <TableRow key={pos.id} position={pos} />
                  ))}
                  {positionsList.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-500">
                        ไม่พบข้อมูลตำแหน่ง
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AddPosition
        open={open}
        setOpen={setOpen}
        positionData={selected}
        key={selected ? `edit-${selected.id}` : "add-position"}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
        msg="คุณต้องการลบตำแหน่งนี้ใช่หรือไม่? การลบจะไม่สามารถกู้คืนได้"
      />
    </>
  );
};

export default PositionsTable;
