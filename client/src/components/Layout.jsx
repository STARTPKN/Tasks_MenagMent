import { Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { setOpenSidebar } from "../redux/slices/authSlice";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <div className='w-64 h-screen bg-white sticky top-0 hidden md:block flex-shrink-0 border-r border-gray-100'>
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className='flex-1 overflow-y-auto'>
        <Navbar />

        <div className='p-4 2xl:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/log-in' state={{ from: location }} replace />
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter='transition-opacity duration-700'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-700'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={clsx(
              "fixed inset-0 z-50 md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={() => closeSidebar()}
          >
            <div className='bg-white w-3/4 h-full shadow-2xl flex flex-col'>
              <div className='w-full flex justify-end px-5 mt-5'>
                <button
                  onClick={() => closeSidebar()}
                  className='flex justify-end items-end p-2 text-gray-500 hover:text-gray-900 transition-colors'
                >
                  <IoClose size={25} />
                </button>
              </div>

              <div className='-mt-12 flex-1'>
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

export default Layout;
