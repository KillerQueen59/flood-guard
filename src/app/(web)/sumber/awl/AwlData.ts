/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Updated to use the device API for AWL device management
export const getAWL = async (filters?: {
  pt?: string;
  kebun?: string;
  status?: string;
  region?: string;
}) => {
  try {
    const params = new URLSearchParams();

    if (filters?.pt) params.append("pt", filters.pt);
    if (filters?.kebun) params.append("kebun", filters.kebun);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.region) params.append("region", filters.region);

    const url = `/api/dashboard/device${
      params.toString() ? "?" + params.toString() : ""
    }`;

    const result = await apiFetch(url);

    // Filter to only show AWL devices
    if (result?.data) {
      result.data = result.data.filter((device: any) => device.type === "AWL");
    }

    return result;
  } catch (err) {
    console.log(err);
  }
};
