import { useForm } from "react-hook-form";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import { useAddSubTaskMutation } from "../../redux/slices/taskApiSlice";
import { toast } from "sonner";

const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [addSubTask, { isLoading }] = useAddSubTaskMutation();

  const handleOnSubmit = async (data) => {
    try {
      await addSubTask({ id, data }).unwrap();
      toast.success("เพิ่มงานย่อยสำเร็จ!");
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            เพิ่มงานย่อย
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='ชื่อหัวข้อย่อย'
              type='text'
              name='title'
              label='ชื่อหัวข้อ'
              className='w-full rounded'
              register={register("title", {
                required: "กรุณากรอกชื่อหัวข้อ!",
              })}
              error={errors.title ? errors.title.message : ""}
            />

            <div className='flex items-center gap-4'>
              <Textbox
                placeholder='เวลา'
                type='date'
                name='date'
                label='วันที่งาน'
                className='w-full rounded'
                register={register("date", {
                  required: "กรุณากรอกวันที่งาน!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
              <Textbox
                placeholder='แท็ก'
                type='text'
                name='tag'
                label='แท็ก'
                className='w-full rounded'
                register={register("tag", {
                  required: "กรุณากรอกแท็ก!",
                })}
                error={errors.tag ? errors.tag.message : ""}
              />
            </div>
          </div>
          <div className='py-3 mt-4 flex sm:flex-row-reverse gap-4'>
            <Button
              type='submit'
              className='bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto'
              label={isLoading ? "กำลังเพิ่ม..." : "เพิ่มงาน"}
            />

            <Button
              type='button'
              className='bg-white border text-sm font-semibold text-gray-900 sm:w-auto'
              onClick={() => setOpen(false)}
              label='ยกเลิก'
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddSubTask;
