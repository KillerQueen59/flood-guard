import { convertToLabelValue } from "@/shared/helper";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDashboard, getKebun, getPt } from "./DashboardData";

export const useDashboardImpl = () => {
  const [pt, setPt] = useState("");
  const [kebun, setKebun] = useState("");
  const [pts, setPts] = useState([]);
  const [kebuns, setKebuns] = useState<any>([]);
  const [dashboards, setDashboards] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPTData = useCallback(() => {
    setIsLoading(true);
    getPt()
      .then((res) => {
        if (res?.data) {
          setPts(
            res.data.map((item: any) => ({
              label: item.name,
              value: item.name,
            }))
          );
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
          const _kebun = res.data
            .map((item: any) => ({
              label: item.name,
              value: item.name,
            }))
            .filter((item: any) => item.value !== "");
          setKebuns([
            {
              label: "All",
              value: "",
            },
            ..._kebun,
          ]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getDashboardData = useCallback(() => {
    setIsLoading(true);
    getDashboard()
      .then((res) => {
        if (res?.data) {
          setDashboards(res.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const dashboard = useMemo(() => {
    if (dashboards.length > 0) {
      return convertToLabelValue(dashboards, kebun);
    }
    return [];
  }, [dashboards, kebun]);

  useEffect(() => {
    getPTData();
    getKebunData();
    getDashboardData();
  }, []);

  return {
    pt,
    pts,
    kebun,
    kebuns,
    dashboard,
    showModal,
    loading: isLoading,
    setShowModal,
    setPt,
    setKebun,
  };
};
