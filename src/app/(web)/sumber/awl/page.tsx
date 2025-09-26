/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Table from "@/components/Table/Table";
import CustomSelectField from "@/components/CustomSelectField";
import Button, { ButtonSize, ButtonColor } from "@/components/Button";
import AWLColumn from "./components/AWLColumn";
import { downloadCsv, downloadPdf } from "@/hooks/useExport";
import { useAwlImpl } from "./useAwlImpl";

export default function AWL() {
  const columns = AWLColumn();
  const {
    awl,
    pt,
    kebun,
    status,
    pts,
    kebuns,
    loading,
    setPt,
    setKebun,
    setStatus,
  } = useAwlImpl();

  // Status options based on your seed data
  const statusOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Alert", value: "alert" },
    { label: "Rusak", value: "rusak" },
    { label: "Idle", value: "idle" },
  ];

  return (
    <div>
      <div className="w-full p-8">
        <div className="rounded-2xl	w-full border border-gray-30 bg-white">
          <div className="flex w-full p-6">
            <div className="flex-grow">
              <div className="text-gray-80 font-semibold text-base">
                AWL Device
              </div>
              <div className="font-medium text-gray-50">
                {awl.length > 0 && (
                  <span className="text-sm text-gray-60">
                    Showing {awl.length} device(s)
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-4"></div>
          </div>
          <div className="text-black">
            {/* First row of filters */}
            <div className="flex border-t px-6 pt-5 pb-2 space-x-6 flex-wrap gap-y-4">
              <CustomSelectField
                options={statusOptions}
                value={status === "All" ? "" : status}
                onChange={(selectedOption: string) => {
                  setStatus(selectedOption);
                }}
                name={"status"}
                label={"Status"}
              />
              <CustomSelectField
                options={pts}
                value={pt === "All" ? "" : pt}
                onChange={(selectedOption: string) => {
                  setPt(selectedOption);
                  setKebun("");
                }}
                name={"pt"}
                label={"PT"}
              />
              <CustomSelectField
                options={kebuns}
                value={kebun === "All" ? "" : kebun}
                onChange={(selectedOption: string) => {
                  setKebun(selectedOption);
                }}
                name={"kebun"}
                label={"Kebun"}
              />

              <div className="flex-grow" />

              {/* Export Buttons */}
              <Button
                label="PDF"
                onClick={() => {
                  downloadPdf(awl);
                }}
                buttonSize={ButtonSize.LARGE}
                buttonColor={ButtonColor.PRIMARY}
                disabled={awl.length === 0}
              />
              <Button
                label="Excel"
                onClick={() => {
                  downloadCsv(awl);
                }}
                buttonSize={ButtonSize.LARGE}
                buttonColor={ButtonColor.PRIMARY}
                disabled={awl.length === 0}
              />
            </div>

            {/* Filter Status Display */}
            <div className="px-6 pb-4">
              <div className="text-sm text-gray-60 bg-gray-10 p-3 rounded-lg">
                <div className="font-medium mb-1">Active Filters:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Status: {status}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    PT: {pt}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Kebun: {kebun}
                  </span>
                </div>
              </div>
            </div>

            <Table
              data={awl}
              columns={columns}
              pageIndex={0}
              setPageIndex={() => {}}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
