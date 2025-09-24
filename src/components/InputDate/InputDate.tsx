import React, { forwardRef, useState } from "react";
import clsx from "clsx";
import { Control, Controller } from "react-hook-form";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./InputDate.css";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  name: string;
  label: string;
  placeholder: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  yearOnly?: boolean;
  disabled?: boolean;
};

const InputDate = (props: Props) => {
  const {
    value,
    onChange,
    className,
    label,
    name,
    placeholder,
    required = false,
    minDate,
    maxDate,
    yearOnly = false,
    disabled = false,
  } = props;

  const [onFocus, setOnFocus] = useState(false);

  return (
    <div className={clsx("flex", className)}>
      <div className="text-gray-80 text-base my-auto mr-4 min-w-[100px]">
        {label} {required && <span className="text-danger-60">*</span>}
      </div>
      <div className="relative">
        <div className="flex items-center relative">
          <span className="w-full">
            <DatePicker
              id={name}
              wrapperClassName="datePickerWrapper"
              className="datePicker"
              selected={value}
              onChange={(date: Date | null) => {
                if (date) {
                  onChange(date);
                }
              }}
              calendarClassName="calendar"
              minDate={minDate}
              maxDate={maxDate}
              onFocus={(e) => {
                setOnFocus(true);
              }}
              onBlur={() => {
                setOnFocus(false);
              }}
              disabled={disabled}
              dateFormat={yearOnly ? "yyyy" : "dd/MM/YYYY"}
              showYearPicker={yearOnly}
              showYearDropdown={true}
              yearDropdownItemNumber={100}
              scrollableYearDropdown={true}
            />
          </span>
          <span className="right-0 absolute px-4">
            <Image alt="" src={"/calendar.svg"} width={16} height={16} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputDate;
