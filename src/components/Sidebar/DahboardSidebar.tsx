"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RouterComponent from "./RouterComponent";
import clsx from "clsx";
import { CubeOutline, HomeOutline } from "heroicons-react";

type DashboardSidebarProps = {
  isOpen: boolean;
  pathname: string;
};

export default function DashboardSidebar({
  isOpen,
  pathname,
}: DashboardSidebarProps) {
  const [showManagement, setShowManagement] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setShowManagement(true);
    }
  }, [isOpen]);

  return (
    <div>
      <div
        className={` overflow-hidden transition-[max-height] duration-200 ease-in ${
          showManagement ? "max-h-[150px]" : "max-h-0"
        }`}>
        <RouterComponent
          parentPathname={pathname}
          pathname="/dashboard"
          router={router}
          label="Dashboard"
          icon={
            <HomeOutline
              className={clsx("h-[20px] w-[20px]", {
                "text-primary-60": pathname === "/dashboard",
                "text-gray-80": pathname !== "/dashboard",
              })}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          }
          isOpen={isOpen}
        />
      </div>
    </div>
  );
}
