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

export const getTmas = async () => {
  try {
    const res = await fetch("/api/awl/tmas");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};
