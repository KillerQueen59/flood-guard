import { useCallback, useEffect, useState } from "react";
import { getAWL, getKebun, getPt } from "./AwlData";

export const useAwlImpl = () => {
  const [awl, setAWL] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pt, setPt] = useState("");
  const [kebun, setKebun] = useState("");
  const [pts, setPts] = useState([]);
  const [kebuns, setKebuns] = useState<any>([]);

  const getAWLData = useCallback(() => {
    setIsLoading(true);
    getAWL()
      .then((res) => {
        if (res?.data) {
          setAWL(res.data);
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

  useEffect(() => {
    getAWLData();
    getPTData();
    getKebunData();
  }, []);

  return {
    awl,
    pt,
    kebun,
    loading: isLoading,
  };
};
