// src/utils/dashboardAggregation.ts
import prisma from "@/utils/db";

export interface DashboardAggregationResult {
  ptId: string;
  ptName: string;
  kebunId: string;
  kebunName: string;
  rusak: number;
  idle: number;
  active: number;
  alert: number;
}

// Function to recalculate and update dashboard aggregations
export async function updateDashboardAggregations() {
  try {
    // Get all PT-Kebun combinations
    const kebuns = await prisma.kebun.findMany({
      include: {
        pt: true,
      },
    });

    for (const kebun of kebuns) {
      // Count AWS devices by status
      const awsStats = await prisma.alatAWS.groupBy({
        by: ["status"],
        where: {
          kebunId: kebun.id,
        },
        _count: {
          status: true,
        },
      });

      // Count AWL devices by status
      const awlStats = await prisma.alatAWL.groupBy({
        by: ["status"],
        where: {
          kebunId: kebun.id,
        },
        _count: {
          status: true,
        },
      });

      // Combine and calculate totals
      const statusCounts = { rusak: 0, idle: 0, active: 0, alert: 0 };

      [...awsStats, ...awlStats].forEach((stat) => {
        if (stat.status in statusCounts) {
          statusCounts[stat.status as keyof typeof statusCounts] +=
            stat._count.status;
        }
      });

      // Update or create dashboard record
      await prisma.alatDashboard.upsert({
        where: {
          ptId_kebunId: {
            ptId: kebun.ptId,
            kebunId: kebun.id,
          },
        },
        update: {
          ...statusCounts,
        },
        create: {
          ptId: kebun.ptId,
          kebunId: kebun.id,
          ...statusCounts,
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error updating dashboard aggregations:", error);
    return false;
  }
}

// Function to get dashboard data with PT and Kebun names
export async function getDashboardData(): Promise<
  DashboardAggregationResult[]
> {
  try {
    const dashboardData = await prisma.alatDashboard.findMany({
      include: {
        pt: true,
        kebun: true,
      },
    });

    return dashboardData.map((item) => ({
      ptId: item.ptId,
      ptName: item.pt.name,
      kebunId: item.kebunId,
      kebunName: item.kebun.name,
      rusak: item.rusak,
      idle: item.idle,
      active: item.active,
      alert: item.alert,
    }));
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return [];
  }
}
