"use client";
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import clsx from "clsx";
import Button, { ButtonSize, ButtonColor, ButtonType } from "../Button";
import { useCapture } from "@/hooks/useCapture";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

type BarChartProps = {
  label: string[];
  title?: string;
  upperTitle?: string;
  data: number[] | number[][];
  className?: string;
  single?: boolean;
  backgroundColor?: string[];
  setCategory?: (value: any) => void;
  category?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  dataType?: string;
  dataSatuan?: string;
  selectedDate?: string;
  id: string;
  pt: string;
  kebun: string;
  device: string;
};

function BarChart({
  label,
  data,
  title = "",
  upperTitle = "",
  className,
  single = false,
  category,
  setCategory,
  xAxisTitle,
  yAxisTitle,
  dataType,
  dataSatuan,
  selectedDate,
  id,
  pt,
  kebun,
  device,
}: BarChartProps) {
  let dataset = [];
  const color = useMemo(() => {
    const _color: string[] = [];
    data.map((t: any, i: any) => {
      if (category === i) {
        _color.push("#000000");
      }
      return _color.push("#1C9ED8");
    });
    return _color;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, category]);

  if (single) {
    dataset.push({
      data: data,
      backgroundColor: color,
      borderRadius: 8,
    });
  } else {
    data.map((d) => {
      dataset.push({
        data: Array.isArray(d) ? [...d] : [d],
        backgroundColor: color,
        borderRadius: 8,
      });
    });
  }

  const _data = {
    labels: label,
    datasets: dataset,
  };

  const { pictureComponent } = useCapture(id);

  return (
    <div className={clsx("p-6 rounded-2xl w-full flex flex-col", className)}>
      <div className="flex">
        <div className="h6 my-2 flex-grow">{upperTitle}</div>
        <Button
          label="Download Grafik"
          onClick={() => {
            pictureComponent(id, "png");
          }}
          buttonSize={ButtonSize.SMALL}
          buttonColor={ButtonColor.SECONDARY}
          buttonType={ButtonType.OUTLINED}
        />
      </div>
      <div className="p-4" id={id}>
        <div className="flex flex-col space-y-1 my-4">
          <div className="text-sm flex w-full">
            <div className="w-[10%]">PT</div>
            <div className="w-[1%] ">:</div>
            <div className="w-[89%]">{pt}</div>
          </div>
          <div className="text-sm flex w-full">
            <div className="w-[10%]">Kebun</div>
            <div className="w-[1%] ">:</div>
            <div className="w-[89%]">{kebun}</div>
          </div>
          <div className="text-sm flex w-full">
            <div className="w-[10%]">Device</div>
            <div className="w-[1%] ">:</div>
            <div className="w-[89%]">{device}</div>
          </div>
          <div className="text-sm flex w-full">
            <div className="w-[10%]">Tanggal</div>
            <div className="w-[1%] ">:</div>
            <div className="w-[89%]">{selectedDate ?? "-"}</div>
          </div>
        </div>
        <div className="text-lg text-center">{title}</div>
        <div className="flex-1 my-4 min-h-[400px]">
          <Bar
            data={_data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  title: {
                    display: true,
                    text: yAxisTitle,
                  },
                  grid: {
                    display: !single,
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: xAxisTitle,
                  },
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    title: function (tooltipItems: any) {
                      // You can customize this to be whatever title you want
                      return `Waktu: ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                      return `${dataType ?? title}: ${tooltipItem.raw} ${
                        dataSatuan ?? ""
                      }`;
                    },
                  },
                },
              },
              onClick: (e: any, elements: any) => {
                if (elements.length) {
                  if (setCategory) {
                    const kategori = elements[0].index;
                    setCategory(kategori);
                  }
                }
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BarChart;
