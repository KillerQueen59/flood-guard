import dayjs from "dayjs";

export const DEFAULT_FORMAT_DATE = "DD/MM/YYYY HH:mm:ss";

export const date = (date: string | Date, format?: string) => {
  // Handle empty strings, null, undefined, or invalid dates
  if (!date || date === "") {
    return "-";
  }
  
  const dayjsDate = dayjs(date);
  
  // Check if the date is valid
  if (!dayjsDate.isValid()) {
    return "-";
  }
  
  return dayjsDate.format(format ?? DEFAULT_FORMAT_DATE);
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
