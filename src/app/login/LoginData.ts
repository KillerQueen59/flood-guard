import { toast } from "react-toastify";

export const login = async (data: { email: string; password: string }) => {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.error);
    throw new Error(errorData.error || "Login failed");
  }
  const result = await response.json();
  return result;
};
