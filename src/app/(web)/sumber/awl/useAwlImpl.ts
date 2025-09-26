/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { getAWL, getKebun, getPt } from "./AwlData";

interface Options {
  label: string;
  value: string;
  ptId?: string;
  disabled?: boolean;
}

export const useAwlImpl = () => {
  const [awl, setAWL] = useState<Options[]>([]);
  const [allAwl, setAllAwl] = useState<Options[]>([]); // Store all AWL data for filtering
  const [isLoading, setIsLoading] = useState(false);
  const [pt, setPt] = useState("");
  const [kebun, setKebun] = useState("");
  const [status, setStatus] = useState("");
  const [region, setRegion] = useState("");
  const [pts, setPts] = useState<Options[]>([]);
  const [kebuns, setKebuns] = useState<Options[]>([]);
  const [allKebuns, setAllKebuns] = useState<Options[]>([]); // Store all kebuns for filtering

  const getAWLData = useCallback(() => {
    setIsLoading(true);
    getAWL()
      .then((res) => {
        console.log("Raw AWL Device response:", res);
        if (res?.data) {
          setAllAwl(res.data); // Store all data
          setAWL(res.data); // Initially show all data
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getPTData = useCallback(() => {
    setIsLoading(true);
    getPt()
      .then((res) => {
        if (res?.data) {
          setPts([
            { label: "All", value: "" }, // Add "All" option
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

  // Filter AWL data based on selected filters
  useEffect(() => {
    let filteredData = [...allAwl];

    // Filter by PT if selected
    if (pt && pt !== "") {
      filteredData = filteredData.filter((device: any) => {
        return device.pt?.name === pt || device.ptName === pt;
      });
    }

    // Filter by Kebun if selected
    if (kebun && kebun !== "") {
      filteredData = filteredData.filter((device: any) => {
        return device.kebun?.name === kebun || device.kebunName === kebun;
      });
    }

    // Filter by Status if selected
    if (status && status !== "") {
      filteredData = filteredData.filter((device: any) => {
        return device.status.toLowerCase() === status.toLowerCase();
      });
    }

    // Filter by Region if selected (based on PT for now)
    if (region && region !== "") {
      filteredData = filteredData.filter((device: any) => {
        return device.pt?.name === region || device.ptName === region;
      });
    }

    setAWL(filteredData);
    console.log("Filtered AWL data:", filteredData);
    console.log("Applied filters:", { pt, kebun, status, region });
  }, [pt, kebun, status, region, allAwl]);

  useEffect(() => {
    getAWLData();
    getPTData();
    getKebunData();
  }, []);

  return {
    awl,
    pt: pt || "All",
    kebun: kebun || "All",
    status: status || "All",
    region: region || "All",
    pts,
    kebuns,
    loading: isLoading,
    setPt: (value: string) => {
      setPt(value);
      // Clear kebun when PT changes
      setKebun("");
    },
    setKebun: (value: string) => {
      setKebun(value);
    },
    setStatus: (value: string) => {
      setStatus(value);
    },
    setRegion: (value: string) => {
      setRegion(value);
    },
  };
};
