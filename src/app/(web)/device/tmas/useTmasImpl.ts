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

export const useTmasImpl = () => {
  const [selectedDate, setSelectedDate] = useState(new Date("2025-09-25"));
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
  const tmasPath = buildApiUrl("/api/awl/tmas", {
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
  const { data: tmasResponse, isLoading: isTmasLoading } = useApiSWR<{
    data: any[];
  }>(tmasPath);

  const pts: Options[] = useMemo(() => {
    const data = ptResponse?.data || [];
    return [
      { label: "All", value: "" },
      ...data.map((item: any) => ({ label: item.name, value: item.name })),
    ];
  }, [ptResponse]);

  const kebuns: Options[] = useMemo(() => {
    if (!pt) {
      return [{ label: "Select PT first", value: "", disabled: true }];
    }

    const data = kebunResponse?.data || [];
    return [
      { label: "All", value: "" },
      ...data.map((item: any) => ({ label: item.name, value: item.name })),
    ];
  }, [kebunResponse, pt]);

  const devices: Options[] = useMemo(() => {
    if (!kebun) {
      return [{ label: "Select Kebun first", value: "", disabled: true }];
    }

    const data = (deviceResponse?.data || []).filter(
      (item: any) => item.type === "AWL",
    );

    return [
      { label: "All", value: "" },
      ...data.map((item: any) => ({
        label: `${item.name} - ${item.kebunName}`,
        value: item.name,
      })),
    ];
  }, [deviceResponse, kebun]);

  const tmas = useMemo(() => {
    const data = tmasResponse?.data || [];

    return data.filter((item: any) => {
      const itemDate = dayjs(item.tanggal).format("YYYY-MM-DD");
      if (itemDate !== date) return false;
      if (pt && item.kebun?.pt?.name !== pt) return false;
      if (kebun && item.kebun?.name !== kebun) return false;
      if (device && item.alatAWL?.name !== device) return false;
      return true;
    });
  }, [tmasResponse, date, pt, kebun, device]);

  const groupedByHour = tmas.reduce((acc: any, data: any) => {
    const hour = dayjs(data.tanggal).format("HH:mm");

    if (!acc[hour]) {
      acc[hour] = {
        items: [],
      };
    }

    acc[hour].items.push(data);
    return acc;
  }, {});

  const aggregatedTmas = Object.keys(groupedByHour).map((hour) => {
    const items = groupedByHour[hour].items;

    if (items.length === 1) {
      return items[0];
    }

    return {
      ...items[0],
      ketinggian:
        items.reduce(
          (sum: number, item: any) => sum + (item.ketinggian || 0),
          0,
        ) / items.length,
      tanggal: items[0].tanggal,
    };
  });

  const sortedTmas = aggregatedTmas.sort((a: any, b: any) => {
    return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
  });

  const loading =
    isPtLoading || isKebunLoading || isDeviceLoading || isTmasLoading;

  return {
    pt: pt || "All",
    tmas: sortedTmas,
    labels: sortedTmas.map((data: any) => dayjs(data.tanggal).format("HH:mm")),
    kebun: kebun || "All",
    device: device || "All",
    selectedDate,
    kebuns,
    devices,
    pts,
    loading,
    showFilter,
    setShowFilter,
    setPt: (value: string) => {
      setPt(value);
      setKebun("");
      setDevice("");
    },
    setKebun: (value: string) => {
      setKebun(value);
      setDevice("");
    },
    setDevice,
    setSelectedDate,
  };
};
