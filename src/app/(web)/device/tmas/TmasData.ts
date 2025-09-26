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

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};
