/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { buildApiUrl, useApiSWR } from "@/hooks/useApiSWR";

interface Options {
  label: string;
  value: string;
  ptId?: string;
  disabled?: boolean;
}

export const useAwsImpl = () => {
  const [pt, setPt] = useState("");
  const [status, setStatus] = useState("");

  const ptPath = "/api/dashboard/pt";
  const awsPath = buildApiUrl("/api/dashboard/device", {
    pt: pt || undefined,
    status: status || undefined,
  });

  const { data: ptResponse, isLoading: isPtLoading } = useApiSWR<{
    data: any[];
  }>(ptPath);
  const { data: awsResponse, isLoading: isAwsLoading } = useApiSWR<{
    data: any[];
  }>(awsPath);

  const pts: Options[] = useMemo(() => {
    const data = ptResponse?.data || [];
    return [
      { label: "All", value: "" },
      ...data.map((item: any) => ({ label: item.name, value: item.name })),
    ];
  }, [ptResponse]);

  const aws = useMemo(() => {
    const data = awsResponse?.data || [];
    return data.filter((item: any) => item.type === "AWS");
  }, [awsResponse]);

  return {
    pt: pt || "All",
    pts,
    status: status || "All",
    aws,
    loading: isPtLoading || isAwsLoading,
    setPt,
    setStatus,
  };
};
