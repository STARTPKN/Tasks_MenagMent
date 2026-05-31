import React, { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials, ROLE_THAI } from "../utils";
import clsx from "clsx";
import { FaUserFriends } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import Tabs from "../components/Tabs";
import PositionsTable from "../components/PositionsTable";
import ConfirmatioDialog from "../components/Dialogs";
import AddUser from "../components/AddUser";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import Loader from "../components/Loader";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "../redux/slices/userApiSlice";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const TABS = [
  { title: "สมาชิก", icon: <FaUserFriends /> },
  { title: "ตำแหน่ง", icon: <MdWork /> },
];

const Users = () => {
  const { data, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [toggleUserStatus] = useToggleUserStatusMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const allUsers = data?.data || [];

  // กรองรายชื่อผู้ใช้ตามคำค้นหา
  const usersList = allUsers.filter((user) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();

    // ค้นหาจากชื่อ
    const matchName = user.name?.toLowerCase().includes(lowerSearch);
    // ค้นหาจากตำแหน่ง
    const matchTitle = user.title?.toLowerCase().includes(lowerSearch);
    // ค้นหาจากอีเมล
    const matchEmail = user.email?.toLowerCase().includes(lowerSearch);
    // ค้นหาจากบทบาท (ภาษาอังกฤษและไทย)
    const roleThai = ROLE_THAI[user.role] || "";
    const matchRole = user.role?.toLowerCase().includes(lowerSearch) ||
      roleThai.includes(lowerSearch);
    // ค้นหาจากสถานะ
    const statusText = user.isActive ? "ใช้งานปกติ" : "ระงับใช้งาน";
    const matchStatus = statusText.includes(lowerSearch);

    return matchName || matchTitle || matchEmail || matchRole || matchStatus;
  });

  const deleteHandler = async () => {
    try {
      await deleteUser(selected).unwrap();
      toast.success("ลบผู้ใช้สำเร็จ!");
      setOpenDialog(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "ลบผู้ใช้ไม่สำเร็จ");
    }
  };

  const userStatusClick = async (user) => {
    try {
      await toggleUserStatus(user.id).unwrap();
      toast.success(`อัปเดตสถานะผู้ใช้สำเร็จ!`);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "อัปเดตสถานะไม่สำเร็จ");
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (user) => {
    setSelected(user);
    setOpen(true);
  };

  const changePasswordClick = (user) => {
    setSelected(user);
    setOpenPasswordDialog(true);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">ชื่อ-นามสกุล</th>
        <th className="py-2">ตำแหน่ง</th>
        <th className="py-2">อีเมล</th>
        <th className="py-2">บทบาท</th>
        <th className="py-2">สถานะ</th>
        <th className="py-2 text-right">การจัดการ</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700 font-semibold">
            <span className="text-xs md:text-sm text-center">
              {getInitials(user.name)}
            </span>
          </div>
          {user.name}
        </div>
      </td>

      <td className="p-2">{user.title}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2">{ROLE_THAI[user.role] || user.role}</td>

      <td className="p-2">
        <button
          onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full text-xs font-semibold hover:opacity-85 transition-opacity",
            user?.isActive
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700",
          )}
        >
          {user?.isActive ? "ใช้งานปกติ" : "ระงับใช้งาน"}
        </button>
      </td>

      <td className="p-2 flex gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
          label="แก้ไข"
          type="button"
          onClick={() => editClick(user)}
        />

        <Button
          className="text-yellow-600 hover:text-yellow-500 font-semibold sm:px-0"
          label="เปลี่ยนรหัส"
          type="button"
          onClick={() => changePasswordClick(user)}
        />

        <Button
          className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
          label="ลบ"
          type="button"
          onClick={() => deleteClick(user.id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="ทีม" />
          {selectedTab === 0 && (
            <Button
              label="เพิ่มผู้ใช้"
              icon={<IoMdAdd className="text-lg" />}
              className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5 px-4 font-semibold text-sm hover:bg-blue-700 transition-colors"
              onClick={() => {
                setSelected(null);
                setOpen(true);
              }}
            />
          )}
        </div>

        <Tabs tabs={TABS} setSelected={setSelectedTab}>
          {selectedTab === 0 ? (
            isLoading ? (
              <div className="w-full py-20 flex items-center justify-center">
                <Loader />
              </div>
            ) : error ? (
              <div className="w-full py-10 text-center text-red-500 font-semibold">
                Failed to load users:{" "}
                {error?.data?.message || "Connection error"}
              </div>
            ) : (
              <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
                <div className="overflow-x-auto">
                  <table className="w-full mb-5">
                    <TableHeader />
                    <tbody>
                      {usersList.map((user) => (
                        <TableRow key={user.id} user={user} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            <div className="w-full">
              <PositionsTable />
            </div>
          )}
        </Tabs>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={selected ? `edit-${selected.id}` : "add-user"}
      />

      <ChangePasswordDialog
        open={openPasswordDialog}
        setOpen={setOpenPasswordDialog}
        user={selected}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default Users;
