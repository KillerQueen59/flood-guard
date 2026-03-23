import { createClientComponentClient } from "./supabase-clients";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch(path: string, options?: RequestInit) {
  const supabase = createClientComponentClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = path.startsWith("/api/") ? path : `${API_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token && {
        Authorization: `Bearer ${session.access_token}`,
      }),
      ...options?.headers,
    },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
