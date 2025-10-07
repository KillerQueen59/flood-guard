/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { getTmas, getDevice, getKebun, getPt } from "./TmasData";
import dayjs from "dayjs";

interface Options {
  label: string;
  value: string;
  ptId?: string;
  disabled?: boolean;
}

export const useTmasImpl = () => {
  // Set default date to September 25th, 2025 which has data in our seed
  const [selectedDate, setSelectedDate] = useState(new Date("2025-09-25"));

  const [showFilter, setShowFilter] = useState(true);
  const [pt, setPt] = useState("");
  const [pts, setPts] = useState<Options[]>([]);
  const [kebun, setKebun] = useState("");
  const [kebuns, setKebuns] = useState<Options[]>([]);
  const [device, setDevice] = useState("");
  const [devices, setDevices] = useState<Options[]>([]);
  const [tmas, setTMAS] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPTData = useCallback(() => {
    setIsLoading(true);
    getPt()
      .then((res) => {
        if (res?.data) {
          setPts([
            { label: "All", value: "" },
            ...res.data.map((item: any) => ({
              label: item.name,
              value: item.name,
            })),
          ]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getKebunData = useCallback(() => {
    setIsLoading(true);
    getKebun()
      .then((res) => {
        if (res?.data) {
          setKebuns([
            { label: "All", value: "" }, // Add "All" option
            ...res.data.map((item: any) => ({
              label: item.name,
              value: item.name,
              ptName: item.pt?.name || "",
            })),
          ]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getDeviceData = useCallback(() => {
    setIsLoading(true);
    getDevice()
      .then((res) => {
        if (res?.data) {
          setDevices([
            { label: "All", value: "" }, // Add "All" option
            ...res.data
              .filter((item: any) => item.type === "AWL") // Only AWL devices for TMAS
              .map((item: any) => ({
                label: `${item.name} - ${item.kebunName}`, // Show device name with kebun
                value: item.name,
                kebunName: item.kebunName,
              })),
          ]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getTmasData = useCallback(() => {
    setIsLoading(true);
    getTmas()
      .then((res) => {
        console.log("Raw TMAS response:", res);
        if (res?.data) {
          setTMAS(res.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getPTData();
    getTmasData();
    getKebunData();
    getDeviceData();
  }, [getPTData, getTmasData, getKebunData, getDeviceData]);

  // Apply filters to TMAS data
  const filteredTmas = tmas.filter((data: any) => {
    // Filter by date (compare only the date part)
    const dataDate = dayjs(data.tanggal).format("YYYY-MM-DD");
    const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");

    if (dataDate !== selectedDateStr) {
      return false;
    }

    // Filter by PT (if selected)
    if (pt && data.kebun?.pt?.name !== pt) {
      return false;
    }

    // Filter by Kebun (if selected)
    if (kebun && data.kebun?.name !== kebun) {
      return false;
    }

    // Filter by Device (if selected)
    if (device && data.alatAWL?.name !== device) {
      return false;
    }

    return true;
  });

  // Group data by hour and calculate averages for duplicates
  const groupedByHour = filteredTmas.reduce((acc: any, data: any) => {
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

  console.log("Grouped TMAS by hour:", groupedByHour);

  // Calculate averages for each hour
  const aggregatedTmas = Object.keys(groupedByHour).map((hour) => {
    const group = groupedByHour[hour];
    const items = group.items;

    // If only one item, return it as is
    if (items.length === 1) {
      return items[0];
    }

    // Log when we're averaging duplicate hours
    console.log(`Averaging ${items.length} TMAS entries for hour ${hour}`);

    // Calculate averages for ketinggian (water level height)
    const averagedData = {
      ...items[0], // Use the first item as base, keeping non-numeric fields
      ketinggian:
        items.reduce(
          (sum: number, item: any) => sum + (item.ketinggian || 0),
          0
        ) / items.length,
      // Set timestamp to the earliest time for this hour
      tanggal: items[0].tanggal,
    };

    return averagedData;
  });

  // Sort by datetime for better visualization
  const sortedTmas = aggregatedTmas.sort((a: any, b: any) => {
    return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
  });

  console.log("Filtered and sorted TMAS data:", sortedTmas);
  console.log("Selected date:", dayjs(selectedDate).format("YYYY-MM-DD"));
  console.log("Applied filters:", { pt, kebun, device });

  // Filter devices based on selected kebun
  const filteredDevices = devices.filter((dev: any) => {
    if (!kebun) return true; // Show all if no kebun selected
    return dev.kebunName === kebun;
  });

  return {
    pt: pt || "All",
    tmas: sortedTmas,
    labels: sortedTmas.map((data: any) => {
      // Create hourly labels from DateTime
      const dateTime = dayjs(data.tanggal);
      return dateTime.format("HH:mm"); // Show only time (HH:mm format)
    }),
    kebun: kebun || "All",
    device: device || "All",
    selectedDate,
    kebuns,
    devices: filteredDevices,
    pts,
    loading: isLoading,
    showFilter,
    setShowFilter,
    setPt: (value: string) => {
      setPt(value);
      // Reset dependent filters when PT changes
      if (value !== pt) {
        setKebun("");
        setDevice("");
      }
    },
    setKebun: (value: string) => {
      setKebun(value);
      // Reset device when kebun changes
      if (value !== kebun) {
        setDevice("");
      }
    },
    setDevice,
    setSelectedDate,
  };
};
