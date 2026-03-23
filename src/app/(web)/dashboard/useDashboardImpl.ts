/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertToLabelValue } from "@/shared/helper";
import { useMemo, useState } from "react";
import { buildApiUrl, useApiSWR } from "@/hooks/useApiSWR";

interface Options {
  label: string;
  value: string;
  ptId?: string;
  disabled?: boolean;
}

export const useDashboardImpl = () => {
  const [pt, setPt] = useState("");
  const [kebun, setKebun] = useState("");
  const [showModal, setShowModal] = useState(false);

  const ptPath = "/api/dashboard/pt";
  const kebunPath = buildApiUrl("/api/dashboard/kebun", {
    pt: pt || undefined,
  });
  const awlPath = buildApiUrl("/api/dashboard", {
    pt: pt || undefined,
    kebun: kebun || undefined,
    deviceType: "AWL",
  });
  const awsPath = buildApiUrl("/api/dashboard", {
    pt: pt || undefined,
    kebun: kebun || undefined,
    deviceType: "AWS",
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
  const { data: awsResponse, isLoading: isAwsLoading } = useApiSWR<{
    data: any[];
  }>(awsPath);

  const pts = useMemo(() => {
    const data = ptResponse?.data || [];
    const options = data.map((item: any) => ({
      label: item.name,
      value: item.name,
    }));

    return [{ label: "All", value: "" }, ...options];
  }, [ptResponse]);

  const kebuns = useMemo(() => {
    const data = kebunResponse?.data || [];
    const options = data.map((item: any) => ({
      label: item.name,
      value: item.name,
    }));

    return [{ label: "All", value: "" }, ...options];
  }, [kebunResponse]);

  // Separate dashboard data for AWL and AWS
  const awlDashboard = useMemo(() => {
    const awlDashboards = awlResponse?.data || [];
    if (awlDashboards.length > 0) {
      return convertToLabelValue(awlDashboards, kebun);
    }
    return [];
  }, [awlResponse, kebun]);

  const awsDashboard = useMemo(() => {
    const awsDashboards = awsResponse?.data || [];
    if (awsDashboards.length > 0) {
      return convertToLabelValue(awsDashboards, kebun);
    }
    return [];
  }, [awsResponse, kebun]);

  const loading = isPtLoading || isKebunLoading || isAwlLoading || isAwsLoading;

  return {
    pt,
    pts,
    kebun,
    kebuns,
    awlDashboard,
    awsDashboard,
    showModal,
    loading,
    setShowModal,
    setPt: (nextPt: string) => {
      setPt(nextPt);
      setKebun("");
    },
    setKebun,
  };
};
