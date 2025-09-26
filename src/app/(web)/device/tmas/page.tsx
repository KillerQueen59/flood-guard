/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LineChart from "@/components/Chart/LineChart/LineChart";
import CustomSelect from "@/components/CustomSelect";
import Image from "next/image";
import dayjs from "dayjs";
import InputDate from "@/components/InputDate/InputDate";
import { useTmasImpl } from "./useTmasImpl";

export default function TMAS() {
  const {
    pt,
    tmas,
    labels,
    kebun,
    device,
    selectedDate,
    kebuns,
    devices,
    pts,
    loading: isLoading,
    showFilter,
    setShowFilter,
    setPt,
    setKebun,
    setDevice,
    setSelectedDate,
  } = useTmasImpl();

  // Define TMAS-specific reference zones and lines
  const tmasReferenceZones = [
    { min: 0, max: 40, color: "rgba(76, 175, 80, 0.1)" }, // Green
    { min: 40, max: 60, color: "rgba(255, 235, 59, 0.1)" }, // Yellow
    { min: 60, max: 80, color: "rgba(255, 152, 0, 0.1)" }, // Orange
    { min: 80, max: 500, color: "rgba(244, 67, 54, 0.1)" }, // Red
  ];

  const tmasReferenceLines = [
    { value: 40, color: "#4CAF50", label: "40 cm" },
    { value: 60, color: "#FFC107", label: "60 cm" },
    { value: 80, color: "#FF9800", label: "80 cm" },
  ];

  const tmasLegend = [
    { color: "#4CAF50", label: "Safe (0-40 cm)" },
    { color: "#FFC107", label: "Caution (40-60 cm)" },
    { color: "#FF9800", label: "Warning (60-80 cm)" },
    { color: "#F44336", label: "Critical (>80 cm)" },
  ];

  return (
    <div>
      <div className="w-full p-8">
        <div className="rounded-2xl	w-full border border-gray-30 bg-white">
          <div className="flex w-full p-6">
            <div className="flex-grow">
              <div className="text-gray-80 font-semibold text-base">
                Laporan TMAS
              </div>
              <div className="font-medium text-gray-50">
                {tmas.length > 0 && (
                  <span className="text-sm text-gray-60">
                    Showing {tmas.length} records for{" "}
                    {dayjs(selectedDate).format("DD/MM/YYYY")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-4"></div>
          </div>
          <div className="border-t">
            <div className="px-6 my-4 flex">
              <div className="flex-grow">Filter</div>
              <Image
                alt=""
                src={showFilter ? "/chevron-down.svg" : "/chevron-up.svg"}
                width={20}
                height={20}
                onClick={() => setShowFilter(!showFilter)}
                className="cursor-pointer"
              />
            </div>
            {showFilter && (
              <div className="text-black min-h-[200px]">
                <div className="flex px-6 py-5 space-x-6 flex-wrap gap-y-4">
                  <div className="flex my-auto whitespace-nowrap">
                    Data Filter
                  </div>
                  <CustomSelect
                    options={pts}
                    value={pt === "All" ? "" : pt}
                    onChange={(e: string) => setPt(e)}
                    placeholder="Select PT"
                  />
                  <CustomSelect
                    options={kebuns}
                    value={kebun === "All" ? "" : kebun}
                    onChange={(e: string) => setKebun(e)}
                    placeholder={!pt ? "Select PT first" : "Select Kebun"}
                  />
                  <CustomSelect
                    options={devices}
                    value={device === "All" ? "" : device}
                    onChange={(e: string) => setDevice(e)}
                    placeholder={
                      !kebun ? "Select Kebun first" : "Select AWL Device"
                    }
                  />
                  <div className="flex-grow" />
                </div>
                <div className="flex px-6 pb-5 space-x-6">
                  <InputDate
                    value={selectedDate}
                    onChange={(date: Date) => setSelectedDate(date)}
                    name={"Tanggal"}
                    label={"Tanggal"}
                    placeholder={"Select Date"}
                  />
                </div>

                {/* Display current filter status */}
                <div className="px-6 pb-4">
                  <div className="text-sm text-gray-60 bg-gray-10 p-3 rounded-lg">
                    <div className="font-medium mb-1">Active Filters:</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Date: {dayjs(selectedDate).format("DD/MM/YYYY")}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        PT: {pt}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Kebun: {kebun}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Device: {device}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-gray-60">Loading TMAS data...</div>
              </div>
            ) : tmas.length > 0 ? (
              <div className="border-t">
                <LineChart
                  label={labels}
                  upperTitle="Laporan TMAS"
                  title="Tinggi Muka Air Saluran"
                  data={[
                    tmas.map((data: any) => {
                      // Convert from meters to centimeters for display
                      return data.ketinggian * 100;
                    }),
                  ]}
                  xAxisTitle="Jam"
                  yAxisTitle="TMAS (cm)"
                  dataSatuan="cm"
                  dataType="TMAS"
                  selectedDate={dayjs(selectedDate).format("DD/MM/YYYY")}
                  id="tmas"
                  pt={pt}
                  kebun={kebun}
                  device={device}
                  // TMAS-specific props
                  showBackgroundZones={true}
                  referenceZones={tmasReferenceZones}
                  referenceLines={tmasReferenceLines}
                  customLegend={tmasLegend}
                />
              </div>
            ) : (
              <div className="m-8 text-center">
                <div className="text-gray-80 font-medium mb-2">
                  No Data Found
                </div>
                <div className="text-gray-60 text-sm">
                  No TMAS data available for the selected filters.
                </div>
                <div className="text-gray-50 text-xs mt-2">
                  Try adjusting your date selection or filters to find available
                  data.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
