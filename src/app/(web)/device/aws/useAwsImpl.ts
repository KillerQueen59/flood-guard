import { useCallback, useEffect, useState } from "react";
import { getAWS, getDevice, getKebun, getPt } from "./AwsData";
import dayjs from "dayjs";

export const useAwsImpl = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [tipe, setTipe] = useState("");
  const [showFilter, setShowFilter] = useState(true);
  const [pt, setPt] = useState("");
  const [pts, setPts] = useState([]);
  const [kebun, setKebun] = useState("");
  const [kebuns, setKebuns] = useState([]);
  const [device, setDevice] = useState("");
  const [devices, setDevices] = useState([]);
  const [aws, setAWS] = useState([]);
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
          setKebuns(
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

  const getDeviceData = useCallback(() => {
    setIsLoading(true);
    getDevice()
      .then((res) => {
        if (res?.data) {
          setDevices(
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

  const getAWSData = useCallback(() => {
    setIsLoading(true);
    getAWS()
      .then((res) => {
        if (res?.data) {
          setAWS(res.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getPTData();
    getAWSData();
    getKebunData();
    getDeviceData();
  }, []);

  return {
    pt,
    aws: aws.filter((data: any) => {
      return (
        data.tanggal.split(" ").length > 0 &&
        data.tanggal.split(" ")[0] === dayjs(selectedDate).format("DD/MM/YYYY")
      );
    }),
    labels: aws
      .filter((data: any) => {
        return (
          data.tanggal.split(" ").length > 0 &&
          data.tanggal.split(" ")[0] ===
            dayjs(selectedDate).format("DD/MM/YYYY")
        );
      })
      .map((data: any) => {
        return data.tanggal.split(" ")[1].slice(0, 5);
      }),
    kebun,
    device,
    selectedDate,
    kebuns,
    devices,
    pts,
    loading: isLoading,
    showFilter,
    tipe,
    setShowFilter,
    setPt,
    setKebun,
    setDevice,
    setTipe,
    setSelectedDate,
  };
};
