/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from "@/lib/api";

interface DashboardFilters {
  pt?: string;
  kebun?: string;
  deviceType?: string; // "AWL" or "AWS"
}

export const getDashboard = async (filters?: DashboardFilters) => {
  try {
    // Build query string from filters
    const searchParams = new URLSearchParams();

    if (filters?.pt && filters.pt !== "") {
      searchParams.append("pt", filters.pt);
    }

    if (filters?.kebun && filters.kebun !== "") {
      searchParams.append("kebun", filters.kebun);
    }

    if (filters?.deviceType && filters.deviceType !== "") {
      searchParams.append("deviceType", filters.deviceType);
    }

    const queryString = searchParams.toString();
    const url = `/api/dashboard${queryString ? `?${queryString}` : ""}`;

    return await apiFetch(url);
  } catch (err) {
    console.log(err);
    return { data: [] }; // Return empty data on error
  }
};

// Get AWL dashboard data specifically
export const getAWLDashboard = async (
  filters?: Omit<DashboardFilters, "deviceType">
) => {
  return getDashboard({ ...filters, deviceType: "AWL" });
};

// Get AWS dashboard data specifically
export const getAWSDashboard = async (
  filters?: Omit<DashboardFilters, "deviceType">
) => {
  return getDashboard({ ...filters, deviceType: "AWS" });
};

export const getPt = async () => {
  try {
    return await apiFetch("/api/dashboard/pt");
  } catch (err) {
    console.log(err);
    return { data: [] }; // Return empty data on error
  }
};

export const getKebun = async (pt?: string) => {
  try {
    // Optionally filter kebun by PT
    const url =
      pt && pt !== ""
        ? `/api/dashboard/kebun?pt=${encodeURIComponent(pt)}`
        : "/api/dashboard/kebun";

    return await apiFetch(url);
  } catch (err) {
    console.log(err);
    return { data: [] }; // Return empty data on error
  }
};
