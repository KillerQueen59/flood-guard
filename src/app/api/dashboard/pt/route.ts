import { NextResponse } from "next/server";
import { fetchFromSupabaseRest, makeError } from "@/app/api/_lib";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await fetchFromSupabaseRest<
      Array<{ id: string; name: string }>
    >("PT?select=id,name&order=name.asc");

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    return makeError(
      `Failed to fetch PT data: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
