import { NextRequest, NextResponse } from "next/server";
import { loadLookupMaps, makeError } from "@/app/api/_lib";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const ptName = request.nextUrl.searchParams.get("pt")?.trim();
    const { kebunById, ptById } = await loadLookupMaps();

    const rows = Object.values(kebunById)
      .map((kebun) => {
        const pt = ptById[kebun.ptId];
        return {
          id: kebun.id,
          name: kebun.name,
          ptId: kebun.ptId,
          pt: {
            id: pt?.id || "",
            name: pt?.name || "",
          },
        };
      })
      .filter((item) => (ptName ? item.pt.name === ptName : true))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ data: rows });
  } catch (error) {
    return makeError(
      error instanceof Error ? error.message : "Failed to fetch Kebun data",
    );
  }
}
