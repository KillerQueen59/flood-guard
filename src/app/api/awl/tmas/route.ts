import { NextRequest, NextResponse } from "next/server";
import {
  fetchFromSupabaseRest,
  loadLookupMaps,
  makeError,
} from "@/app/api/_lib";

export const runtime = "nodejs";

type TmasRow = {
  id: number;
  tanggal: string;
  ketinggian: number;
  kebunId: string;
  awlId: string;
  createdAt: string;
};

const getDateRange = (date?: string | null) => {
  if (!date) return null;
  const start = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

export async function GET(request: NextRequest) {
  try {
    const pt = request.nextUrl.searchParams.get("pt")?.trim();
    const kebun = request.nextUrl.searchParams.get("kebun")?.trim();
    const device = request.nextUrl.searchParams.get("device")?.trim();
    const date = request.nextUrl.searchParams.get("date")?.trim();

    const dateRange = getDateRange(date);

    const tmasBaseQuery =
      "TMASData?select=id,tanggal,ketinggian,kebunId,awlId,createdAt&order=tanggal.asc";

    const tmasQuery = dateRange
      ? `${tmasBaseQuery}&tanggal=gte.${encodeURIComponent(
          dateRange.start,
        )}&tanggal=lt.${encodeURIComponent(dateRange.end)}`
      : tmasBaseQuery;

    const [lookups, awlRows, tmasRows] = await Promise.all([
      loadLookupMaps(),
      fetchFromSupabaseRest<
        Array<{
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
        }>
      >(
        "AlatAWL?select=id,name,detailName,startDate,battery,signal,data,status,note,ptId,kebunId",
      ),
      fetchFromSupabaseRest<TmasRow[]>(tmasQuery),
    ]);

    const awlById = (awlRows || []).reduce<
      Record<string, (typeof awlRows)[number]>
    >((acc, row) => {
      acc[row.id] = row;
      return acc;
    }, {});

    const data = (tmasRows || [])
      .map((row) => {
        const kebunRow = lookups.kebunById[row.kebunId];
        const awlRow = awlById[row.awlId];
        const ptRow =
          (kebunRow && lookups.ptById[kebunRow.ptId]) ||
          (awlRow && lookups.ptById[awlRow.ptId]);

        return {
          ...row,
          kebun: {
            id: kebunRow?.id || "",
            name: kebunRow?.name || "",
            pt: {
              id: ptRow?.id || "",
              name: ptRow?.name || "",
            },
          },
          alatAWL: awlRow
            ? {
                id: awlRow.id,
                name: awlRow.name,
                detailName: awlRow.detailName,
                status: awlRow.status,
              }
            : null,
        };
      })
      .filter((item) => (pt ? item.kebun.pt.name === pt : true))
      .filter((item) => (kebun ? item.kebun.name === kebun : true))
      .filter((item) => (device ? item.alatAWL?.name === device : true));

    return NextResponse.json({ data });
  } catch (error) {
    return makeError(
      error instanceof Error ? error.message : "Failed to fetch TMAS report",
    );
  }
}
