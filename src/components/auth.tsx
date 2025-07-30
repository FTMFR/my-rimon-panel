"use client";

import React from "react";
import Cookies from "js-cookie";
import CustomForm from "./forms";
import { Sliders } from "./sliderSwipper";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { login } from "@/utils/useApis";

const schema = z.object({
  userName: z.string().min(4, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const Auth = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const { userName, password, rememberMe } = data;
    try {
      const response = await login({
        id: 0,
        userName,
        password,
        rememberMe: rememberMe || false,
      });

      const cookieOptions = {
        expires: rememberMe ? 30 : 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      };

      Cookies.set("access_token", response.accessToken, cookieOptions);
      Cookies.set("refresh_token", response.refreshToken, cookieOptions);
      Cookies.set("rememberMe", String(rememberMe), cookieOptions);

      toast.success("Login successful!");
      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error.message); // Log error for debugging
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex h-full w-full min-h-screen">
      <div className="flex flex-col w-full md:w-1/2 justify-between my-auto items-center mx-20 h-full">
        <div className="flex flex-col max-w-[400px] justify-center mx-auto gap-7">
          <form onSubmit={handleSubmit(onSubmit)} className="gap-4">
            <div className="mb-5">
              <h1 className="text-[#4A4543] text-[42px]">Welcome to Rimon!</h1>
              <span className="text-[#808080] text-base mb-2">
                Welcome back! Please enter your credentials to continue.
              </span>
            </div>
            <CustomForm
              name="userName"
              type="text"
              register={register}
              error={errors.userName?.message}
            />
            <CustomForm
              name="password"
              type="password"
              register={register}
              error={errors.password?.message}
            />
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("rememberMe")} />
              <span className="text-[14px] font-medium text-[#4A4543]">
                Remember Me
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full bg-[#FE8660] text-white py-2 px-4 rounded hover:bg-opacity-90 text-base font-medium"
            >
              {isSubmitting ? "Logging in..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
      <Sliders />
    </div>
  );
};

export default Auth;