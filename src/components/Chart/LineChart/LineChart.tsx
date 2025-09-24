/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import clsx from "clsx";
import Button, {
  ButtonColor,
  ButtonSize,
  ButtonType,
} from "@/components/Button";
import { useCapture } from "@/hooks/useCapture";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type LineChartProps = {
  label: string[];
  title?: string;
  upperTitle?: string;
  data: number[][];
  className?: string;
  single?: boolean;
  backgroundColor?: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  setCategory?: (value: any) => void;
  category?: string;
  colors?: string[];
  dataType?: string;
  dataSatuan?: string;
  selectedDate?: string;
  id: string;
  pt: string;
  kebun: string;
  device: string;
};

function LineChart({
  label,
  title,
  upperTitle,
  data,
  className,
  xAxisTitle = "",
  yAxisTitle = "",
  setCategory,
  colors = ["#1C9ED8", "#FFC107", "#FF5722", "#4CAF50", "#9C27B0"],
  dataSatuan,
  dataType,
  selectedDate,
  id,
  pt,
  kebun,
  device,
}: LineChartProps) {
  const dataset = React.useMemo(() => {
    const _dataset: any[] = [];

    data.map((d, index) => {
      _dataset.push({
        data: [...d],
        borderColor: colors[index % colors.length],
        backgroundColor: `${colors[index % colors.length]}33`,
        tension: 0.2,
        hitRadius: 10,
      });
    });
    return _dataset;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { pictureComponent } = useCapture(id);

  const _data = {
    labels: label,
    datasets: dataset,
  };

  const clicked = useMemo(() => {
    if (data) {
      const _clicked: any[] = [];
      data[0].map(() => {
        _clicked.push(0);
      });
      return _clicked;
    }
  }, [data]);

  const clickableLine = {
    id: "clickAbleLine",
    afterEvent(chart: any, args: any) {
      const xCursor = args.event.x;
      const yCursor = args.event.y;
      const click = args.event.type;
      if (click === "click") {
        for (let i = 0; i < chart._metasets[0].data.length; i++) {
          const xMin = chart._metasets[0].data[i].x - 10;
          const xMax = chart._metasets[0].data[i].x + 10;
          const yMin = chart._metasets[0].data[i].y - 10;
          const yMax = chart._metasets[0].data[i].y + 10;
          if (
            xCursor >= xMin &&
            xCursor <= xMax &&
            yCursor >= yMin &&
            yCursor <= yMax
          ) {
            if (clicked) {
              if (clicked[i] === 0) {
                for (let j = 0; j < clicked.length; j++) {
                  clicked[j] = 0;
                }
                clicked[i] = 1;
              } else {
                clicked[i] = 0;
              }
            }
          }
        }
      }
    },
    beforeDatasetsDraw(chart: any) {
      const {
        ctx,
        chartArea: { top, bottom },
      } = chart;
      class Line {
        width: any;
        constructor(xCoor: any) {
          this.width = xCoor;
        }
        draw(ctx: any) {
          ctx.restore();
          ctx.beginPath();
          ctx.lineWidth = 5;
          ctx.strokeStyle = "rgba(102,102,102,1)";
          ctx.moveTo(this.width, top);
          ctx.lineTo(this.width, bottom);
          ctx.stroke();
          ctx.save();
          ctx.setLineDash([]);
        }
      }
      if (clicked) {
        for (let i = 0; i < clicked.length; i++) {
          if (clicked[i] === 1) {
            const drawLine = new Line(chart._metasets[0].data[i].x);
            drawLine.draw(ctx);
          }
        }
      }
      chart.update();
    },
  };
  return (
    <div className={clsx("p-6 bg-white rounded-2xl flex flex-col", className)}>
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
          <Line
            data={_data}
            plugins={[clickableLine]}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: true, // Enable tooltip on hover
                  callbacks: {
                    title: function (tooltipItems: any) {
                      // You can customize this to be whatever title you want
                      return `Waktu: ${tooltipItems[0].label}`;
                    },
                    label: function (tooltipItem: any) {
                      return `${dataType ?? title}: ${tooltipItem.raw} ${
                        dataSatuan ?? ""
                      }`; // Custom label
                    },
                  },
                },
              },
              scales: {
                y: {
                  title: {
                    display: yAxisTitle !== "",
                    text: yAxisTitle,
                  },
                },
                x: {
                  title: {
                    display: xAxisTitle !== "",
                    text: xAxisTitle,
                  },
                },
              },
              onClick: (e: any, elements: any) => {
                const usia = _data.labels[elements[0]?.index];
                if (usia && setCategory) {
                  setCategory(usia);
                }
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LineChart;
