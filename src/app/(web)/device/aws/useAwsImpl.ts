/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { buildApiUrl, useApiSWR } from "@/hooks/useApiSWR";

interface Options {
  label: string;
  value: string;
  ptId?: string;
  disabled?: boolean;
}

export const useAwsImpl = () => {
  const [selectedDate, setSelectedDate] = useState(new Date("2025-09-25"));
  const [tipe, setTipe] = useState("");
  const [showFilter, setShowFilter] = useState(true);
  const [pt, setPt] = useState("");
  const [kebun, setKebun] = useState("");
  const [device, setDevice] = useState("");

  const date = dayjs(selectedDate).format("YYYY-MM-DD");

  const ptPath = "/api/dashboard/pt";
  const kebunPath = pt ? buildApiUrl("/api/dashboard/kebun", { pt }) : null;
  const devicePath = buildApiUrl("/api/dashboard/device", {
    pt: pt || undefined,
    kebun: kebun || undefined,
  });
  const awsPath = buildApiUrl("/api/aws/laporan", {
    pt: pt || undefined,
    kebun: kebun || undefined,
    device: device || undefined,
    date,
  });

  const { data: ptResponse, isLoading: isPtLoading } = useApiSWR<{
    data: any[];
  }>(ptPath);
  const { data: kebunResponse, isLoading: isKebunLoading } = useApiSWR<{
    data: any[];
  }>(kebunPath);
  const { data: deviceResponse, isLoading: isDeviceLoading } = useApiSWR<{
    data: any[];
  }>(devicePath);
  const { data: awsResponse, isLoading: isAwsLoading } = useApiSWR<{
    data: any[];
  }>(awsPath);

  const pts = useMemo(() => {
    const data = ptResponse?.data || [];
    return [
      { label: "All", value: "" },
      ...data.map((item: any) => ({ label: item.name, value: item.name })),
    ];
  }, [ptResponse]);

  const kebuns = useMemo(() => {
    if (!pt) {
      return [{ label: "Select PT first", value: "", disabled: true }];
    }

    const data = kebunResponse?.data || [];
    return [
      { label: "All", value: "" },
      ...data.map((item: any) => ({ label: item.name, value: item.name })),
    ];
  }, [kebunResponse, pt]);

  const devices = useMemo(() => {
    if (!kebun) {
      return [{ label: "Select Kebun first", value: "", disabled: true }];
    }

    const data = (deviceResponse?.data || []).filter(
      (item: any) => item.type === "AWS",
    );

    return [
      { label: "All", value: "" },
      ...data.map((item: any) => ({
        label: `${item.name} - ${item.kebunName}`,
        value: item.name,
      })),
    ];
  }, [deviceResponse, kebun]);

  const aws = useMemo(() => awsResponse?.data || [], [awsResponse]);

  // Group data by hour and calculate averages for duplicates
  const groupedByHour = aws.reduce((acc: any, data: any) => {
    const hour = dayjs(data.tanggal).format("HH:mm");

    if (!acc[hour]) {
      acc[hour] = {
        items: [],
        count: 0,
      };
    }

    acc[hour].items.push(data);
    acc[hour].count++;

    return acc;
  }, {});

  // Calculate averages for each hour
  const aggregatedAws = Object.keys(groupedByHour).map((hour) => {
    const group = groupedByHour[hour];
    const items = group.items;

    // If only one item, return it as is
    if (items.length === 1) {
      return items[0];
    }

    // Calculate averages for all numeric fields
    const averagedData = {
      ...items[0], // Use the first item as base, keeping non-numeric fields
      suhuRataRata:
        items.reduce(
          (sum: number, item: any) => sum + (item.suhuRataRata || 0),
          0,
        ) / items.length,
      ch:
        items.reduce((sum: number, item: any) => sum + (item.ch || 0), 0) /
        items.length,
      kelembabanRelatif:
        items.reduce(
          (sum: number, item: any) => sum + (item.kelembabanRelatif || 0),
          0,
        ) / items.length,
      tekananUdara:
        items.reduce(
          (sum: number, item: any) => sum + (item.tekananUdara || 0),
          0,
        ) / items.length,
      windSpeed:
        items.reduce(
          (sum: number, item: any) => sum + (item.windSpeed || 0),
          0,
        ) / items.length,
      windDirec:
        items.reduce(
          (sum: number, item: any) => sum + (item.windDirec || 0),
          0,
        ) / items.length,
      suhuMinimal:
        items.reduce(
          (sum: number, item: any) => sum + (item.suhuMinimal || 0),
          0,
        ) / items.length,
      suhuMaksimal:
        items.reduce(
          (sum: number, item: any) => sum + (item.suhuMaksimal || 0),
          0,
        ) / items.length,
      evapotranspirasi:
        items.reduce(
          (sum: number, item: any) => sum + (item.evapotranspirasi || 0),
          0,
        ) / items.length,
      radiasiSolarPanel:
        items.reduce(
          (sum: number, item: any) => sum + (item.radiasiSolarPanel || 0),
          0,
        ) / items.length,
      // Set timestamp to the earliest time for this hour
      tanggal: items[0].tanggal,
    };

    return averagedData;
  });

  // Sort by datetime for better visualization
  const sortedAws = aggregatedAws.sort((a: any, b: any) => {
    return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
  });

  const isLoading =
    isPtLoading || isKebunLoading || isDeviceLoading || isAwsLoading;

  return {
    pt: pt || "All",
    aws: sortedAws,
    labels: sortedAws.map((data: any) => {
      // Create hourly labels from DateTime
      const dateTime = dayjs(data.tanggal);
      return dateTime.format("HH:mm"); // Show only time (HH:mm format)
    }),
    kebun: kebun || "All",
    device: device || "All",
    selectedDate,
    kebuns,
    devices,
    pts,
    loading: isLoading,
    showFilter,
    tipe,
    setShowFilter,
    setPt: (value: string) => {
      setPt(value);
      // Clear dependent filters when PT changes
      setKebun("");
      setDevice("");
    },
    setKebun: (value: string) => {
      setKebun(value);
      // Clear device when kebun changes
      setDevice("");
    },
    setDevice,
    setTipe,
    setSelectedDate,
  };
};
