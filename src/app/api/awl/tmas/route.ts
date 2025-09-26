import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pt = searchParams.get("pt");
    const kebun = searchParams.get("kebun");
    const device = searchParams.get("device");
    const date = searchParams.get("date");

    // Build the where clause based on filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    // Date filter - if provided, filter by specific date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      whereClause.tanggal = {
        gte: startDate,
        lt: endDate,
      };
    }

    // PT filter
    if (pt && pt !== "All") {
      whereClause.kebun = {
        pt: {
          name: pt,
        },
      };
    }

    // Kebun filter
    if (kebun && kebun !== "All") {
      whereClause.kebun = {
        ...whereClause.kebun,
        name: kebun,
      };
    }

    // Device filter
    if (device && device !== "All") {
      whereClause.alatAWL = {
        name: device,
      };
    }

    const tmasData = await prisma.tMASData.findMany({
      where: whereClause,
      include: {
        kebun: {
          include: {
            pt: true,
          },
        },
        alatAWL: true,
      },
      orderBy: {
        tanggal: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: tmasData,
      message: `Found ${tmasData.length} TMAS records`,
    });
  } catch (error) {
    console.error("Error fetching TMAS data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch TMAS data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
