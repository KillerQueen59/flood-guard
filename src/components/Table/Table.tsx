"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import "./index.css";
import LoadingState from "@/components/State/LoadingState";
import EmptyState from "@/components/State/EmptyState";

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
  isLoading = false,
  emptyTitle,
  emptyDescription,
}: {
  data: any;
  columns: ColumnDef<any>[];
  isSearchActive?: boolean;
  isFilterYearsActive?: boolean;
  pageCount?: number;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
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
      {isLoading ? (
        <LoadingState
          title="Loading table data"
          description="We are preparing your records."
          className="min-h-[280px]"
        />
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
                              header.getContext(),
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
                      padding: "24px",
                      textAlign: "center",
                    }}>
                    <EmptyState
                      title={emptyTitle || "No rows available"}
                      description={
                        emptyDescription ||
                        "No records match your current filter selection."
                      }
                      className="min-h-[220px]"
                    />
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
                              cell.getContext(),
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
