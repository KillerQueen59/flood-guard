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

export const getAWS = async () => {
  try {
    const res = await fetch("/api/aws");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};
