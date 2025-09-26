/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/dashboardAggregation.ts
import prisma from "@/utils/db";

export interface DashboardAggregationResult {
  ptId: string;
  ptName: string;
  kebunId: string;
  kebunName: string;
  deviceType: string; // "AWL" or "AWS"
  rusak: number;
  idle: number;
  active: number;
  alert: number;
}

export interface DashboardFilters {
  pt?: string;
  kebun?: string;
  deviceType?: string; // "AWL" or "AWS"
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

      // Calculate AWL totals
      const awlStatusCounts = { rusak: 0, idle: 0, active: 0, alert: 0 };
      awlStats.forEach((stat) => {
        if (stat.status in awlStatusCounts) {
          awlStatusCounts[stat.status as keyof typeof awlStatusCounts] +=
            stat._count.status;
        }
      });

      // Calculate AWS totals
      const awsStatusCounts = { rusak: 0, idle: 0, active: 0, alert: 0 };
      awsStats.forEach((stat) => {
        if (stat.status in awsStatusCounts) {
          awsStatusCounts[stat.status as keyof typeof awsStatusCounts] +=
            stat._count.status;
        }
      });

      // Update or create AWL dashboard record
      await prisma.alatDashboard.upsert({
        where: {
          ptId_kebunId_deviceType: {
            ptId: kebun.ptId,
            kebunId: kebun.id,
            deviceType: "AWL",
          },
        },
        update: {
          ...awlStatusCounts,
        },
        create: {
          ptId: kebun.ptId,
          kebunId: kebun.id,
          deviceType: "AWL",
          ...awlStatusCounts,
        },
      });

      // Update or create AWS dashboard record
      await prisma.alatDashboard.upsert({
        where: {
          ptId_kebunId_deviceType: {
            ptId: kebun.ptId,
            kebunId: kebun.id,
            deviceType: "AWS",
          },
        },
        update: {
          ...awsStatusCounts,
        },
        create: {
          ptId: kebun.ptId,
          kebunId: kebun.id,
          deviceType: "AWS",
          ...awsStatusCounts,
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error updating dashboard aggregations:", error);
    return false;
  }
}

// Function to get dashboard data with filtering support
export async function getDashboardData(
  filters: DashboardFilters = {}
): Promise<DashboardAggregationResult[]> {
  try {
    // Build where clause for filtering
    const whereClause: any = {};

    // Filter by PT name
    if (filters.pt) {
      whereClause.pt = {
        name: filters.pt,
      };
    }

    // Filter by Kebun name
    if (filters.kebun) {
      whereClause.kebun = {
        name: filters.kebun,
      };
    }

    // Filter by device type
    if (filters.deviceType) {
      whereClause.deviceType = filters.deviceType;
    }

    const dashboardData = await prisma.alatDashboard.findMany({
      where: whereClause,
      include: {
        pt: true,
        kebun: true,
      },
      orderBy: [
        { deviceType: "asc" }, // AWL first, then AWS
        { pt: { name: "asc" } },
        { kebun: { name: "asc" } },
      ],
    });

    return dashboardData.map((item) => ({
      ptId: item.ptId,
      ptName: item.pt.name,
      kebunId: item.kebunId,
      kebunName: item.kebun.name,
      deviceType: item.deviceType,
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

// Function to get AWL data specifically
export async function getAWLDashboardData(
  filters: Omit<DashboardFilters, "deviceType"> = {}
): Promise<DashboardAggregationResult[]> {
  return getDashboardData({ ...filters, deviceType: "AWL" });
}

// Function to get AWS data specifically
export async function getAWSDashboardData(
  filters: Omit<DashboardFilters, "deviceType"> = {}
): Promise<DashboardAggregationResult[]> {
  return getDashboardData({ ...filters, deviceType: "AWS" });
}

// Function to get all PT data (unchanged)
export async function getPtData() {
  try {
    const pts = await prisma.pT.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return pts.map((pt) => ({
      id: pt.id,
      name: pt.name,
    }));
  } catch (error) {
    console.error("Error fetching PT data:", error);
    return [];
  }
}

// Function to get kebun data with optional PT filtering (unchanged)
export async function getKebunData(ptFilter?: string) {
  try {
    const whereClause: any = {};

    // Filter kebuns by PT if provided
    if (ptFilter) {
      whereClause.pt = {
        name: ptFilter,
      };
    }

    const kebuns = await prisma.kebun.findMany({
      where: whereClause,
      include: {
        pt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return kebuns.map((kebun) => ({
      id: kebun.id,
      name: kebun.name,
      ptId: kebun.ptId,
      ptName: kebun.pt.name,
    }));
  } catch (error) {
    console.error("Error fetching Kebun data:", error);
    return [];
  }
}
