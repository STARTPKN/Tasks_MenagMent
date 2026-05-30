import React from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import Button from "./Button";
import { useChangePasswordMutation } from "../redux/slices/authApiSlice";
import { toast } from "sonner";

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleOnSubmit = async (data) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to change password");
    }
  };

  const newPasswordVal = watch("newPassword");

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-6">
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-2"
        >
          CHANGE PASSWORD
        </Dialog.Title>

        <div className="flex flex-col gap-5">
          <Textbox
            placeholder="Enter current password"
            type="password"
            name="currentPassword"
            label="Current Password"
            className="w-full rounded"
            register={register("currentPassword", {
              required: "Current password is required!",
            })}
            error={errors.currentPassword ? errors.currentPassword.message : ""}
          />

          <Textbox
            placeholder="Enter new password"
            type="password"
            name="newPassword"
            label="New Password"
            className="w-full rounded"
            register={register("newPassword", {
              required: "New password is required!",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters!",
              },
            })}
            error={errors.newPassword ? errors.newPassword.message : ""}
          />

          <Textbox
            placeholder="Confirm new password"
            type="password"
            name="confirmPassword"
            label="Confirm New Password"
            className="w-full rounded"
            register={register("confirmPassword", {
              required: "Confirming new password is required!",
              validate: (value) =>
                value === newPasswordVal || "Passwords do not match!",
            })}
            error={errors.confirmPassword ? errors.confirmPassword.message : ""}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            className="bg-gray-100 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-full"
            onClick={() => {
              reset();
              setOpen(false);
            }}
            label="Cancel"
          />
          <Button
            type="submit"
            className="bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 rounded-full"
            label={isLoading ? "Saving..." : "Submit"}
            disabled={isLoading}
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default ChangePassword;
