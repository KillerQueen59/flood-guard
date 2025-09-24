import { useCallback, useEffect, useState } from "react";
import { getAWS, getPt } from "./AwsData";

export const useAwsImpl = () => {
  const [pt, setPt] = useState([]);
  const [aws, setAWS] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPTData = useCallback(() => {
    setIsLoading(true);
    getPt()
      .then((res) => {
        if (res?.data) {
          setPt(
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
  }, []);

  return {
    pt,
    aws,
    loading: isLoading,
  };
};
