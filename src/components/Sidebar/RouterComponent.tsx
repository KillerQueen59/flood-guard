import Image from "next/image";
import React from "react";

type RouterComponentProps = {
  parentPathname: string;
  pathname: string;
  router: any;
  label: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  customClass?: string;
};

export default function RouterComponent({
  parentPathname,
  pathname,
  router,
  label,
  icon,
  isOpen,
  customClass = "pl-8",
}: RouterComponentProps) {
  return (
    <div
      className={`${
        parentPathname === pathname
          ? "bg-primary-10 border-r-4 border-primary-90 text-primary-60"
          : "text-gray-80"
      } flex h-[50px] space-x-3 items-center cursor-pointer ${customClass} `}
      onClick={() => {
        router.replace(pathname);
      }}>
      {icon && <div>{icon}</div>}
      {isOpen && <div>{label}</div>}
    </div>
  );
}
