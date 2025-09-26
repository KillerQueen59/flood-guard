/* eslint-disable @typescript-eslint/no-explicit-any */
import { DropdownIndicatorProps, components } from "react-select";
import Select from "react-select";
import Image from "next/image";
import { FieldError } from "react-hook-form";

type CustomSelectProps = {
  options: any;
  value: any;
  onChange: any;
  placeholder?: string;
  error?: FieldError | undefined;
};

const DropdownIndicator: React.FC<DropdownIndicatorProps> = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <Image alt="" src={"/dropdown-select.svg"} width={20} height={20} />
    </components.DropdownIndicator>
  );
};
const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  error,
}: CustomSelectProps) => {
  console.log("value", value);

  return (
    <Select
      options={options}
      styles={{
        menuPortal: (base: any) => ({
          ...base,
          zIndex: 9999,
          color: "#000000",
        }),
        control: (base: any) => ({
          ...base,
          minWidth: "150px",
          border: error ? "1px solid #DC2626" : "1px solid #E5E7EB",
          borderRadius: "8px",
          overflow: "hidden",
          color: "#000000",
          height: "48px",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
        }),
        option: (base: any) => ({
          ...base,
          color: "#000000",
        }),
      }}
      onChange={(selectedOption: any) => {
        onChange(selectedOption.value);
      }}
      value={
        options ? options.find((option: any) => option.value === value) : ""
      }
      placeholder={placeholder ?? "Choose Select"}
      components={{ DropdownIndicator, IndicatorSeparator: () => null }}
    />
  );
};

export default CustomSelect;
