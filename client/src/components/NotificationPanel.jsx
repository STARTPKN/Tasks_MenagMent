import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineAssignment } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../redux/slices/notificationApiSlice";

const ICONS = {
  assigned: (
    <MdOutlineAssignment className='h-5 w-5 text-blue-500 group-hover:text-blue-700' />
  ),
  activity: (
    <BiSolidMessageRounded className='h-5 w-5 text-emerald-500 group-hover:text-emerald-700' />
  ),
  alert: (
    <HiBellAlert className='h-5 w-5 text-amber-500 group-hover:text-amber-700' />
  ),
};

const TYPE_LABELS = {
  assigned: "มอบหมายงาน",
  activity: "กิจกรรม",
  alert: "แจ้งเตือน",
};

const NotificationPanel = () => {
  const navigate = useNavigate();

  const { data: notificationsResponse } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // poll ทุก 30 วินาที
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const notifications = notificationsResponse?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleViewNotification = async (item, close) => {
    try {
      // Mark as read
      if (!item.isRead) {
        await markAsRead(item.id);
      }
      // Navigate to task detail
      if (item.task?.id) {
        navigate(`/task/${item.task.id}`);
      }
      close();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <>
      <Popover className='relative'>
        <Popover.Button className='inline-flex items-center outline-none'>
          <div className='w-8 h-8 flex items-center justify-center text-gray-800 relative'>
            <IoIosNotificationsOutline className='text-2xl' />
            {unreadCount > 0 && (
              <span className='absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
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
          <Popover.Panel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4'>
            {({ close }) => (
              <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                {/* Header */}
                <div className='px-4 pt-4 pb-2 border-b border-gray-100'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-base font-semibold text-gray-900'>
                      การแจ้งเตือน
                    </h3>
                    {unreadCount > 0 && (
                      <span className='inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700'>
                        {unreadCount} ใหม่
                      </span>
                    )}
                  </div>
                </div>

                {/* Notification List */}
                <div className='p-2 max-h-[400px] overflow-y-auto'>
                  {notifications.length > 0 ? (
                    notifications.slice(0, 10).map((item, index) => (
                      <div
                        key={item.id || index}
                        className={`group relative flex gap-x-4 rounded-lg p-3 cursor-pointer transition-colors duration-150 ${
                          !item.isRead
                            ? "bg-blue-50/60 hover:bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleViewNotification(item, close)}
                      >
                        <div
                          className={`mt-1 h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-lg ${
                            !item.isRead
                              ? "bg-white shadow-sm ring-1 ring-gray-200"
                              : "bg-gray-100 group-hover:bg-white"
                          }`}
                        >
                          {ICONS[item.type] || ICONS["alert"]}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2'>
                            <span
                              className={`text-xs font-medium capitalize ${
                                !item.isRead
                                  ? "text-blue-700"
                                  : "text-gray-500"
                              }`}
                            >
                              {TYPE_LABELS[item.type] || item.type}
                            </span>
                            <span className='text-xs text-gray-400'>
                              {moment(item.createdAt).fromNow()}
                            </span>
                            {!item.isRead && (
                              <span className='ml-auto h-2 w-2 rounded-full bg-blue-500 flex-shrink-0' />
                            )}
                          </div>
                          <p
                            className={`line-clamp-2 mt-0.5 text-sm ${
                              !item.isRead
                                ? "text-gray-800 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {item.text}
                          </p>
                          {item.task?.title && (
                            <p className='mt-1 text-xs text-gray-400 truncate'>
                              {item.task.title}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='flex flex-col items-center justify-center py-10 px-4'>
                      <IoIosNotificationsOutline className='text-4xl text-gray-300 mb-2' />
                      <p className='text-gray-400 text-sm'>
                        ยังไม่มีการแจ้งเตือน
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                {notifications.length > 0 && (
                  <div className='grid grid-cols-2 divide-x border-t border-gray-100 bg-gray-50'>
                    <button
                      onClick={() => close()}
                      className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors'
                    >
                      ปิด
                    </button>
                    <button
                      onClick={handleMarkAllRead}
                      className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100 hover:text-blue-700 transition-colors'
                    >
                      อ่านทั้งหมด
                    </button>
                  </div>
                )}
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default NotificationPanel;
