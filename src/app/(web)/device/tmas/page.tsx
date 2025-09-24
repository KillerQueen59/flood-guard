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

  return (
    <div>
      <div className="w-full p-8">
        <div className="rounded-2xl	w-full border border-gray-30 bg-white">
          <div className="flex w-full p-6">
            <div className="flex-grow">
              <div className="text-gray-80 font-semibold text-base">
                Laporan TMAS
              </div>
              <div className="font-medium text-gray-50"></div>
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
              />
            </div>
            {showFilter && (
              <div className="text-black min-h-[200px] ">
                <div className="flex px-6 py-5 space-x-6">
                  <div className=" flex my-auto">Data</div>
                  <CustomSelect
                    options={pts}
                    value={pt}
                    onChange={(e: string) => setPt(e)}
                    placeholder="PT"
                  />
                  <CustomSelect
                    options={kebuns.filter((kebun: any) => kebun.value !== "")}
                    value={kebun}
                    onChange={(e: string) => setKebun(e)}
                    placeholder="Kebun"
                  />
                  <CustomSelect
                    options={devices.filter((aws: any) =>
                      aws.value.includes(kebun ?? "")
                    )}
                    value={device}
                    onChange={(e: string) => setDevice(e)}
                    placeholder="Device"
                  />
                  <div className="flex-grow" />
                </div>
                <div className="flex px-6 pb-5 space-x-6">
                  <InputDate
                    value={selectedDate}
                    onChange={(date: Date) => setSelectedDate(date)}
                    name={"Tanggal"}
                    label={"Tanggal"}
                    placeholder={"Pilih Tanggal"}
                  />
                </div>
              </div>
            )}
            {pt && kebun && device && tmas.length > 0 ? (
              <div className="border-t">
                <LineChart
                  label={labels}
                  upperTitle="Laporan TMAS"
                  title="Tinggi Muka Air Saluran"
                  data={[
                    tmas.map((data: any) => {
                      return data.ketinggian;
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
                />
              </div>
            ) : (
              <div className="m-4 align-center justify-center">
                No data Found with selected Filter
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
