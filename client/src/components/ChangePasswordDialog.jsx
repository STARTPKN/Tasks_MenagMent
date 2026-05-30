import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useChangeUserPasswordMutation } from "../redux/slices/userApiSlice";
import { toast } from "sonner";

const ChangePasswordDialog = ({ open, setOpen, user }) => {
  const [changePassword, { isLoading }] = useChangeUserPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ defaultValues: { password: "", confirmPassword: "" } });

  const password = watch("password");

  const handleOnSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast.error("รหัสผ่านไม่ตรงกัน");
        return;
      }

      await changePassword({
        id: user.id,
        password: data.password,
      }).unwrap();

      toast.success("เปลี่ยนรหัสผ่านสำเร็จ!");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "เปลี่ยนรหัสผ่านไม่สำเร็จ",
      );
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          เปลี่ยนรหัสผ่านสำหรับ {user?.name}
        </Dialog.Title>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="รหัสผ่านใหม่"
            type="password"
            name="password"
            label="รหัสผ่านใหม่"
            className="w-full rounded"
            register={register("password", {
              required: "กรุณาระบุรหัสผ่านใหม่!",
              minLength: {
                value: 6,
                message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
              },
            })}
            error={errors.password ? errors.password.message : ""}
          />
          <Textbox
            placeholder="ยืนยันรหัสผ่าน"
            type="password"
            name="confirmPassword"
            label="ยืนยันรหัสผ่าน"
            className="w-full rounded"
            register={register("confirmPassword", {
              required: "กรุณายืนยันรหัสผ่าน!",
              validate: (value) => value === password || "รหัสผ่านไม่ตรงกัน",
            })}
            error={errors.confirmPassword ? errors.confirmPassword.message : ""}
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
              onClick={() => {
                reset();
                setOpen(false);
              }}
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
  );
};

export default ChangePasswordDialog;
