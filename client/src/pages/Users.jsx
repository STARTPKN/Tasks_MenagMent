import React, { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog from "../components/Dialogs";
import AddUser from "../components/AddUser";
import Loader from "../components/Loader";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "../redux/slices/userApiSlice";
import { toast } from "sonner";

const Users = () => {
  const { data, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [toggleUserStatus] = useToggleUserStatusMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const usersList = data?.data || [];

  const deleteHandler = async () => {
    try {
      await deleteUser(selected).unwrap();
      toast.success("User deleted successfully!");
      setOpenDialog(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to delete user");
    }
  };

  const userStatusClick = async (user) => {
    try {
      await toggleUserStatus(user.id).unwrap();
      toast.success(`User ${user.isActive ? "disabled" : "activated"} successfully!`);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to update status");
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

  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Title</th>
        <th className='py-2'>Email</th>
        <th className='py-2'>Role</th>
        <th className='py-2'>Active</th>
        <th className='py-2 text-right'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-400/10'>
      <td className='p-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700 font-semibold'>
            <span className='text-xs md:text-sm text-center'>
              {getInitials(user.name)}
            </span>
          </div>
          {user.name}
        </div>
      </td>

      <td className='p-2'>{user.title}</td>
      <td className='p-2'>{user.email}</td>
      <td className='p-2'>{user.role}</td>

      <td className='p-2'>
        <button
          onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full text-xs font-semibold hover:opacity-85 transition-opacity",
            user?.isActive ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </button>
      </td>

      <td className='p-2 flex gap-4 justify-end'>
        <Button
          className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
          label='Edit'
          type='button'
          onClick={() => editClick(user)}
        />

        <Button
          className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
          label='Delete'
          type='button'
          onClick={() => deleteClick(user.id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className='w-full md:px-1 px-0 mb-6'>
        <div className='flex items-center justify-between mb-8'>
          <Title title='Team Members' />
          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5 px-4 font-semibold text-sm hover:bg-blue-700 transition-colors'
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          />
        </div>

        {isLoading ? (
          <div className='w-full py-20 flex items-center justify-center'>
            <Loader />
          </div>
        ) : error ? (
          <div className='w-full py-10 text-center text-red-500 font-semibold'>
            Failed to load users: {error?.data?.message || "Connection error"}
          </div>
        ) : (
          <div className='bg-white px-2 md:px-4 py-4 shadow-md rounded'>
            <div className='overflow-x-auto'>
              <table className='w-full mb-5'>
                <TableHeader />
                <tbody>
                  {usersList.map((user) => (
                    <TableRow key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={selected ? `edit-${selected.id}` : "add-user"}
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
