/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomSelect from "@/components/CustomSelect";
import CustomSelectField from "@/components/CustomSelectField";
import { SetStateAction } from "react";
import Image from "next/image";
import RenderData from "./component/RenderData";
import InputDate from "@/components/InputDate/InputDate";
import { useAwsImpl } from "./useAwsImpl";
import dayjs from "dayjs";

export default function AWS() {
  const {
    pt,
    aws,
    labels,
    kebun,
    device,
    selectedDate,
    kebuns,
    devices,
    pts,
    loading: isLoading,
    showFilter,
    tipe,
    setShowFilter,
    setPt,
    setKebun,
    setDevice,
    setTipe,
    setSelectedDate,
  } = useAwsImpl();

  return (
    <div>
      <div className="w-full p-8">
        <div className="rounded-2xl	w-full border border-gray-30 bg-white">
          <div className="flex w-full p-6">
            <div className="flex-grow">
              <div className="text-gray-80 font-semibold text-base">
                Data AWS
              </div>
              <div className="font-medium text-gray-50">
                {aws.length > 0 && (
                  <span className="text-sm text-gray-60">
                    Showing {aws.length} records for{" "}
                    {dayjs(selectedDate).format("DD/MM/YYYY")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-4"></div>
          </div>
          {!isLoading && (
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
                        !kebun ? "Select Kebun first" : "Select AWS Device"
                      }
                    />
                    <div className="flex-grow" />
                  </div>
                  <div className="flex px-6 pb-5 space-x-6">
                    <CustomSelectField
                      options={[
                        {
                          label: "Evapotranspiration",
                          value: "evaportranpiration",
                        },
                        { label: "Humidity", value: "humidity" },
                        { label: "Rainfall", value: "rainfall" },
                        { label: "Rain Rate", value: "rainRate" },
                        { label: "Solar Radiation", value: "solarRadiation" },
                        { label: "Temperature", value: "temperature" },
                        { label: "Wind Speed", value: "windSpeed" },
                        { label: "Wind Direction", value: "windDirection" },
                      ]}
                      value={tipe}
                      onChange={(e: SetStateAction<string>) => setTipe(e)}
                      name={"status"}
                      label={"Tipe Sensor"}
                    />
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
                        {tipe && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            Sensor: {tipe}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="text-gray-60">Loading AWS data...</div>
                </div>
              ) : aws.length > 0 && tipe ? (
                <div className="border-t">
                  <RenderData
                    tipe={tipe}
                    label={labels}
                    data={aws}
                    selectedDate={selectedDate}
                    pt={pt}
                    kebun={kebun}
                    device={device}
                  />
                </div>
              ) : (
                <div className="m-8 text-center">
                  <div className="text-gray-80 font-medium mb-2">
                    {!tipe ? "Select Sensor Type" : "No Data Found"}
                  </div>
                  <div className="text-gray-60 text-sm">
                    {!tipe
                      ? "Please select a sensor type from the dropdown to view data."
                      : "No AWS data available for the selected filters."}
                  </div>
                  <div className="text-gray-50 text-xs mt-2">
                    {!tipe
                      ? "Available sensors: Temperature, Humidity, Rainfall, Wind Speed, etc."
                      : "Try adjusting your date selection or filters to find available data."}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
