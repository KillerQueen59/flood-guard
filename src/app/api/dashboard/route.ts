import { NextRequest, NextResponse } from "next/server";
import {
  fetchFromSupabaseRest,
  loadLookupMaps,
  makeError,
  normalizeStatus,
  toDashboardStatus,
} from "@/app/api/_lib";

export const runtime = "nodejs";

type DeviceType = "AWL" | "AWS";

type DashboardSummary = {
  kebunId: string;
  kebunName: string;
  ptName: string;
  deviceType: DeviceType;
  active: number;
  idle: number;
  alert: number;
  rusak: number;
};

const addStatus = (entry: DashboardSummary, rawStatus: string) => {
  const status = toDashboardStatus(rawStatus);
  entry[status] += 1;
};

export async function GET(request: NextRequest) {
  try {
    const pt = request.nextUrl.searchParams.get("pt")?.trim();
    const kebun = request.nextUrl.searchParams.get("kebun")?.trim();
    const deviceTypeParam =
      request.nextUrl.searchParams.get("deviceType")?.trim().toUpperCase() ||
      "";

    const deviceType =
      deviceTypeParam === "AWL" || deviceTypeParam === "AWS"
        ? (deviceTypeParam as DeviceType)
        : null;

    const [lookups, awsRows, awlRows] = await Promise.all([
      loadLookupMaps(),
      fetchFromSupabaseRest<
        Array<{ status: string; kebunId: string; ptId: string }>
      >("AlatAWS?select=status,kebunId,ptId"),
      fetchFromSupabaseRest<
        Array<{ status: string; kebunId: string; ptId: string }>
      >("AlatAWL?select=status,kebunId,ptId"),
    ]);

    const summaries = new Map<string, DashboardSummary>();

    const upsert = (
      source: DeviceType,
      row: { status: string; kebunId: string; ptId: string },
    ) => {
      const kebunRow = lookups.kebunById[row.kebunId];
      const ptRow =
        (kebunRow && lookups.ptById[kebunRow.ptId]) || lookups.ptById[row.ptId];

      const kebunName = kebunRow?.name || "";
      const ptName = ptRow?.name || "";

      if (pt && ptName !== pt) return;
      if (kebun && kebunName !== kebun) return;

      const key = `${source}:${row.kebunId}`;
      if (!summaries.has(key)) {
        summaries.set(key, {
          kebunId: row.kebunId,
          kebunName,
          ptName,
          deviceType: source,
          active: 0,
          idle: 0,
          alert: 0,
          rusak: 0,
        });
      }

      const entry = summaries.get(key);
      if (!entry) return;
      addStatus(entry, normalizeStatus(row.status));
    };

    if (!deviceType || deviceType === "AWS") {
      (awsRows || []).forEach((row) => upsert("AWS", row));
    }

    if (!deviceType || deviceType === "AWL") {
      (awlRows || []).forEach((row) => upsert("AWL", row));
    }

    const data = Array.from(summaries.values()).map((item) => ({
      kebun: item.kebunName,
      kebunName: item.kebunName,
      ptName: item.ptName,
      deviceType: item.deviceType,
      active: item.active,
      idle: item.idle,
      alert: item.alert,
      rusak: item.rusak,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return makeError(
      error instanceof Error ? error.message : "Failed to fetch dashboard data",
    );
  }
}
