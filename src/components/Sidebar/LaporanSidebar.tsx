"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RouterComponent from "./RouterComponent";
import {
  ChevronDownOutline,
  ChevronUpOutline,
  CogOutline,
  DocumentReport,
  Server,
} from "heroicons-react";
import clsx from "clsx";
import {
  faCloudBolt,
  faArrowUpFromGroundWater,
  faBridgeWater,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type LaporanSidebarProps = {
  isOpen: boolean;
  pathname: string;
  setIsOpen: (value: boolean) => void;
};

export default function LaporanSidebar({
  isOpen,
  pathname,
  setIsOpen,
}: LaporanSidebarProps) {
  const [showManagement, setShowManagement] = useState(true);
  const [showDevice, setShowDevice] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setShowManagement(true);
    }
  }, [isOpen]);

  return (
    <div>
      <div>
        <div
          className={`flex h-[50px] items-center text-black cursor-pointer px-8 gap-3 ${
            pathname.includes("/device") || pathname.includes("/station")
              ? "bg-primary-10 border-r-4 border-primary-90 text-primary-60"
              : "text-gray-80"
          }`}
          onClick={() => {
            setShowManagement(!showManagement);
            if (!isOpen) {
              setIsOpen(true);
            }
          }}>
          <DocumentReport
            className={clsx("h-[20px] w-[20px]", {
              "text-primary-60":
                pathname.includes("/device") || pathname.includes("/station"),
              "text-gray-80":
                !pathname.includes("/device") && !pathname.includes("/station"),
            })}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          {isOpen && (
            <>
              <div className="flex-grow">Laporan </div>
              {showManagement ? (
                <ChevronUpOutline
                  className={clsx("h-[20px] w-[20px]", {
                    "text-primary-60":
                      pathname.includes("/device") ||
                      pathname.includes("/station"),
                    "text-gray-80":
                      !pathname.includes("/device") &&
                      !pathname.includes("/station"),
                  })}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ) : (
                <ChevronDownOutline
                  className={clsx("h-[20px] w-[20px]", {
                    "text-primary-60":
                      pathname.includes("/device") ||
                      pathname.includes("/station"),
                    "text-gray-80":
                      !pathname.includes("/device") &&
                      !pathname.includes("/station"),
                  })}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              )}
            </>
          )}
        </div>
      </div>
      {isOpen && showManagement && (
        <>
          <>
            <div
              className={`flex h-[50px] items-center text-black cursor-pointer pr-8 pl-12 gap-3 ${
                pathname.includes("/device")
                  ? "bg-primary-10 border-r-4 border-primary-90 text-primary-60"
                  : "text-gray-80"
              }`}
              onClick={() => {
                setShowDevice(!showDevice);
              }}>
              <CogOutline
                className={clsx("h-[20px] w-[20px]", {
                  "text-primary-60": pathname.includes("/device"),
                  "text-gray-80": !pathname.includes("/device"),
                })}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {isOpen && (
                <>
                  <div className="flex-grow">Device </div>
                  {showDevice ? (
                    <ChevronUpOutline
                      className={clsx("h-[20px] w-[20px]", {
                        "text-primary-60": pathname.includes("/device"),
                        "text-gray-80": !pathname.includes("/device"),
                      })}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  ) : (
                    <ChevronDownOutline
                      className={clsx("h-[20px] w-[20px]", {
                        "text-primary-60": pathname.includes("/device"),
                        "text-gray-80": !pathname.includes("/device"),
                      })}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  )}
                </>
              )}
            </div>
            <div
              className={`overflow-hidden transition-[max-height] duration-200 ease-in ${
                showDevice ? "max-h-[150px]" : "max-h-0"
              }`}>
              <RouterComponent
                parentPathname={`${pathname}`}
                pathname={`/device/aws`}
                router={router}
                label={"AWS"}
                icon={
                  <FontAwesomeIcon
                    icon={faCloudBolt}
                    color={
                      pathname.includes("/device/aws") ? "#1781BF" : "#374151"
                    }
                  />
                }
                isOpen={isOpen}
                customClass="pl-16 text-sm"
              />
            </div>
            <div
              className={`overflow-hidden transition-[max-height] duration-200 ease-in ${
                showDevice ? "max-h-[150px]" : "max-h-0"
              }`}>
              <RouterComponent
                parentPathname={`${pathname}`}
                pathname={`/device/tmas`}
                router={router}
                label={"TMAS"}
                icon={
                  <FontAwesomeIcon
                    icon={faBridgeWater}
                    color={
                      pathname.includes("/device/tmas") ? "#1781BF" : "#374151"
                    }
                  />
                }
                isOpen={isOpen}
                customClass="pl-16 text-sm"
              />
            </div>
            <div
              className={`overflow-hidden transition-[max-height] duration-200 ease-in ${
                showDevice ? "max-h-[150px]" : "max-h-0"
              }`}>
              <RouterComponent
                parentPathname={`${pathname}`}
                pathname={`/device/tmat`}
                router={router}
                label={"TMAT"}
                icon={
                  <FontAwesomeIcon
                    icon={faArrowUpFromGroundWater}
                    color={
                      pathname.includes("/device/tmat") ? "#1781BF" : "#374151"
                    }
                  />
                }
                isOpen={isOpen}
                customClass="pl-16 text-sm"
              />
            </div>
          </>
        </>
      )}
    </div>
  );
}
