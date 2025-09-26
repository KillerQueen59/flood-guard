"use client";

import Table from "@/components/Table/Table";
import AWSColumn from "./components/AWSColumn";
import { useState } from "react";
import CustomSelectField from "@/components/CustomSelectField";
import Button, { ButtonSize, ButtonColor } from "@/components/Button";
import DetailModal from "./components/DetailModal";
import { downloadCsv, downloadPdf } from "@/hooks/useExport";
import { useAwsImpl } from "./useAwsImpl";

export default function AWS() {
  const [showModal, setShowModal] = useState(false);
  const columns = AWSColumn(setShowModal);
  const { pt, pts, status, aws, loading, setPt, setStatus } = useAwsImpl();

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
      <DetailModal
        header={""}
        subHeader={""}
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
      <div className="w-full p-8">
        <div className="rounded-2xl	w-full border border-gray-30 bg-white">
          <div className="flex w-full p-6">
            <div className="flex-grow">
              <div className="text-gray-80 font-semibold text-base">
                AWS Device
              </div>
              <div className="font-medium text-gray-50">
                {aws.length > 0 && (
                  <span className="text-sm text-gray-60">
                    Showing {aws.length} device(s)
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-4"></div>
          </div>
          <div className="text-black">
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
                }}
                name={"pt"}
                label={"PT"}
              />

              <div className="flex-grow" />

              {/* Export Buttons */}
              <Button
                label="PDF"
                onClick={() => {
                  downloadPdf(aws);
                }}
                buttonSize={ButtonSize.LARGE}
                buttonColor={ButtonColor.PRIMARY}
                disabled={aws.length === 0}
              />
              <Button
                label="Excel"
                onClick={() => {
                  downloadCsv(aws);
                }}
                buttonSize={ButtonSize.LARGE}
                buttonColor={ButtonColor.PRIMARY}
                disabled={aws.length === 0}
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
                </div>
              </div>
            </div>

            <Table
              data={aws}
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
