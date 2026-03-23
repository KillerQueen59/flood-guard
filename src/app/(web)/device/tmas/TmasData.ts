import { apiFetch } from "@/lib/api";

export const getPt = async () => {
  try {
    return await apiFetch("/api/dashboard/pt");
  } catch (err) {
    console.log(err);
  }
};

export const getKebun = async () => {
  try {
    return await apiFetch("/api/dashboard/kebun");
  } catch (err) {
    console.log(err);
  }
};

export const getDevice = async () => {
  try {
    return await apiFetch("/api/dashboard/device");
  } catch (err) {
    console.log(err);
  }
};

export const getTmas = async (filters?: {
  pt?: string;
  kebun?: string;
  device?: string;
  date?: string;
}) => {
  try {
    const params = new URLSearchParams();

    if (filters?.pt) params.append("pt", filters.pt);
    if (filters?.kebun) params.append("kebun", filters.kebun);
    if (filters?.device) params.append("device", filters.device);
    if (filters?.date) params.append("date", filters.date);

    const url = `/api/awl/tmas${
      params.toString() ? "?" + params.toString() : ""
    }`;

    return await apiFetch(url);
  } catch (err) {
    console.log(err);
  }
};
