/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { buildApiUrl, useApiSWR } from "@/hooks/useApiSWR";

interface Options {
  label: string;
  value: string;
  ptId?: string;
  disabled?: boolean;
}

export const useAwlImpl = () => {
  const [pt, setPt] = useState("");
  const [kebun, setKebun] = useState("");
  const [status, setStatus] = useState("");
  const [region, setRegion] = useState("");

  const ptPath = "/api/dashboard/pt";
  const kebunPath = pt ? buildApiUrl("/api/dashboard/kebun", { pt }) : null;
  const awlPath = buildApiUrl("/api/dashboard/device", {
    pt: pt || undefined,
    kebun: kebun || undefined,
    status: status || undefined,
  });

  const { data: ptResponse, isLoading: isPtLoading } = useApiSWR<{
    data: any[];
  }>(ptPath);
  const { data: kebunResponse, isLoading: isKebunLoading } = useApiSWR<{
    data: any[];
  }>(kebunPath);
  const { data: awlResponse, isLoading: isAwlLoading } = useApiSWR<{
    data: any[];
  }>(awlPath);

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

  const awl = useMemo(() => {
    let data = (awlResponse?.data || []).filter(
      (item: any) => item.type === "AWL",
    );

    if (region) {
      data = data.filter(
        (device: any) => device.pt?.name === region || device.ptName === region,
      );
    }

    return data;
  }, [awlResponse, region]);

  const loading = isPtLoading || isKebunLoading || isAwlLoading;

  return {
    awl,
    pt: pt || "All",
    kebun: kebun || "All",
    status: status || "All",
    region: region || "All",
    pts,
    kebuns,
    loading,
    setPt: (value: string) => {
      setPt(value);
      setKebun("");
    },
    setKebun,
    setStatus,
    setRegion,
  };
};
