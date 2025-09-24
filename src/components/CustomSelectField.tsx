import error from "next/error";
import { DropdownIndicatorProps, components } from "react-select";
import Select from "react-select";
import Image from "next/image";
import { FieldError } from "react-hook-form";
import clsx from "clsx";
import { EyeOff, Eye } from "heroicons-react";
import { type } from "os";
import CustomSelect from "./CustomSelect";

type Props = {
  className?: string;
  name: string;
  label: string;
  options: any;
  value: any;
  onChange: any;
  placeholder?: string;
  error?: FieldError | undefined;
  required?: boolean;
  helper?: React.ReactNode | string;
};
const CustomSelectField = ({
  className,
  label,
  name,
  placeholder,
  options,
  value,
  onChange,
  required = false,
  error,
  helper,
}: Props) => {
  return (
    <div className={clsx("flex", className)}>
      <div className="text-gray-80 text-base my-auto mr-4 min-w-[100px]">
        {label} {required && <span className="text-danger-60">*</span>}
      </div>
      <div>{helper && <div className={"text-gray-50 "}>{helper}</div>}</div>
      <CustomSelect options={options} value={value} onChange={onChange} />
    </div>
  );
};

export default CustomSelectField;
