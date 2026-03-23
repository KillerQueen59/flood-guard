import { NextResponse } from "next/server";
import {
  getSupabaseServiceKey,
  getSupabaseUrl,
  getSupabaseUrlCandidates,
} from "@/lib/supabase-config";
import { httpGetJson } from "@/lib/http-json";

type PtRow = {
  id: string;
  name: string;
};

type KebunRow = {
  id: string;
  name: string;
  ptId: string;
};

type AwsRow = {
  id: string;
  name: string;
  detailName: string;
  startDate: string;
  battery: number;
  signal: number;
  sensor: number;
  status: string;
  ptId: string;
  kebunId: string;
};

type AwlRow = {
  id: string;
  name: string;
  detailName: string;
  startDate: string;
  battery: number;
  signal: number;
  data: number;
  status: string;
  note: string;
  ptId: string;
  kebunId: string;
};

export type LookupMaps = {
  ptById: Record<string, PtRow>;
  kebunById: Record<string, KebunRow>;
};

export const normalizeStatus = (status: string) => status.toLowerCase().trim();

export const toDashboardStatus = (
  status: string,
): "active" | "idle" | "alert" | "rusak" => {
  const normalized = normalizeStatus(status);
  if (normalized === "active") return "active";
  if (normalized === "idle") return "idle";
  if (normalized === "alert") return "alert";
  return "rusak";
};

export const makeError = (message: string, status = 500) =>
  NextResponse.json({ error: message }, { status });

export const fetchFromSupabaseRest = async <T>(
  pathWithQuery: string,
): Promise<T> => {
  const baseUrl = getSupabaseUrl();
  const baseCandidates = getSupabaseUrlCandidates();
  const allCandidates = [
    baseUrl,
    ...baseCandidates.filter((url) => url !== baseUrl),
  ];
  const serviceKey = getSupabaseServiceKey();
  let lastError: unknown = null;

  for (const candidate of allCandidates) {
    const url = `${candidate}/rest/v1/${pathWithQuery}`;

    try {
      return await httpGetJson<T>(url, {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to fetch Supabase REST data from all URL candidates");
};

export const loadLookupMaps = async (): Promise<LookupMaps> => {
  const [pts, kebuns] = await Promise.all([
    fetchFromSupabaseRest<PtRow[]>("PT?select=id,name"),
    fetchFromSupabaseRest<KebunRow[]>("Kebun?select=id,name,ptId"),
  ]);

  const ptById = (pts || []).reduce<Record<string, PtRow>>((acc, pt) => {
    acc[pt.id] = pt;
    return acc;
  }, {});

  const kebunById = (kebuns || []).reduce<Record<string, KebunRow>>(
    (acc, kebun) => {
      acc[kebun.id] = kebun;
      return acc;
    },
    {},
  );

  return { ptById, kebunById };
};

export const withDeviceRelations = <T extends AwsRow | AwlRow>(
  rows: T[],
  lookups: LookupMaps,
  type: "AWS" | "AWL",
) => {
  return rows.map((row) => {
    const kebun = lookups.kebunById[row.kebunId];
    const pt = kebun ? lookups.ptById[kebun.ptId] : lookups.ptById[row.ptId];

    return {
      ...row,
      type,
      kebunName: kebun?.name || "",
      ptName: pt?.name || "",
      kebun: {
        id: kebun?.id || "",
        name: kebun?.name || "",
        pt: {
          id: pt?.id || "",
          name: pt?.name || "",
        },
      },
      pt: {
        id: pt?.id || "",
        name: pt?.name || "",
      },
    };
  });
};
