import React from "react";
import clsx from "clsx";
import { Control, Controller } from "react-hook-form";
import Image from "next/image";
import { Eye, EyeOff } from "heroicons-react";

type Props = {
  control: Control<any>;
  className?: string;
  name: string;
  label: string;
  placeholder: string;
  error?: string;
  inputMode?:
    | "text"
    | "numeric"
    | "decimal"
    | "email"
    | "search"
    | "tel"
    | "url";
  type?: string;
  secureTextEntry?: boolean;
  required?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode | string;
};

const InputField = (props: Props) => {
  const {
    control,
    className,
    label,
    name,
    placeholder,
    type = "text",
    secureTextEntry,
    required = false,
    disabled = false,
    helper,
  } = props;
  const [show, setShow] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className={clsx("flex flex-col space-y-1.5", className)}>
          <div className="text-gray-80 text-base">
            {label} {required && <span className="text-danger-60">*</span>}
          </div>
          <div>{helper && <div className={"text-gray-50 "}>{helper}</div>}</div>
          <div className="relative">
            <input
              id={name}
              className={clsx(
                "border-[1.5px] rounded-lg w-full h-[48px] py-3 px-8 text-gray-700 focus:border-primary-60 focus:outline-none transition duration-200 ease-in-out",
                error ? "border-danger-60" : "border-gray-20"
              )}
              onKeyDown={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              min={type === "number" ? 0 : undefined}
              placeholder={placeholder}
              type={show ? "text" : type}
              onChange={onChange}
              value={value}
              disabled={disabled}
            />
            {error && (
              <p className="text-danger-60 text-xs mt-1 font-medium">
                {error.message}
              </p>
            )}
            {type === "password" && (
              <div
                className="mt-4 mx-4 grid place-items-center absolute top-0 right-0 cursor-pointer"
                onClick={() => {
                  setShow((n) => !n);
                }}>
                {show ? (
                  <EyeOff
                    className={clsx("h-[20px] w-[20px] text-gray-80", {})}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                ) : (
                  <Eye
                    className={clsx("h-[20px] w-[20px] text-gray-80", {})}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default InputField;
