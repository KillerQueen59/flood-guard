"use client";
import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeftOutline,
  ChevronRightOutline,
  LogoutOutline,
} from "heroicons-react";
import DashboardSidebar from "./DahboardSidebar";
import SumberSidebar from "./SumberSidebar";
import LaporanSidebar from "./LaporanSidebar";
import RouterComponent from "./RouterComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";

function SideBar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={`${
        isOpen ? "min-w-[280px]" : "min-w-[100px]"
      } h-screen flex flex-col bg-white overflow-auto transition-width duration-300 easy border-r border-gray-20`}>
      <div className="px-9 flex bg-white items-center space-x-1.5 py-8 sticky top-0">
        <Image
          src={"/flood_guard_logo.svg"}
          alt="Mamen Logo"
          width={isOpen ? 140 : 40}
          height={isOpen ? 85 : 25}
          priority
          className="transition-all duration-100 ease-out"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <div
          className="flex h-[50px] pl-8 items-center cursor-pointer text-gray-80 "
          onClick={() => {
            setIsOpen(!isOpen);
          }}>
          {isOpen ? (
            <div className="flex space-x-3 items-center h-[50px]">
              <ChevronLeftOutline
                className={"h-[20px] w-[20px] text-gray-100"}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />

              <div> Hide Menu </div>
            </div>
          ) : (
            <ChevronRightOutline
              className={"h-[20px] w-[20px] text-gray-100"}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          )}
        </div>
        <div>
          <DashboardSidebar isOpen={isOpen} pathname={pathname} />
        </div>
        <div>
          <SumberSidebar
            isOpen={isOpen}
            pathname={pathname}
            setIsOpen={setIsOpen}
          />
        </div>
        <div>
          <LaporanSidebar
            isOpen={isOpen}
            pathname={pathname}
            setIsOpen={setIsOpen}
          />
        </div>
        <RouterComponent
          parentPathname={`${pathname}`}
          pathname={`/map`}
          router={router}
          label={"Map"}
          icon={
            <FontAwesomeIcon
              icon={faMapLocation}
              color={pathname.includes("/map") ? "#1781BF" : "#374151"}
            />
          }
          isOpen={isOpen}
          customClass="pl-8 text-sm"
        />
      </div>
      <div
        onClick={() => {
          router.replace("/login");
        }}
        className="flex bg-white border-t">
        <div className="h-[80px] p-6 items-center flex w-full">
          {isOpen && (
            <div className="w-[80%] flex-grow">
              <div className="text-gray-80 text-sm font-semibold">
                {"Admin"}
              </div>
              <div className="text-gray-70">{"Admin"}</div>
            </div>
          )}

          <div className="cursor-pointer pl-[7px]">
            <LogoutOutline
              className={"h-[20px] w-[20px] text-red-60"}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
