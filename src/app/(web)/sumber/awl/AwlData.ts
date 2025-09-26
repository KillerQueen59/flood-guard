/* eslint-disable @typescript-eslint/no-explicit-any */
export const getPt = async () => {
  try {
    const res = await fetch("/api/dashboard/pt");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const getKebun = async () => {
  try {
    const res = await fetch("/api/dashboard/kebun");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const getDevice = async () => {
  try {
    const res = await fetch("/api/dashboard/device");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await res.json();
    return result;
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

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await res.json();

    // Filter to only show AWL devices
    if (result?.data) {
      result.data = result.data.filter((device: any) => device.type === "AWL");
    }

    return result;
  } catch (err) {
    console.log(err);
  }
};
