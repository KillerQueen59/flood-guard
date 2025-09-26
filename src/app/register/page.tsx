"use client";

import InputField from "@/components/InputField";
import Image from "next/image";
import Button, { ButtonSize } from "@/components/Button";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { validationSchema } from "../login/loginschema";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Handle form submission
  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const { error } = await signUp(data.email, data.password);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Registration successful! ");
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <form
      className="bg-white w-[590px] m-auto self-center rounded-3xl p-14 shadow"
      onSubmit={handleSubmit(onSubmit)}>
      <ToastContainer />
      <div className="flex space-x-1.5 mb-12 w-fit mx-auto">
        <Image
          src="/flood_guard_logo.svg"
          alt="Flood Guard Logo"
          width={135}
          height={84}
          priority
        />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Create Account
      </h2>

      <InputField
        control={control}
        name={"email"}
        label={"Email"}
        placeholder={"Input email"}
        className="mt-6"
      />
      <InputField
        control={control}
        name={"password"}
        label={"Password"}
        type="password"
        placeholder={"Input password"}
        className="mt-2"
      />
      <div className="my-5 flex"></div>
      <Button
        type="submit"
        label="Register"
        buttonSize={ButtonSize.LARGE}
        fullWidth
        onClick={() => {}}
      />

      <div className="text-center mt-4">
        <span className="text-gray-600">Already have an account? </span>
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-800 underline">
          Login here
        </Link>
      </div>
    </form>
  );
}
