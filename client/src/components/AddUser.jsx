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

const AddUser = ({ open, setOpen, userData, isProfile = false }) => {
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

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
          title: data.title,
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
              ? "UPDATE PROFILE"
              : userData
                ? "UPDATE USER DETAILS"
                : "ADD NEW USER"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded disabled:opacity-60"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
              disabled={isProfile}
            />

            <Textbox
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              className="w-full rounded disabled:opacity-60"
              register={register("role", {
                required: "User role is required!",
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
                label="Cancel"
              />
              <Button
                type="submit"
                className="bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 rounded-full"
                label="Submit"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
