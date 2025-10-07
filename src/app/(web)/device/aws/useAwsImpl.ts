/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { getAWS, getDevice, getKebun, getPt } from "./AwsData";
import dayjs from "dayjs";

interface Options {
  label: string;
  value: string;
  ptId?: string;
  disabled?: boolean;
}

export const useAwsImpl = () => {
  // Set default date to September 25th, 2025 which has data in our seed
  const [selectedDate, setSelectedDate] = useState(new Date("2025-09-25"));

  const [tipe, setTipe] = useState("");
  const [showFilter, setShowFilter] = useState(true);
  const [pt, setPt] = useState("");
  const [pts, setPts] = useState<Options[]>([]);
  const [kebun, setKebun] = useState("");
  const [kebuns, setKebuns] = useState<Options[]>([]);
  const [allKebuns, setAllKebuns] = useState<Options[]>([]); // Store all kebuns for filtering
  const [device, setDevice] = useState("");
  const [devices, setDevices] = useState<Options[]>([]);
  const [allDevices, setAllDevices] = useState([]); // Store all devices for filtering
  const [aws, setAWS] = useState([]);
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
          const kebunData = res.data.map((item: any) => ({
            label: item.name,
            value: item.name,
            ptName: item.pt?.name || "", // Store PT relationship
          }));

          setAllKebuns(kebunData); // Store all kebuns

          // Set initial kebuns (empty if no PT selected)
          if (!pt) {
            setKebuns([
              { label: "Select PT first", value: "", disabled: true },
            ]);
          } else {
            const filteredKebuns = kebunData.filter(
              (kebun: any) => pt === "" || kebun.ptName === pt
            );
            setKebuns([{ label: "All", value: "" }, ...filteredKebuns]);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pt]);

  const getDeviceData = useCallback(() => {
    setIsLoading(true);
    getDevice()
      .then((res) => {
        if (res?.data) {
          const deviceData = res.data
            .filter((item: any) => item.type === "AWS") // Only AWS devices for weather data
            .map((item: any) => ({
              label: `${item.name} - ${item.kebunName}`,
              value: item.name,
              kebunName: item.kebunName,
              ptName: item.ptName,
            }));

          setAllDevices(deviceData); // Store all devices

          // Set initial devices (empty if no kebun selected)
          if (!kebun) {
            setDevices([
              { label: "Select Kebun first", value: "", disabled: true },
            ]);
          } else {
            const filteredDevices = deviceData.filter(
              (device: any) => kebun === "" || device.kebunName === kebun
            );
            setDevices([{ label: "All", value: "" }, ...filteredDevices]);
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [kebun]);

  const getAWSData = useCallback(() => {
    setIsLoading(true);
    getAWS()
      .then((res) => {
        console.log("Raw AWS response:", res);
        if (res?.data) {
          setAWS(res.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Update kebuns when PT changes
  useEffect(() => {
    if (pt && allKebuns.length > 0) {
      const filteredKebuns = allKebuns.filter(
        (kebun: any) => pt === "" || kebun.ptName === pt
      );
      setKebuns([{ label: "All", value: "" }, ...filteredKebuns]);
    } else if (allKebuns.length > 0) {
      setKebuns([{ label: "Select PT first", value: "", disabled: true }]);
    }
  }, [pt, allKebuns]);

  // Update devices when kebun changes
  useEffect(() => {
    if (kebun && allDevices.length > 0) {
      const filteredDevices = allDevices.filter(
        (device: any) => kebun === "" || device.kebunName === kebun
      );
      setDevices([{ label: "All", value: "" }, ...filteredDevices]);
    } else if (allDevices.length > 0) {
      setDevices([{ label: "Select Kebun first", value: "", disabled: true }]);
    }
  }, [kebun, allDevices]);

  useEffect(() => {
    getPTData();
    getAWSData();
    getKebunData();
    getDeviceData();
  }, [getPTData, getAWSData, getKebunData, getDeviceData]);

  // Apply filters to AWS data
  const filteredAws = aws.filter((data: any) => {
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
    if (device && data.alatAWS?.name !== device) {
      return false;
    }

    return true;
  });

  // Group data by hour and calculate averages for duplicates
  const groupedByHour = filteredAws.reduce((acc: any, data: any) => {
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

  console.log("Grouped AWS by hour:", groupedByHour);

  // Calculate averages for each hour
  const aggregatedAws = Object.keys(groupedByHour).map((hour) => {
    const group = groupedByHour[hour];
    const items = group.items;

    // If only one item, return it as is
    if (items.length === 1) {
      return items[0];
    }

    // Log when we're averaging duplicate hours
    console.log(`Averaging ${items.length} AWS entries for hour ${hour}`);

    // Calculate averages for all numeric fields
    const averagedData = {
      ...items[0], // Use the first item as base, keeping non-numeric fields
      suhuRataRata:
        items.reduce(
          (sum: number, item: any) => sum + (item.suhuRataRata || 0),
          0
        ) / items.length,
      ch:
        items.reduce((sum: number, item: any) => sum + (item.ch || 0), 0) /
        items.length,
      kelembabanRelatif:
        items.reduce(
          (sum: number, item: any) => sum + (item.kelembabanRelatif || 0),
          0
        ) / items.length,
      tekananUdara:
        items.reduce(
          (sum: number, item: any) => sum + (item.tekananUdara || 0),
          0
        ) / items.length,
      windSpeed:
        items.reduce(
          (sum: number, item: any) => sum + (item.windSpeed || 0),
          0
        ) / items.length,
      windDirec:
        items.reduce(
          (sum: number, item: any) => sum + (item.windDirec || 0),
          0
        ) / items.length,
      suhuMinimal:
        items.reduce(
          (sum: number, item: any) => sum + (item.suhuMinimal || 0),
          0
        ) / items.length,
      suhuMaksimal:
        items.reduce(
          (sum: number, item: any) => sum + (item.suhuMaksimal || 0),
          0
        ) / items.length,
      evapotranspirasi:
        items.reduce(
          (sum: number, item: any) => sum + (item.evapotranspirasi || 0),
          0
        ) / items.length,
      radiasiSolarPanel:
        items.reduce(
          (sum: number, item: any) => sum + (item.radiasiSolarPanel || 0),
          0
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

  console.log("Filtered and sorted AWS data:", sortedAws);
  console.log("Selected date:", dayjs(selectedDate).format("YYYY-MM-DD"));
  console.log("Applied filters:", { pt, kebun, device });

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
