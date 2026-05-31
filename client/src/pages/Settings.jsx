import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Switch } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import Title from "../components/Title";
import Button from "../components/Button";
import Loader from "../components/Loader";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../redux/slices/settingsApiSlice";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: settings, isLoading, refetch } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      allowUserRegistration: "true",
      allowUsersCreateTasks: "true",
      allowUsersEditTasks: "true",
      allowUsersDeleteTasks: "true",
      maxSubTasks: 5,
      enableFileUpload: "true",
    }
  });

  useEffect(() => {
    if (settings?.data) {
      reset({
        allowUserRegistration: settings.data.allowUserRegistration,
        allowUsersCreateTasks: settings.data.allowUsersCreateTasks,
        allowUsersEditTasks: settings.data.allowUsersEditTasks,
        allowUsersDeleteTasks: settings.data.allowUsersDeleteTasks,
        maxSubTasks: settings.data.maxSubTasks,
        enableFileUpload: settings.data.enableFileUpload,
      });
    }
  }, [settings, reset]);

  // Protect the route - only admins can access
  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  const submitHandler = async (data) => {
    try {
      await updateSettings(data).unwrap();
      toast.success("บันทึกการตั้งค่าเรียบร้อยแล้ว");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  if (isLoading) {
    return (
      <div className="py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 md:p-8 bg-gray-50/50">
      <Title title="ตั้งค่าระบบ" />
      
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-full max-w-4xl bg-white shadow-xl shadow-gray-200/40 rounded-2xl p-6 md:p-10 space-y-10"
      >
        {/* General Settings */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3 mb-6">
            ข้อมูลทั่วไป
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">อนุญาตให้ลงทะเบียนสมาชิกใหม่</label>
              <Controller
                control={control}
                name="allowUserRegistration"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    checked={value === "true"}
                    onChange={(checked) => onChange(checked ? "true" : "false")}
                    className={`${
                      value === "true" ? "bg-blue-600" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">เปิด/ปิด การลงทะเบียน</span>
                    <span
                      className={`${
                        value === "true" ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                )}
              />
            </div>
          </div>
        </div>

        {/* Task Preferences */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3 mb-6">
            การตั้งค่างาน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">อนุญาตให้สมาชิกทั่วไปสร้างงานได้</label>
              <Controller
                control={control}
                name="allowUsersCreateTasks"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    checked={value === "true"}
                    onChange={(checked) => onChange(checked ? "true" : "false")}
                    className={`${
                      value === "true" ? "bg-blue-600" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">เปิด/ปิด สิทธิ์สร้างงาน</span>
                    <span
                      className={`${
                        value === "true" ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">จำนวนงานย่อยสูงสุดต่อหนึ่งงาน</label>
              <input
                type="number"
                min="1"
                max="100"
                className=" w-40 border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-gray-700 bg-gray-50 focus:bg-white"
                {...register("maxSubTasks", { required: "กรุณาระบุจำนวนสูงสุด" })}
              />
              {errors.maxSubTasks && (
                <span className="text-red-500 text-xs mt-1">{errors.maxSubTasks.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">เปิดใช้งานการอัปโหลดไฟล์</label>
              <Controller
                control={control}
                name="enableFileUpload"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    checked={value === "true"}
                    onChange={(checked) => onChange(checked ? "true" : "false")}
                    className={`${
                      value === "true" ? "bg-blue-600" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">เปิด/ปิด การอัปโหลดไฟล์</span>
                    <span
                      className={`${
                        value === "true" ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">อนุญาตให้สมาชิกทั่วไปแก้ไขงานได้</label>
              <Controller
                control={control}
                name="allowUsersEditTasks"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    checked={value === "true"}
                    onChange={(checked) => onChange(checked ? "true" : "false")}
                    className={`${
                      value === "true" ? "bg-blue-600" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">เปิด/ปิด สิทธิ์แก้ไขงาน</span>
                    <span
                      className={`${
                        value === "true" ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">อนุญาตให้สมาชิกทั่วไปลบงานได้</label>
              <Controller
                control={control}
                name="allowUsersDeleteTasks"
                render={({ field: { onChange, value } }) => (
                  <Switch
                    checked={value === "true"}
                    onChange={(checked) => onChange(checked ? "true" : "false")}
                    className={`${
                      value === "true" ? "bg-blue-600" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">เปิด/ปิด สิทธิ์ลบงาน</span>
                    <span
                      className={`${
                        value === "true" ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                )}
              />
            </div>
          </div>
        </div>



        <div className="flex justify-end pt-6 border-t border-gray-100">
          <Button
            type="submit"
            disabled={!isDirty || isUpdating}
            className={`px-8 py-3 rounded-xl font-medium shadow-md transition-all duration-200 ${
              !isDirty
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/30"
            }`}
            label={isUpdating ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
          />
        </div>
      </form>
    </div>
  );
};

export default Settings;
