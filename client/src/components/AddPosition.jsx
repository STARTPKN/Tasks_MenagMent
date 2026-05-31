import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import {
  useCreatePositionMutation,
  useUpdatePositionMutation,
} from "../redux/slices/positionApiSlice";
import { toast } from "sonner";

const AddPosition = ({ open, setOpen, positionData }) => {
  let defaultValues = positionData ?? {};

  const [createPosition, { isLoading: isCreating }] = useCreatePositionMutation();
  const [updatePosition, { isLoading: isUpdating }] = useUpdatePositionMutation();

  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  useEffect(() => {
    if (open) {
      reset(positionData || {});
    }
  }, [positionData, open, reset]);

  const handleOnSubmit = async (data) => {
    try {
      if (positionData) {
        await updatePosition({
          id: positionData.id,
          name: data.name,
          description: data.description,
        }).unwrap();
        toast.success("อัปเดตตำแหน่งสำเร็จ!");
      } else {
        await createPosition({
          name: data.name,
          description: data.description,
        }).unwrap();
        toast.success("เพิ่มตำแหน่งใหม่สำเร็จ!");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "เกิดข้อผิดพลาด");
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
            {positionData ? "แก้ไขตำแหน่ง" : "เพิ่มตำแหน่งใหม่"}
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="ชื่อตำแหน่ง"
              type="text"
              name="name"
              label="ชื่อตำแหน่ง"
              className="w-full rounded"
              register={register("name", {
                required: "กรุณาระบุชื่อตำแหน่ง!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="รายละเอียด"
              type="text"
              name="description"
              label="รายละเอียด"
              className="w-full rounded"
              register={register("description")}
              error={errors.description ? errors.description.message : ""}
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

export default AddPosition;
