import BarChart from "@/components/Chart/BarChart";
import LineChart from "@/components/Chart/LineChart/LineChart";
import LineChartFiller from "@/components/Chart/LineChart/LineChartFiller";
import TableChart from "@/components/Chart/TableChart";
import Table from "@/components/Table/Table";
import { getWindDirection } from "@/shared/helper";
import dayjs from "dayjs";
import { SetStateAction } from "react";

export type Data = {
  tanggal: string | Date; // Can be either string or Date object
  year: number;
  suhuRataRata: number;
  ch: number;
  kelembabanRelatif: number;
  tekananUdara: number;
  windSpeed: number;
  windDirec: number;
  suhuMinimal: number;
  suhuMaksimal: number;
  evapotranspirasi: number;
  radiasiSolarPanel: number;
};

export const dataType = [
  "evaportranpiration",
  "humidity",
  "rainfall",
  "rainRate",
  "solarRadiation",
  "temperature",
  "windSpeed",
  "windDirection",
];

export const RenderData = ({
  tipe,
  label,
  data,
  selectedDate,
  pt,
  kebun,
  device,
}: {
  tipe: string;
  label: string[];
  data: Data[];
  selectedDate: Date;
  pt: string;
  kebun: string;
  device: string;
}) => {
  switch (tipe) {
    case "evaportranpiration":
      return (
        <LineChartFiller
          label={label}
          upperTitle="Laporan AWS"
          title="Evapotranspirasi"
          data={[
            data.map((data) => {
              return data.evapotranspirasi;
            }),
          ]}
          xAxisTitle="Jam"
          yAxisTitle="Evapotranspirasi (mm)"
          dataSatuan="mm"
          dataType="Evapotranspirasi"
          selectedDate={dayjs(selectedDate).format("DD/MM/YYYY")}
          id="evaportranpiration"
          pt={pt}
          kebun={kebun}
          device={device}
        />
      );

    case "humidity":
      return (
        <LineChart
          label={label}
          upperTitle="Laporan AWS"
          title="Kelembaban"
          data={[
            data.map((data) => {
              return data.kelembabanRelatif;
            }),
          ]}
          xAxisTitle="Jam"
          yAxisTitle="Humidity (%)"
          dataSatuan="%"
          dataType="Humidity"
          selectedDate={dayjs(selectedDate).format("DD/MM/YYYY")}
          id="humidity"
          pt={pt}
          kebun={kebun}
          device={device}
        />
      );
    case "rainfall":
      const rainfallZone = [
        { min: 0, max: 5, color: "rgba(76, 175, 80, 0.1)" },
        { min: 5, max: 20, color: "rgba(255, 235, 59, 0.1)" },
        { min: 20, max: 50, color: "rgba(255, 152, 0, 0.1)" },
        { min: 50, max: 200, color: "rgba(244, 67, 54, 0.1)" },
      ];

      const rainfallLines = [
        { value: 5, color: "#4CAF50", label: "5 mm" },
        { value: 20, color: "#FFC107", label: "20 mm" },
        { value: 50, color: "#FF9800", label: "50 mm" },
      ];

      const rainfallLegend = [
        { color: "#4CAF50", label: "Safe (0-5 mm)" },
        { color: "#FFC107", label: "Caution (5 - 20 mm)" },
        { color: "#FF9800", label: "Warning (20-50 mm)" },
        { color: "#F44336", label: "Critical (>50 mm)" },
      ];
      return (
        <BarChart
          label={label}
          upperTitle="Laporan AWS"
          title="Curah Hujan"
          data={[
            data.map((data) => {
              return data.ch;
            }),
          ]}
          xAxisTitle="Jam"
          yAxisTitle="Rainfall (mm)"
          dataSatuan="mm"
          dataType="Rainfall"
          selectedDate={dayjs(selectedDate).format("DD/MM/YYYY")}
          id="rainfall"
          pt={pt}
          kebun={kebun}
          device={device}
          showBackgroundZones={true}
          referenceZones={rainfallZone}
          referenceLines={rainfallLines}
          customLegend={rainfallLegend}
        />
      );
    case "rainRate":
      return (
        <BarChart
          label={label}
          upperTitle="Laporan AWS"
          title="Intensitas Hujan"
          data={[
            data.map((data) => {
              return data.ch;
            }),
          ]}
          xAxisTitle="Jam"
          yAxisTitle="Rain Rate (mm/jam)"
          selectedDate={dayjs(selectedDate).format("DD/MM/YYYY")}
          id="rainRate"
          pt={pt}
          kebun={kebun}
          device={device}
        />
      );
    case "solarRadiation":
      return (
        <LineChartFiller
          label={label}
          upperTitle="Laporan AWS"
          title="Radiasi Solar Panel"
          data={[
            data.map((data) => {
              return data.radiasiSolarPanel;
            }),
          ]}
          xAxisTitle="Jam"
          yAxisTitle="Solar Radiation (W/m2)"
          dataSatuan="W/m2"
          dataType="Solar Radiation"
          selectedDate={dayjs(selectedDate).format("DD/MM/YYYY")}
          id="solarRadiation"
          pt={pt}
          kebun={kebun}
          device={device}
        />
      );
    case "temperature":
      return (
        <LineChart
          label={label}
          upperTitle="Laporan AWS"
          title="Suhu"
          data={[
            data.map((data) => {
              return data.suhuRataRata;
            }),
          ]}
          xAxisTitle="Jam"
          yAxisTitle="Temperature (°C)"
          dataSatuan="°C"
          dataType="Temperature"
          selectedDate={dayjs(selectedDate).format("DD/MM/YYYY")}
          id="temperature"
          pt={pt}
          kebun={kebun}
          device={device}
        />
      );
    case "uv":
      return (
        <LineChart
          label={label}
          upperTitle="Laporan AWS"
          title="Ultra Violet Index"
          data={[
            data.map((data) => {
              return data.ch;
            }),
          ]}
          xAxisTitle="Jam"
          yAxisTitle="Index"
          dataSatuan="index"
          dataType="Ultra Violet"
          selectedDate={dayjs(selectedDate).format("DD/MM/YYYY")}
          id="uv"
          pt={pt}
          kebun={kebun}
          device={device}
        />
      );
    case "windSpeed":
      return (
        <BarChart
          label={label}
          upperTitle="Laporan AWS"
          title="Kecepatan Angin"
          data={[
            data.map((data) => {
              return data.windSpeed;
            }),
          ]}
          xAxisTitle="Jam"
          yAxisTitle="Wind Speed (km/h)"
          dataSatuan="km/h"
          dataType="Wind Speed"
          selectedDate={dayjs(selectedDate).format("DD/MM/YYYY")}
          id="windSpeed"
          pt={pt}
          kebun={kebun}
          device={device}
        />
      );

    case "windDirection":
      return (
        <TableChart
          upperTitle="Laporan AWS"
          data={data.map((data) => {
            // Handle both DateTime objects and string dates
            const dateTime = dayjs(data.tanggal);
            return {
              date: dateTime.format("DD/MM/YYYY"),
              time: dateTime.format("HH:mm"),
              direction: getWindDirection(data.windDirec),
              data: data.windDirec,
            };
          })}
          columns={[
            {
              accessorKey: "date",
              header: () => (
                <div className="w-full text-left text-xs text-gray-80">
                  Tanggal
                </div>
              ),
              cell: (info: any) => <div>{info.row.original.date ?? "-"}</div>,

              minSize: Math.round(
                (global?.window && window.innerHeight - 55) * 0.4
              ),
            },
            {
              accessorKey: "time",
              header: () => (
                <div className="w-full text-left text-xs text-gray-80">
                  Waktu
                </div>
              ),
              cell: (info: any) => <div>{info.row.original.time ?? "-"}</div>,

              minSize: Math.round(
                (global?.window && window.innerHeight - 55) * 0.4
              ),
            },
            {
              accessorKey: "direction",
              header: () => (
                <div className="w-full text-left text-xs text-gray-80">
                  Arah
                </div>
              ),
              cell: (info: any) => (
                <div>{info.row.original.direction ?? "-"}</div>
              ),

              minSize: Math.round(
                (global?.window && window.innerHeight - 55) * 0.4
              ),
            },
            {
              accessorKey: "data",
              header: () => (
                <div className="w-full text-left text-xs text-gray-80">
                  Data
                </div>
              ),
              cell: (info: any) => <div>{info.row.original.data ?? "-"}</div>,

              minSize: Math.round(
                (global?.window && window.innerHeight - 55) * 0.4
              ),
            },
          ]}
          title="Arah Angin"
          selectedDate={dayjs(selectedDate).format("DD/MM/YYYY")}
          id="windDirection"
          pt={pt}
          kebun={kebun}
          device={device}
        />
      );
  }
  return (
    <div className="m-4 align-center justify-center">no data selected</div>
  );
};

export default RenderData;
