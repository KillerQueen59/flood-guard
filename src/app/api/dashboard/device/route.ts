import { NextRequest, NextResponse } from "next/server";
import {
  fetchFromSupabaseRest,
  loadLookupMaps,
  makeError,
  withDeviceRelations,
  normalizeStatus,
} from "@/app/api/_lib";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const pt = request.nextUrl.searchParams.get("pt")?.trim();
    const kebun = request.nextUrl.searchParams.get("kebun")?.trim();
    const status = request.nextUrl.searchParams.get("status")?.trim();
    const region = request.nextUrl.searchParams.get("region")?.trim();

    const [lookups, awsRows, awlRows] = await Promise.all([
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
    ]);

    const awsWithRelations = withDeviceRelations(awsRows || [], lookups, "AWS");
    const awlWithRelations = withDeviceRelations(awlRows || [], lookups, "AWL");

    const rows = [...awsWithRelations, ...awlWithRelations]
      .filter((item) => (pt ? item.ptName === pt : true))
      .filter((item) => (kebun ? item.kebunName === kebun : true))
      .filter((item) =>
        status
          ? normalizeStatus(item.status) === normalizeStatus(status)
          : true,
      )
      .filter((item) => (region ? item.ptName === region : true))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ data: rows });
  } catch (error) {
    return makeError(
      error instanceof Error ? error.message : "Failed to fetch device data",
    );
  }
}
