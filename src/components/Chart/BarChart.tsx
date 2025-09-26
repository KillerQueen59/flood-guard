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
  // New optional props for reference lines and zones
  referenceZones?: ReferenceZone[];
  referenceLines?: ReferenceLine[];
  customLegend?: LegendItem[];
  showBackgroundZones?: boolean;
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
  referenceZones,
  referenceLines,
  customLegend,
  showBackgroundZones = false,
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
    <div className={clsx("p-6 rounded-2xl w-full flex flex-col", className)}>
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

        <div className="flex-1 my-4 min-h-[400px]">
          <Bar
            data={_data}
            plugins={[backgroundZonesPlugin]}
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
                  beginAtZero: true,
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
