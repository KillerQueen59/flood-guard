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

// Updated to use the device API for AWS device management
export const getAWS = async (filters?: { pt?: string; status?: string }) => {
  try {
    const params = new URLSearchParams();

    if (filters?.pt) params.append("pt", filters.pt);
    if (filters?.status) params.append("status", filters.status);

    const url = `/api/dashboard/device${
      params.toString() ? "?" + params.toString() : ""
    }`;

    const result = await apiFetch(url);

    // Filter to only show AWS devices
    if (result?.data) {
      result.data = result.data.filter((device: any) => device.type === "AWS");
    }

    return result;
  } catch (err) {
    console.log(err);
  }
};
