import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../redux/slices/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { useGetSettingsQuery } from "../redux/slices/settingsApiSlice";
import { toast } from "sonner";
import Loader from "../components/Loader";

const Register = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const { data: settings, isLoading: isLoadingSettings } =
    useGetSettingsQuery();

  const password = watch("password");

  const submitHandler = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน!");
      return;
    }
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();

      dispatch(setCredentials(res?.data || res));
      toast.success("สมัครสมาชิกและเข้าสู่ระบบสำเร็จ!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err?.error ||
          "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
    }
  };

  useEffect(() => {
    if (user && user.token) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6] py-10">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center px-4">
        {/* Left Side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center hidden lg:flex">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600 bg-white shadow-sm">
              จัดการงานของคุณอย่างเป็นระบบ !
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
              <span>Task Manager</span>
            </p>

            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          {isLoadingSettings ? (
            <div className="w-full h-[400px] flex items-center justify-center bg-white px-10 pt-10 pb-10">
              <Loader />
            </div>
          ) : settings?.data?.allowUserRegistration === "false" ? (
            <div className="form-container w-full md:w-[400px] flex flex-col gap-y-5 bg-white px-10 pt-10 pb-10 text-center">
              <p className="text-red-600 text-3xl font-bold">ปิดการลงทะเบียน</p>
              <p className="text-base text-gray-700 mt-1">
                การสมัครสมาชิกถูกปิดใช้งานชั่วคราวโดยผู้ดูแลระบบ
              </p>
              <Button
                type="button"
                label="กลับไปหน้าเข้าสู่ระบบ"
                className="w-full h-10 bg-blue-700 text-white rounded-full font-semibold shadow-md shadow-blue-600/10 transition-colors mt-6"
                onClick={() => navigate("/log-in")}
              />
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="form-container w-full md:w-[400px] flex flex-col gap-y-5 bg-white px-10 pt-10 pb-10"
            >
              <div>
                <p className="text-blue-600 text-3xl font-bold text-center">
                  สร้างบัญชีใหม่
                </p>
                <p className="text-center text-base text-gray-700 mt-1">
                  ลงทะเบียนเข้าใช้งานระบบเพื่อเริ่มต้นจัดการงาน
                </p>
              </div>

              <div className="flex flex-col gap-y-4">
                <Textbox
                  placeholder="ชื่อ-นามสกุลของคุณ"
                  type="text"
                  name="name"
                  label="ชื่อ-นามสกุล"
                  className="w-full rounded-full"
                  register={register("name", {
                    required: "กรุณากรอกชื่อ-นามสกุล!",
                  })}
                  error={errors.name ? errors.name.message : ""}
                />

                <Textbox
                  placeholder="email@example.com"
                  type="email"
                  name="email"
                  label="Email Address"
                  className="w-full rounded-full"
                  register={register("email", {
                    required: "กรุณากรอกอีเมล!",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "รูปแบบอีเมลไม่ถูกต้อง",
                    },
                  })}
                  error={errors.email ? errors.email.message : ""}
                />

                <Textbox
                  placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                  type="password"
                  name="password"
                  label="Password"
                  className="w-full rounded-full"
                  register={register("password", {
                    required: "กรุณากรอกรหัสผ่าน!",
                    minLength: {
                      value: 6,
                      message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
                    },
                  })}
                  error={errors.password ? errors.password.message : ""}
                />

                <Textbox
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  className="w-full rounded-full"
                  register={register("confirmPassword", {
                    required: "กรุณายืนยันรหัสผ่าน!",
                    validate: (value) =>
                      value === password || "รหัสผ่านไม่ตรงกัน",
                  })}
                  error={
                    errors.confirmPassword ? errors.confirmPassword.message : ""
                  }
                />

                <Button
                  type="submit"
                  label={isLoading ? "กำลังสมัครสมาชิก..." : "Submit"}
                  className="w-full h-10 bg-blue-700 text-white rounded-full font-semibold shadow-md shadow-blue-600/10 transition-colors mt-2"
                  disabled={isLoading}
                />

                <div className="text-center mt-2">
                  <p className="text-sm text-gray-600">
                    มีบัญชีผู้ใช้อยู่แล้ว?{" "}
                    <span
                      className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      onClick={() => navigate("/log-in")}
                    >
                      เข้าสู่ระบบที่นี่
                    </span>
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
