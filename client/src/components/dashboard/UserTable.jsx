import React from "react";
import clsx from "clsx";
import moment from "moment";
import { getInitials, ROLE_THAI } from "../../utils";
import { RiUserFollowFill, RiUserForbidFill } from "react-icons/ri";

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className="text-black  text-left">
        <th className="py-2">ชื่อ-นามสกุล</th>
        <th className="py-2">สถานะ</th>
        <th className="py-2">สร้างเมื่อ</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => {
    const isActive = user?.isActive === true || user?.isActive === "true";

    return (
      <tr className="border-b border-gray-200  text-gray-600 hover:bg-gray-400/10">
        <td className="py-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700">
              <span className="text-center">{getInitials(user?.name)}</span>
            </div>

            <div>
              <p> {user.name}</p>
              <span className="text-xs text-black">{ROLE_THAI[user?.title] || user?.title}</span>
            </div>
          </div>
        </td>

        <td>
          <div
            className={clsx(
              "inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium",
              isActive ? "bg-green-700 text-white" : "bg-red-500 text-white",
            )}
          >
            {isActive ? <RiUserFollowFill /> : <RiUserForbidFill />}
          </div>
        </td>
        <td className="py-2 text-sm">{moment(user?.createdAt).fromNow()}</td>
      </tr>
    );
  };

  return (
    <div className="w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded">
      <table className="w-full mb-5">
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={index + user?._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
