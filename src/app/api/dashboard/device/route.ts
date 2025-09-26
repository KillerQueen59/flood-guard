// app/api/dashboard/device/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch AWS devices
    const awsDevices = await prisma.alatAWS.findMany({
      include: {
        kebun: {
          include: {
            pt: true,
          },
        },
      },
    });

    // Fetch AWL devices
    const awlDevices = await prisma.alatAWL.findMany({
      include: {
        kebun: {
          include: {
            pt: true,
          },
        },
      },
    });

    // Combine and format devices
    const allDevices = [
      ...awsDevices.map((device) => ({
        id: device.id,
        name: device.name,
        detailName: device.detailName,
        type: "AWS",
        status: device.status,
        battery: device.battery,
        signal: device.signal,
        kebunId: device.kebunId,
        kebunName: device.kebun.name,
        sensor: device.sensor,
        ptId: device.ptId,
        ptName: device.kebun.pt.name,
      })),
      ...awlDevices.map((device) => ({
        id: device.id,
        name: device.name,
        detailName: device.detailName,
        type: "AWL",
        status: device.status,
        battery: device.battery,
        signal: device.signal,
        kebunId: device.kebunId,
        kebunName: device.kebun.name,
        ptId: device.ptId,
        ptName: device.kebun.pt.name,
      })),
    ];

    return NextResponse.json({
      success: true,
      data: allDevices,
      message: `Found ${allDevices.length} devices`,
    });
  } catch (error) {
    console.error("Error fetching device data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch device data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
