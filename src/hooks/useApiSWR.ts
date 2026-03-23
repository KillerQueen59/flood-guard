import useSWR, { SWRConfiguration } from "swr";
import { apiFetch } from "@/lib/api";

type QueryValue = string | number | boolean | null | undefined;

export const buildApiUrl = (
  path: string,
  query?: Record<string, QueryValue>,
): string => {
  if (!query) return path;

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
};

export const useApiSWR = <T>(
  path: string | null,
  config?: SWRConfiguration<T, Error>,
) => {
  return useSWR<T, Error>(path, (url: string) => apiFetch(url), {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    ...config,
  });
};
