"use client";
import React, { useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ScriptableContext,
  LineController,
} from "chart.js";
import { Line } from "react-chartjs-2";

import clsx from "clsx";
import Button, {
  ButtonSize,
  ButtonColor,
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
  Legend,
  Filler
);

type ReferenceZone = {
  min: number;
  max: number;
  color: string;
  label?: string;
};

type ReferenceLine = {
  value: number;
  color: string;
  label?: string;
};

type LegendItem = {
  color: string;
  label: string;
};

type LineChartFillerProps = {
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
  dataType?: string;
  dataSatuan?: string;
  colors?: string[];
  selectedDate?: string;
  id: string;
  pt: string;
  kebun: string;
  device: string;
  // New optional props for reference lines and zones
  referenceZones?: ReferenceZone[];
  referenceLines?: ReferenceLine[];
  customLegend?: LegendItem[];
  showBackgroundZones?: boolean;
};

function LineChartFiller({
  label,
  title,
  upperTitle,
  data,
  className,
  xAxisTitle = "",
  yAxisTitle = "",
  setCategory,
  category,
  dataType,
  dataSatuan,
  selectedDate,
  colors = ["#1C9ED8", "#FFC107", "#FF5722", "#4CAF50", "#9C27B0"],
  id,
  pt,
  kebun,
  device,
  referenceZones,
  referenceLines,
  customLegend,
  showBackgroundZones = false,
}: LineChartFillerProps) {
  const dataset = React.useMemo(() => {
    const _dataset: any[] = [];
    data.map((d) => {
      _dataset.push({
        data: [...d],
        fill: "start",
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(71,157,255,0.5)");
          gradient.addColorStop(1, "rgba(71,157,255,0.1)");
          return gradient;
        },
        borderColor: colors[0],
        tension: 0.2,
        hitRadius: 10,
      });
    });
    return _dataset;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const _data = {
    labels: label,
    datasets: dataset,
  };

  let clicked = useMemo(() => {
    if (data) {
      const _clicked: any[] = [];
      data[0].map((d, i) => {
        _clicked.push(0);
      });
      return _clicked;
    }
  }, [data]);

  const clickableLine = {
    id: "clickAbleLine",
    afterEvent(chart: any, args: any, pluginOptions: any) {
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
    beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
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
            let drawLine = new Line(chart._metasets[0].data[i].x);
            drawLine.draw(ctx);
          }
        }
      }
      chart.update();
    },
  };

  const backgroundZonesPlugin = {
    id: "backgroundZones",
    beforeDraw: (chart: any) => {
      if (!showBackgroundZones || !referenceZones) return;

      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      const yScale = chart.scales.y;

      if (!chartArea || !yScale) return;

      // Draw background zones
      referenceZones.forEach((zone) => {
        const yTop = yScale.getPixelForValue(zone.max);
        const yBottom = yScale.getPixelForValue(zone.min);

        ctx.save();
        ctx.fillStyle = zone.color;
        ctx.fillRect(
          chartArea.left,
          yTop,
          chartArea.right - chartArea.left,
          yBottom - yTop
        );
        ctx.restore();
      });

      // Draw reference lines if provided
      if (referenceLines) {
        referenceLines.forEach((line) => {
          const y = yScale.getPixelForValue(line.value);

          ctx.save();
          ctx.strokeStyle = line.color;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(chartArea.left, y);
          ctx.lineTo(chartArea.right, y);
          ctx.stroke();
          ctx.restore();

          // Add labels for reference lines if provided
          if (line.label) {
            ctx.save();
            ctx.fillStyle = line.color;
            ctx.font = "12px Arial";
            ctx.textAlign = "right";
            ctx.fillText(line.label, chartArea.right - 5, y - 5);
            ctx.restore();
          }
        });
      }
    },
  };

  const { pictureComponent, captureComponent } = useCapture(id);

  return (
    <div className={clsx("p-6 bg-white rounded-2xl flex flex-col", className)}>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
        <div className="h6 my-2 flex-grow">{upperTitle}</div>
        <div className="flex gap-2 justify-center sm:justify-end">
          <Button
            label="PNG"
            onClick={() => {
              pictureComponent(id, "png");
            }}
            buttonSize={ButtonSize.SMALL}
            buttonColor={ButtonColor.SECONDARY}
            buttonType={ButtonType.OUTLINED}
          />
          <Button
            label="PDF"
            onClick={() => {
              captureComponent(id);
            }}
            buttonSize={ButtonSize.SMALL}
            buttonColor={ButtonColor.PRIMARY}
            buttonType={ButtonType.OUTLINED}
          />
        </div>
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

        {/* Custom Legend - only show if provided */}
        {customLegend && customLegend.length > 0 && (
          <div className="flex justify-center my-4">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              {customLegend.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 rounded"
                    style={{ backgroundColor: item.color }}></div>
                  <span className="font-medium" style={{ color: item.color }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 my-4 min-h-[300px]">
          <Line
            data={_data}
            plugins={[clickableLine, backgroundZonesPlugin]}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: true,
                  callbacks: {
                    title: function (tooltipItems: any) {
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
              scales: {
                y: {
                  title: {
                    display: yAxisTitle !== "",
                    text: yAxisTitle,
                  },
                  beginAtZero: true,
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

export default LineChartFiller;
