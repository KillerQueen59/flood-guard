"use client";
import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { numberWithSeparator, transformColor } from "@/shared/helper";
import clsx from "clsx";
import { defaultColor } from "@/constants";
import { ViewList } from "heroicons-react";

ChartJS.register(ArcElement, Tooltip, Legend);

type Data = {
  value: number;
  label: string;
};

type DoughnutChartProps = {
  title: string;
  subTitle: string;
  data: Data[];
  className?: string;
  below?: boolean;
  backgroundColor?: string[];
  row?: boolean;
  noLine?: boolean;
  size?: string;
  background?: string;
  sideTitle?: boolean;
  onClick?: (index: any) => void;
  onStatusClicked: () => void;
  onLaporanHarianClicked: () => void;
  onLaporanBulananClicked: () => void;
};

function DoughnutChart({
  title,
  subTitle,
  data,
  className = "",
  below = false,
  backgroundColor = defaultColor,
  row = false,
  noLine = false,
  size = "w-full",
  sideTitle = false,
  onClick,
  background = "bg-neutral-white",
  onStatusClicked,
  onLaporanHarianClicked,
  onLaporanBulananClicked,
}: DoughnutChartProps) {
  const total = data.reduce(
    (a: any, b: any) => parseInt(a) + parseInt(b.value),
    0
  );

  data.sort((a: any, b: any) => b.value - a.value);

  const datas = {
    datasets: [
      {
        data: data,
        backgroundColor: transformColor(backgroundColor),
        borderWidth: 0,
        hoverBorderColor: transformColor(backgroundColor),
        hoverBorderWidth: 10,
        hoverBorderRadius: 10,
      },
    ],
  };

  const [show, setShow] = useState(false);

  return (
    <div
      className={clsx(
        "p-6 bg-white rounded-2xl drop-shadow-lg",
        className,
        background
      )}>
      {!sideTitle && (
        <>
          <div className="flex pr-3 pt-3 relative">
            <div className="flex-grow">
              <div className="h6 font-bold text-neutral-primary">{title}</div>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                setShow(!show);
              }}>
              <ViewList
                className="h-6 w-6"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </div>
            {show && (
              <div className="bg-white p-2 drop-shadow rounded absolute mt-8 z-10 right-0">
                <div className="h-fit overflow-auto">
                  <div className="flex space-y-2 flex-col min-h-14 w-[150px] bg-neutral-white rounded text-center">
                    <div
                      className="flex text-lg	text-primary-60 cursor-pointer hover:underline hover:bg-primary-20"
                      onClick={() => {
                        onStatusClicked();
                      }}>
                      Status
                    </div>
                    <div
                      className="flex cursor-pointer hover:underline hover:bg-gray-20 "
                      onClick={() => {
                        onLaporanHarianClicked();
                      }}>
                      Laporan Harian
                    </div>
                    <div
                      className="flex cursor-pointer hover:underline hover:bg-gray-20 "
                      onClick={() => {
                        onLaporanBulananClicked();
                      }}>
                      Laporan Bulanan
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="h7 my-4 text-neutral-primary">
            {numberWithSeparator(total)} {subTitle}
          </div>
        </>
      )}
      {!noLine && <div className="h-px w-full bg-neutral-line" />}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div
          className={`${size} ${
            below ? "col-span-4" : row ? "col-span-2" : ""
          }`}>
          <Doughnut
            data={datas}
            options={{
              layout: {
                padding: 20,
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      return `${
                        data[context.dataIndex].label
                      }: ${numberWithSeparator(context.raw.value)}`;
                    },
                  },
                  yAlign: "bottom",
                  padding: 15,
                  backgroundColor: "#09173D",
                  displayColors: false,
                },
              },
            }}
          />
        </div>
        <div className={clsx(below ? "col-span-4" : "col-span-2", "")}>
          {sideTitle && (
            <>
              <div className="body5 font-bold text-neutral-primary">
                {title}
              </div>
              <div className="body5 mt-1 mb-2 text-neutral-primary">
                {numberWithSeparator(total)} {subTitle}
              </div>
            </>
          )}
          {row ? (
            <div className="grid grid-rows-2 gap-4 mt-2 cursor-pointer">
              {data.map((d, i) => (
                <div
                  key={i}
                  className={clsx("w-full bg-opacity-0", {
                    "hover:bg-opacity-30 rounded": onClick,
                  })}
                  style={{
                    backgroundColor: transformColor(backgroundColor)[i],
                  }}
                  onClick={() => onClick?.(i)}>
                  <div className="flex">
                    <div className="self-center">
                      <div
                        className={`w-2 h-2 rounded-full self-center mx-2 `}
                        style={{
                          backgroundColor: transformColor(backgroundColor)[i],
                        }}
                      />
                    </div>
                    <div className="col-span-2 text-neutral-primary">
                      {d.label}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-2 h-2 rounded-full self-center mx-2"></div>
                    <div className="col-span-2 text-neutral-primary">
                      {((d.value / total) * 100).toFixed(2)} %
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-2">
              {data.map((d, i) => {
                return (
                  <div
                    key={i}
                    className={clsx(`cursor-pointer flex`)}
                    onClick={() => onClick?.(i)}>
                    <div>
                      <div
                        className={`w-2 h-2 rounded-full m-2`}
                        style={{
                          backgroundColor: transformColor(backgroundColor)[i],
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-neutral-primary break-words">
                        {d.label}
                      </div>
                      <div className="text-neutral-primary">
                        {((d.value / total) * 100).toFixed(2)} %
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoughnutChart;
