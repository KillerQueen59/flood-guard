import { NextRequest, NextResponse } from "next/server";
import {
  fetchFromSupabaseRest,
  loadLookupMaps,
  makeError,
} from "@/app/api/_lib";

export const runtime = "nodejs";

type WeatherRow = {
  id: number;
  tanggal: string;
  year: number;
  suhuRataRata: number;
  ch: number;
  kelembabanRelatif: number;
  tekananUdara: number;
  windSpeed: number;
  windDirec: number;
  suhuMinimal: number;
  suhuMaksimal: number;
  evapotranspirasi: number;
  radiasiSolarPanel: number;
  kebunId: string;
  awsId: string;
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

    const weatherBaseQuery =
      "WeatherData?select=id,tanggal,year,suhuRataRata,ch,kelembabanRelatif,tekananUdara,windSpeed,windDirec,suhuMinimal,suhuMaksimal,evapotranspirasi,radiasiSolarPanel,kebunId,awsId,createdAt&order=tanggal.asc";

    const weatherQuery = dateRange
      ? `${weatherBaseQuery}&tanggal=gte.${encodeURIComponent(
          dateRange.start,
        )}&tanggal=lt.${encodeURIComponent(dateRange.end)}`
      : weatherBaseQuery;

    const [lookups, awsRows, weatherRows] = await Promise.all([
      loadLookupMaps(),
      fetchFromSupabaseRest<
        Array<{
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
        }>
      >(
        "AlatAWS?select=id,name,detailName,startDate,battery,signal,sensor,status,ptId,kebunId",
      ),
      fetchFromSupabaseRest<WeatherRow[]>(weatherQuery),
    ]);

    const awsById = (awsRows || []).reduce<
      Record<string, (typeof awsRows)[number]>
    >((acc, row) => {
      acc[row.id] = row;
      return acc;
    }, {});

    const data = (weatherRows || [])
      .map((row) => {
        const kebunRow = lookups.kebunById[row.kebunId];
        const awsRow = awsById[row.awsId];
        const ptRow =
          (kebunRow && lookups.ptById[kebunRow.ptId]) ||
          (awsRow && lookups.ptById[awsRow.ptId]);

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
          alatAWS: awsRow
            ? {
                id: awsRow.id,
                name: awsRow.name,
                detailName: awsRow.detailName,
                status: awsRow.status,
              }
            : null,
        };
      })
      .filter((item) => (pt ? item.kebun.pt.name === pt : true))
      .filter((item) => (kebun ? item.kebun.name === kebun : true))
      .filter((item) => (device ? item.alatAWS?.name === device : true));

    return NextResponse.json({ data });
  } catch (error) {
    return makeError(
      error instanceof Error ? error.message : "Failed to fetch AWS report",
    );
  }
}
