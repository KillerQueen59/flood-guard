"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import "./index.css";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import DebouncedInput from "./components/DebouncedInput";
import dayjs from "dayjs";

export default function Table({
  data,
  columns,
  isSearchActive = false,
  isFilterYearsActive = false,
}: {
  data: any;
  columns: ColumnDef<any>[];
  isSearchActive?: boolean;
  isFilterYearsActive?: boolean;
  pageCount?: number;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  isLoading?: boolean;
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: "year",
      value: 0,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      globalFilter,
    },
    getRowId: (row) => row.id,
    manualPagination: true,
  });

  useEffect(() => {
    if (selectedDate) {
      setColumnFilters([
        {
          id: "year",
          value: dayjs(selectedDate).year(),
        },
      ]);
    } else {
      setColumnFilters([]);
    }
  }, [selectedDate]);

  return (
    <div>
      <div className="h-4" />
      {false ? (
        <div className="w-full flex items-center justify-center p-8">
          {/* <Loading /> */}
          load data
        </div>
      ) : (
        <div className="relative">
          <table className="w-full ">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  style={{
                    height: 50,
                  }}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          padding: "16px 24px",
                          width: header.column.getSize(),
                        }}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            {data.length === 0 ? (
              <tbody className="">
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      padding: "36px 24px",
                      textAlign: "center",
                    }}>
                    <div className="text-lg text-gray-80 font-semibold">
                      Data Not Entered Yet
                    </div>
                    <div className="text-sm text-gray-60">
                      You havent entered data for this menu yet. Please add data
                      first to complete the available table.
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map((row, idx) => {
                  return (
                    <tr key={idx}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            key={cell.id}
                            style={{
                              width: cell.column.getSize(),
                              padding: "16px 24px",
                            }}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
