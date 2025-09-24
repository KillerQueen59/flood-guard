// app/api/awl/route.ts
import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const data = await prisma.device.findMany(); // Fetch all data

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
