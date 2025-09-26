// app/api/dashboard/pt/route.ts
import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const data = await prisma.pT.findMany({
      include: {
        kebuns: true,
        alatAWS: true,
        alatAWL: true,
        dashboards: true,
      },
    }); // Fetch all PT data with related info

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching PT data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
