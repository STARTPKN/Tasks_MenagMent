import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useUpdateProfileMutation } from "../redux/slices/authApiSlice";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../redux/slices/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "sonner";
import { useGetPositionsQuery } from "../redux/slices/positionApiSlice";

const AddUser = ({ open, setOpen, userData, isProfile = false }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

  const { data: positionsData, isLoading: isLoadingPositions } = useGetPositionsQuery();
  const positionsList = positionsData?.data || [];

  const isLoading = isCreatingUser || isUpdatingUser || isUpdatingProfile;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  // Reset form when userData changes or modal opens
  useEffect(() => {
    if (open) {
      reset(userData || {});
    }
  }, [userData, open, reset]);

  const handleOnSubmit = async (data) => {
    try {
      if (isProfile) {
        // Self-Profile Update: only send name and title
        const res = await updateProfile({
          name: data.name,
          title: data.title || userData?.title,
        }).unwrap();

        const updatedUser = res?.data || res;

        // Sync Redux auth state (update profile info, keep token)
        dispatch(
          setCredentials({
            user: updatedUser,
            token: user.token,
          }),
        );

        toast.success("Profile updated successfully!");
      } else if (userData) {
        // Admin Update User
        await updateUser({
          id: userData.id,
          name: data.name,
          title: data.title,
          email: data.email,
          role: data.role,
        }).unwrap();
        toast.success("User updated successfully!");
      } else {
        // Admin Create User
        await createUser({
          name: data.name,
          title: data.title,
          email: data.email,
          role: data.role,
          password: "password123", // default password
        }).unwrap();
        toast.success("New user created successfully!");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "An error occurred");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {isProfile
              ? "แก้ไขโปรไฟล์"
              : userData
                ? "แก้ไขข้อมูลผู้ใช้"
                : "เพิ่มผู้ใช้ใหม่"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="ชื่อ-นามสกุล"
              type="text"
              name="name"
              label="ชื่อ-นามสกุล"
              className="w-full rounded"
              register={register("name", {
                required: "กรุณาระบุชื่อ-นามสกุล!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            
            <div className="w-full">
              <label className="text-slate-900 dark:text-gray-500 mb-1 block text-sm">ตำแหน่ง</label>
              {isLoadingPositions ? (
                <p className="text-sm text-gray-500">กำลังโหลดตำแหน่ง...</p>
              ) : (
                <select
                  name="title"
                  disabled={isProfile && user?.role === "USER"}
                  {...register("title", {
                    required: (isProfile && user?.role === "USER") ? false : "กรุณาระบุตำแหน่ง!",
                  })}
                  className="w-full rounded px-3 py-2 border border-gray-300 text-sm focus:ring-1 focus:ring-blue-600 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                >
                  <option value="">-- เลือกตำแหน่ง --</option>
                  {positionsList.map((pos) => (
                    <option key={pos.id} value={pos.name}>
                      {pos.name}
                    </option>
                  ))}
                  {userData?.title && !positionsList.find(p => p.name === userData.title) && (
                    <option value={userData.title}>{userData.title} (ข้อมูลเดิม)</option>
                  )}
                </select>
              )}
              {errors.title && (
                <span className="text-xs text-[#f64949fe] mt-0.5 block">{errors.title.message}</span>
              )}
            </div>

            <Textbox
              placeholder="อีเมล"
              type="email"
              name="email"
              label="อีเมล"
              className="w-full rounded disabled:opacity-60"
              register={register("email", {
                required: "กรุณาระบุอีเมล!",
              })}
              error={errors.email ? errors.email.message : ""}
              disabled={isProfile}
            />

            <Textbox
              placeholder="บทบาท"
              type="text"
              name="role"
              label="บทบาท"
              className="w-full rounded disabled:opacity-60"
              register={register("role", {
                required: "กรุณาระบุบทบาท!",
              })}
              error={errors.role ? errors.role.message : ""}
              disabled={isProfile}
            />
          </div>

          {isLoading ? (
            <div className="py-5 flex justify-center">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-6 flex justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-100 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-full"
                onClick={() => setOpen(false)}
                label="ยกเลิก"
              />
              <Button
                type="submit"
                className="bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 rounded-full"
                label="บันทึก"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
