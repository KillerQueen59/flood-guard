// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import {
  getDashboardData,
  updateDashboardAggregations,
} from "@/utils/dashboardAggregation";

export const GET = async () => {
  try {
    const data = await getDashboardData();
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
