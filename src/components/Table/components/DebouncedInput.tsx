import React from "react";
import Image from "next/image";

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="w-[300px] relative items-center flex">
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex py-4 px-6 border border-gray-30 rounded-lg w-full focus:border-primary-60 focus:outline-none transition duration-200 ease-in-out"
      />
      <div className="mt-5 mx-5 grid place-items-center absolute top-0 right-0 ">
        <Image
          alt=""
          src={"/search.svg"}
          color="#ECFDF5"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}

export default DebouncedInput;
