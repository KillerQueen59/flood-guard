"use client";
import { ColumnDef } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";
import TableActionDropdown from "@/components/Dropdown/TableActionDropdown";

import { AlatAWL, AlatAWS } from "@/shared/type";
import { date } from "@/shared/date";
import { MenuItem } from "@headlessui/react";
import clsx from "clsx";
import { CheckCircle, XCircle } from "heroicons-react";

const AWLColumn = () => {
  const columns = React.useMemo<ColumnDef<AlatAWL>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => (
          <div className="w-full text-left text-xs text-gray-80">NO</div>
        ),
        size: 20,
        cell: (info) => info.row.index + 1,
      },
      {
        accessorKey: "deviceName",
        header: () => (
          <div className="w-full text-left text-xs text-gray-80">
            Device Name
          </div>
        ),
        cell: (info) => (
          <div
            className="flex space-x-2 text-primary-60 underline cursor-pointer"
            onClick={() => {}}>
            <div>
              <div className="text-primary-60 font-semibold">
                {info.row.original.detailName ?? "-"}
              </div>
            </div>
          </div>
        ),
        minSize: Math.round((global?.window && window.innerHeight - 55) * 0.6),
      },
      {
        accessorKey: "id",
        header: () => (
          <div className="w-full text-left text-xs text-gray-80">Device Id</div>
        ),
        cell: (info) => <div>{info.row.original.id ?? "-"}</div>,
        minSize: Math.round((global?.window && window.innerHeight - 55) * 0.2),
      },
      {
        accessorKey: "createdAt",
        header: () => (
          <div className="w-full text-left text-xs text-gray-80">
            Start date
          </div>
        ),
        minSize: Math.round((global?.window && window.innerHeight - 55) * 0.2),
        cell: (info) => <div>{date(info.row.original.startDate ?? "")}</div>,
      },
      {
        accessorKey: "battery",
        header: () => (
          <div className="w-full text-left text-xs text-gray-80">Battery</div>
        ),
        minSize: Math.round((global?.window && window.innerHeight - 55) * 0.2),
        cell: (info) => <div>{info.row.original.battery ?? ""}</div>,
      },
      {
        accessorKey: "signal",
        header: () => (
          <div className="w-full text-left text-xs text-gray-80">Signal</div>
        ),
        minSize: Math.round((global?.window && window.innerHeight - 55) * 0.2),
        cell: (info) => <div>{info.row.original.signal ?? ""}</div>,
      },
      {
        accessorKey: "data",
        header: () => (
          <div className="w-full text-left text-xs text-gray-80">Data</div>
        ),
        minSize: Math.round((global?.window && window.innerHeight - 55) * 0.2),
        cell: (info) => {
          console.log("info.row.original", info.row.original);

          return <div>{info.row.original.data ?? "-"}</div>;
        },
      },
      {
        accessorKey: "status",
        header: () => (
          <div className="w-full text-left text-xs text-gray-80">Status</div>
        ),
        minSize: Math.round((global?.window && window.innerHeight - 55) * 0.2),
        cell: (info) => (
          <div>
            {info.row.original.status == "Normal" ? (
              <CheckCircle
                className="text-success-60"
                size={20}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            ) : (
              <XCircle
                className="text-danger-60"
                size={20}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            )}
          </div>
        ),
      },
      {
        accessorKey: "catatan",
        header: () => (
          <div className="w-full text-left text-xs text-gray-80">Catatan</div>
        ),
        minSize: Math.round((global?.window && window.innerHeight - 55) * 0.4),
        cell: (info) => <div>{info.row.original.note ?? ""}</div>,
      },
    ],
    []
  );

  return columns;
};

export default AWLColumn;
