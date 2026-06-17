import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { getInitials } from "../utils";

const UserInfo = ({ user }) => {
  return (
    <div className="w-full h-full">
      <Popover className='relative w-full h-full'>
        {/* {({ open }) => ( */}
        <>
          <Popover.Button className='w-full h-full group flex items-center justify-center outline-none'>
            <span>{getInitials(user?.name)}</span>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <Popover.Panel className='absolute z-50 mt-2 w-max -translate-x-3/4 px-4 sm:px-0 '>
              <div className='flex items-center gap-4 rounded-lg shadow-lg bg-white p-4 border border-gray-100'>
                <div className='w-14 h-14 bg-blue-600 rounded-full text-white flex items-center justify-center text-xl'>
                  <span className='text-center font-bold'>
                    {getInitials(user?.name)}
                  </span>
                </div>
                <div className='flex flex-col gap-y-1 text-left'>
                  <p className='text-black text-base font-bold'>{user?.name}</p>
                  <span className='text-sm text-gray-500'>{user?.title}</span>
                  <span className='text-sm text-blue-500'>
                    {user?.email ?? "email@example.com"}
                  </span>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
        {/* )} */}
      </Popover>
    </div>
  );
};

export default UserInfo;
