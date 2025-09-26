/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { getAWS, getPt } from "./AwsData";

interface Options {
  label: string;
  value: string;
  ptId?: string;
  disabled?: boolean;
}

export const useAwsImpl = () => {
  const [pt, setPt] = useState("");
  const [pts, setPts] = useState<Options[]>([]);
  const [status, setStatus] = useState("");
  const [aws, setAWS] = useState<Options[]>([]);
  const [allAws, setAllAws] = useState<Options[]>([]); // Store all AWS data for filtering
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

  const getAWSData = useCallback(() => {
    setIsLoading(true);
    getAWS()
      .then((res) => {
        console.log("Raw AWS Device response:", res);
        if (res?.data) {
          setAllAws(res.data); // Store all data
          setAWS(res.data); // Initially show all data
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filter AWS data based on selected filters
  useEffect(() => {
    let filteredData = [...allAws];

    console.log("Filtering AWS data with:", { pt, status, allAws });

    // Filter by PT if selected
    if (pt && pt !== "") {
      filteredData = filteredData.filter((device: any) => {
        // Check if device has PT relationship
        return device.ptName === pt;
      });
    }

    // Filter by Status if selected
    if (status && status !== "") {
      filteredData = filteredData.filter((device: any) => {
        return device.status.toLowerCase() === status.toLowerCase();
      });
    }

    setAWS(filteredData);
  }, [pt, status, allAws]);

  useEffect(() => {
    getPTData();
    getAWSData();
  }, []);

  return {
    pt: pt || "All",
    pts,
    status: status || "All",
    aws,
    loading: isLoading,
    setPt: (value: string) => {
      setPt(value);
    },
    setStatus: (value: string) => {
      setStatus(value);
    },
  };
};
