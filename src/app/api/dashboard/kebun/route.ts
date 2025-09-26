// app/api/dashboard/kebun/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const kebuns = await prisma.kebun.findMany({
      include: {
        pt: true, // Include PT relationship for filtering
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedKebuns = kebuns.map((kebun) => ({
      id: kebun.id,
      name: kebun.name,
      ptId: kebun.ptId,
      pt: kebun.pt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedKebuns,
      message: `Found ${formattedKebuns.length} kebuns`,
    });
  } catch (error) {
    console.error("Error fetching kebun data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch kebun data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
