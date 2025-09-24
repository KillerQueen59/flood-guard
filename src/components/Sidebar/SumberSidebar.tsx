"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RouterComponent from "./RouterComponent";
import {
  ChevronDownOutline,
  ChevronUp,
  ChevronUpOutline,
  Database,
  TagOutline,
  TicketOutline,
} from "heroicons-react";
import clsx from "clsx";
import { sumber } from "@/shared/sumber";

type SumberSidebarProps = {
  isOpen: boolean;
  pathname: string;
  setIsOpen: (value: boolean) => void;
};

export default function SumberSidebar({
  isOpen,
  pathname,
  setIsOpen,
}: SumberSidebarProps) {
  const [showManagement, setShowManagement] = useState(true);
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
            pathname.includes("/sumber")
              ? "bg-primary-10 border-r-4 border-primary-90 text-primary-60"
              : "text-gray-80"
          }`}
          onClick={() => {
            setShowManagement(!showManagement);
            if (!isOpen) {
              setIsOpen(true);
            }
          }}>
          <Database
            className={clsx("h-[20px] w-[20px]", {
              "text-primary-60": pathname.includes("/sumber"),
              "text-gray-80": !pathname.includes("/sumber"),
            })}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          {isOpen && (
            <>
              <div className="flex-grow">Sumber </div>
              {showManagement ? (
                <ChevronUpOutline
                  className={clsx("h-[20px] w-[20px]", {
                    "text-primary-60": pathname.includes("/sumber"),
                    "text-gray-80": !pathname.includes("/sumber"),
                  })}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ) : (
                <ChevronDownOutline
                  className={clsx("h-[20px] w-[20px]", {
                    "text-primary-60": pathname.includes("/sumber"),
                    "text-gray-80": !pathname.includes("/sumber"),
                  })}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              )}
            </>
          )}
        </div>
      </div>
      {isOpen && (
        <>
          <div
            className={`overflow-hidden transition-[max-height] duration-200 ease-in ${
              showManagement ? "max-h-[150px]" : "max-h-0"
            }`}>
            <RouterComponent
              parentPathname={`${pathname}`}
              pathname={`/sumber/aws`}
              router={router}
              label={"AWS"}
              isOpen={isOpen}
              customClass="pl-12 text-sm"
            />
          </div>
          <div
            className={`overflow-hidden transition-[max-height] duration-200 ease-in ${
              showManagement ? "max-h-[150px]" : "max-h-0"
            }`}>
            <RouterComponent
              parentPathname={`${pathname}`}
              pathname={`/sumber/awl`}
              router={router}
              label={"AWL"}
              isOpen={isOpen}
              customClass="pl-12 text-sm"
            />
          </div>
        </>
      )}
    </div>
  );
}
