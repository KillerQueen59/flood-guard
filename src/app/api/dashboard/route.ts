// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getDashboardData,
  updateDashboardAggregations,
} from "@/utils/dashboardAggregation";

export const GET = async (request: NextRequest) => {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const pt = searchParams.get("pt");
    const kebun = searchParams.get("kebun");
    const deviceType = searchParams.get("deviceType");

    // Create filters object
    const filters = {
      ...(pt && pt !== "" && { pt }),
      ...(kebun && kebun !== "" && { kebun }),
      ...(deviceType && deviceType !== "" && { deviceType }),
    };

    console.log("Dashboard API filters:", filters); // Debug log

    // Pass filters to your data fetching function
    const data = await getDashboardData(filters);

    console.log("Dashboard API data length:", data.length); // Debug log

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async () => {
  try {
    // Trigger dashboard aggregation recalculation
    const success = await updateDashboardAggregations();

    if (success) {
      return NextResponse.json({
        message: "Dashboard aggregations updated successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to update dashboard aggregations" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating dashboard aggregations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
