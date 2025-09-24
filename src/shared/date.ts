import dayjs from "dayjs";

export const DEFAULT_FORMAT_DATE = "DD/MM/YYYY HH:mm:ss";

export const date = (date: string | Date, format?: string) => {
  return dayjs(date).format(format ?? DEFAULT_FORMAT_DATE);
};

export const year = (date: number) => {
  return dayjs().year(date);
};

export const now = () => {
  return dayjs();
};

export const nowYear = () => {
  return dayjs().year();
};
