import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Type definitions
type DeviceStatus = "active" | "alert" | "rusak" | "idle";

interface DeviceConfig {
  kebunId: string;
  ptId: string;
  deviceNum: number;
  isAWS: boolean;
  status: DeviceStatus;
  battery: number;
  signal: number;
  sensorOrData: number;
  startDate: string;
  latitude?: number;
  longitude?: number;
}

interface PTData {
  id: string;
  name: string;
}

interface KebunData {
  id: string;
  name: string;
  ptId: string;
}

// Helper function to generate random data within ranges
const randomBetween = (min: number, max: number): number =>
  min + Math.random() * (max - min);
const randomInt = (min: number, max: number): number =>
  Math.floor(randomBetween(min, max + 1));

// Coordinate data from dummy markers (4 AWS + 6 AWL)
const awsCoordinates = [
  { latitude: -5.429851850082087, longitude: 105.29543396620493 },
  { latitude: -5.36937823206494, longitude: 105.24370880870089 },
  { latitude: -5.43656879134703, longitude: 105.20507955640683 },
  { latitude: -5.509417246618921, longitude: 105.35336981304408 },
];

const awlCoordinates = [
  { latitude: -5.429080603999929, longitude: 105.29203937700005 },
  { latitude: -5.441714725999895, longitude: 105.20765084200004 },
  { latitude: -5.358188552999921, longitude: 105.23212811500008 },
  { latitude: -5.447602394999876, longitude: 105.31379439400008 },
  { latitude: -5.47647021200001, longitude: 105.32362851600001 },
  { latitude: -5.476406690999988, longitude: 105.22393059700002 },
];

// Helper function to generate DateTime for September 25, 2025 with specific hour
const getTargetDateTime = (hour: number): Date => {
  return new Date(2025, 8, 25, hour, 0, 0); // September 25, 2025 at specified hour
};

async function main() {
  console.log("Starting comprehensive seed...");

  // Clear existing data
  await prisma.tMASData.deleteMany();
  await prisma.weatherData.deleteMany();
  await prisma.alatDashboard.deleteMany();
  await prisma.alatAWL.deleteMany();
  await prisma.alatAWS.deleteMany();
  await prisma.kebun.deleteMany();
  await prisma.pT.deleteMany();

  console.log("Cleared existing data...");

  // Create 2 PT (Perusahaan/Company) records
  const ptData: PTData[] = [
    { id: "1", name: "PT Agro Nusantara Sejahtera" },
    { id: "2", name: "PT Plantation Indonesia Makmur" },
  ];

  console.log("Seeding PT data...");
  for (const pt of ptData) {
    await prisma.pT.upsert({
      where: { id: pt.id },
      update: {},
      create: pt,
    });
  }

  // Create 4 Kebun (Garden/Estate) records - 2 per PT
  const kebunData: KebunData[] = [
    { id: "1", name: "Kebun Sawit Utama", ptId: "1" },
    { id: "2", name: "Kebun Kelapa Hijau", ptId: "1" },
    { id: "3", name: "Kebun Makmur Timur", ptId: "2" },
    { id: "4", name: "Kebun Makmur Barat", ptId: "2" },
  ];

  console.log("Seeding Kebun data...");
  for (const kebun of kebunData) {
    await prisma.kebun.upsert({
      where: { id: kebun.id },
      update: {},
      create: kebun,
    });
  }

  // Generate device configurations to match dummy data (4 AWS + 6 AWL = 10 total devices)
  const deviceConfigs: DeviceConfig[] = [];
  const statusOptions: DeviceStatus[] = ["active", "alert", "rusak", "idle"];

  // Define specific device configurations to match dummy data
  const deviceDistribution = [
    // PT 1, Kebun 1: 2 AWS, 2 AWL
    { ptId: "1", kebunId: "1", awsCount: 2, awlCount: 2 },
    // PT 1, Kebun 2: 1 AWS, 2 AWL
    { ptId: "1", kebunId: "2", awsCount: 1, awlCount: 2 },
    // PT 2, Kebun 3: 1 AWS, 1 AWL
    { ptId: "2", kebunId: "3", awsCount: 1, awlCount: 1 },
    // PT 2, Kebun 4: 0 AWS, 1 AWL
    { ptId: "2", kebunId: "4", awsCount: 0, awlCount: 1 },
  ];

  let deviceNum = 1;
  let awsIndex = 0;
  let awlIndex = 0;

  for (const dist of deviceDistribution) {
    // Create AWS devices for this kebun
    for (let i = 0; i < dist.awsCount; i++) {
      // Ensure at least 50% of AWS devices are active for weather data generation
      const status: DeviceStatus =
        awsIndex < 2 ? "active" : statusOptions[randomInt(0, 3)];
      const coordinates = awsCoordinates[awsIndex] || {
        latitude: 0,
        longitude: 0,
      };

      // Adjust device stats based on status
      let battery: number, signal: number, sensorOrData: number;

      switch (status) {
        case "active":
          battery = randomInt(70, 100);
          signal = randomInt(80, 100);
          sensorOrData = randomInt(7, 8); // AWS sensor count
          break;
        case "alert":
          battery = randomInt(20, 69);
          signal = randomInt(50, 79);
          sensorOrData = randomInt(5, 7); // AWS sensor count
          break;
        case "rusak":
          battery = randomInt(0, 19);
          signal = randomInt(0, 49);
          sensorOrData = randomInt(0, 4); // AWS sensor count
          break;
        case "idle":
          battery = 0;
          signal = 0;
          sensorOrData = 0;
          break;
      }

      deviceConfigs.push({
        kebunId: dist.kebunId,
        ptId: dist.ptId,
        deviceNum,
        isAWS: true,
        status,
        battery,
        signal,
        sensorOrData,
        startDate: getTargetDateTime(0).toISOString().split("T")[0],
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      deviceNum++;
      awsIndex++;
    }

    // Create AWL devices for this kebun
    for (let i = 0; i < dist.awlCount; i++) {
      // Ensure at least 50% of AWL devices are active for TMAS data generation
      const status: DeviceStatus =
        awlIndex < 3 ? "active" : statusOptions[randomInt(0, 3)];
      const coordinates = awlCoordinates[awlIndex] || {
        latitude: 0,
        longitude: 0,
      };

      // Adjust device stats based on status
      let battery: number, signal: number, sensorOrData: number;

      switch (status) {
        case "active":
          battery = randomInt(70, 100);
          signal = randomInt(80, 100);
          sensorOrData = randomInt(150, 300); // AWL data count
          break;
        case "alert":
          battery = randomInt(20, 69);
          signal = randomInt(50, 79);
          sensorOrData = randomInt(50, 149); // AWL data count
          break;
        case "rusak":
          battery = randomInt(0, 19);
          signal = randomInt(0, 49);
          sensorOrData = randomInt(0, 49); // AWL data count
          break;
        case "idle":
          battery = 0;
          signal = 0;
          sensorOrData = 0;
          break;
      }

      deviceConfigs.push({
        kebunId: dist.kebunId,
        ptId: dist.ptId,
        deviceNum,
        isAWS: false,
        status,
        battery,
        signal,
        sensorOrData,
        startDate: getTargetDateTime(0).toISOString().split("T")[0],
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      deviceNum++;
      awlIndex++;
    }
  }

  // Create AlatAWS devices
  console.log("Seeding AlatAWS data...");
  let awsCounter = 1;
  const awsDevices = deviceConfigs.filter((config) => config.isAWS);

  const createdAWSDevices = []; // Store created devices with their IDs

  for (const config of awsDevices) {
    const awsData = {
      id: awsCounter.toString(),
      name: `AWS-${awsCounter.toString().padStart(3, "0")}`,
      detailName: `Weather Station ${config.kebunId}-${config.deviceNum}`,
      startDate: config.startDate,
      battery: config.battery,
      signal: config.signal,
      sensor: config.sensorOrData,
      status: config.status,
      ptId: config.ptId,
      kebunId: config.kebunId,
    };

    await prisma.alatAWS.create({ data: awsData });

    // Store the created device info for later use
    createdAWSDevices.push({
      id: awsData.id,
      kebunId: awsData.kebunId,
      ptId: awsData.ptId,
      status: awsData.status,
    });

    awsCounter++;
  }

  // Create AlatAWL devices
  console.log("Seeding AlatAWL data...");
  let awlCounter = 1;
  const awlDevices = deviceConfigs.filter((config) => !config.isAWS);

  const createdAWLDevices = []; // Store created devices with their IDs

  const notesByStatus: Record<DeviceStatus, string[]> = {
    active: [
      "Normal operation",
      "Optimal performance",
      "Good readings",
      "Stable monitoring",
    ],
    alert: [
      "Low battery warning",
      "Signal interference",
      "Requires attention",
      "Maintenance soon",
    ],
    rusak: [
      "Requires maintenance",
      "Hardware failure",
      "Sensor malfunction",
      "Replace needed",
    ],
    idle: [
      "Temporarily offline",
      "Scheduled maintenance",
      "Standby mode",
      "Inactive",
    ],
  };

  for (const config of awlDevices) {
    const notes = notesByStatus[config.status];
    const awlData = {
      id: awlCounter.toString(),
      name: `AWL-${awlCounter.toString().padStart(3, "0")}`,
      detailName: `Water Level Monitor ${config.kebunId}-${config.deviceNum}`,
      startDate: config.startDate,
      battery: config.battery,
      signal: config.signal,
      data: config.sensorOrData,
      status: config.status,
      note: notes[randomInt(0, notes.length - 1)],
      ptId: config.ptId,
      kebunId: config.kebunId,
    };

    await prisma.alatAWL.create({ data: awlData });

    // Store the created device info for later use
    createdAWLDevices.push({
      id: awlData.id,
      kebunId: awlData.kebunId,
      ptId: awlData.ptId,
      status: awlData.status,
    });

    awlCounter++;
  }

  // Create AlatDashboard aggregations for each PT-Kebun-DeviceType combination
  console.log("Seeding AlatDashboard data with deviceType...");

  // Get unique PT-Kebun combinations from actual created devices
  const uniqueCombinations = new Set<string>();
  [...createdAWSDevices, ...createdAWLDevices].forEach((device) => {
    uniqueCombinations.add(`${device.ptId}-${device.kebunId}`);
  });

  for (const combination of uniqueCombinations) {
    const [ptId, kebunId] = combination.split("-");

    // Get AWL devices for this PT-Kebun combination
    const awlDevicesInKebun = createdAWLDevices.filter(
      (device) => device.ptId === ptId && device.kebunId === kebunId
    );

    // Get AWS devices for this PT-Kebun combination
    const awsDevicesInKebun = createdAWSDevices.filter(
      (device) => device.ptId === ptId && device.kebunId === kebunId
    );

    // Calculate AWL status counts
    const awlStatusCounts = {
      rusak: awlDevicesInKebun.filter((d) => d.status === "rusak").length,
      idle: awlDevicesInKebun.filter((d) => d.status === "idle").length,
      active: awlDevicesInKebun.filter((d) => d.status === "active").length,
      alert: awlDevicesInKebun.filter((d) => d.status === "alert").length,
    };

    // Calculate AWS status counts
    const awsStatusCounts = {
      rusak: awsDevicesInKebun.filter((d) => d.status === "rusak").length,
      idle: awsDevicesInKebun.filter((d) => d.status === "idle").length,
      active: awsDevicesInKebun.filter((d) => d.status === "active").length,
      alert: awsDevicesInKebun.filter((d) => d.status === "alert").length,
    };

    // Create AWL dashboard record
    await prisma.alatDashboard.create({
      data: {
        ptId,
        kebunId,
        deviceType: "AWL",
        rusak: awlStatusCounts.rusak,
        idle: awlStatusCounts.idle,
        active: awlStatusCounts.active,
        alert: awlStatusCounts.alert,
      },
    });

    // Create AWS dashboard record
    await prisma.alatDashboard.create({
      data: {
        ptId,
        kebunId,
        deviceType: "AWS",
        rusak: awsStatusCounts.rusak,
        idle: awsStatusCounts.idle,
        active: awsStatusCounts.active,
        alert: awsStatusCounts.alert,
      },
    });

    console.log(`Created dashboard records for PT ${ptId}, Kebun ${kebunId}:`);
    console.log(
      `  AWL - Active: ${awlStatusCounts.active}, Alert: ${awlStatusCounts.alert}, Rusak: ${awlStatusCounts.rusak}, Idle: ${awlStatusCounts.idle}`
    );
    console.log(
      `  AWS - Active: ${awsStatusCounts.active}, Alert: ${awsStatusCounts.alert}, Rusak: ${awsStatusCounts.rusak}, Idle: ${awsStatusCounts.idle}`
    );
  }

  // Create WeatherData records for September 25, 2025 (hourly data for each AWS device)
  console.log("Seeding WeatherData...");

  const weatherDataRecords: Array<{
    tanggal: Date;
    year: number;
    suhuRataRata: number;
    ch: number;
    kelembabanRelatif: number;
    tekananUdara: number;
    windSpeed: number;
    windDirec: number;
    suhuMinimal: number;
    suhuMaksimal: number;
    evapotranspirasi: number;
    radiasiSolarPanel: number;
    kebunId: string;
    awsId: string;
  }> = [];

  // Generate data for each AWS device that is active
  const activeAWSDevices = createdAWSDevices.filter(
    (device) => device.status === "active"
  );
  console.log(
    `Found ${activeAWSDevices.length} active AWS devices for WeatherData generation`
  );

  for (const awsDevice of activeAWSDevices) {
    for (let hour = 0; hour < 24; hour++) {
      // Create more realistic weather patterns
      const baseTemp = 28 + Math.sin(((hour - 6) / 24) * 2 * Math.PI) * 4; // Temperature varies with time of day
      const humidity = 80 + Math.sin((hour / 24) * 2 * Math.PI) * 15; // Humidity varies inversely with temperature

      weatherDataRecords.push({
        tanggal: getTargetDateTime(hour), // Use full DateTime
        year: 2025,
        suhuRataRata: baseTemp + randomBetween(-2, 2),
        ch: randomBetween(120, 250),
        kelembabanRelatif: Math.max(
          60,
          Math.min(95, humidity + randomBetween(-5, 5))
        ),
        tekananUdara: randomBetween(1010, 1020),
        windSpeed: randomBetween(1, 8),
        windDirec: randomBetween(0, 360),
        suhuMinimal: baseTemp - randomBetween(2, 5),
        suhuMaksimal: baseTemp + randomBetween(2, 5),
        evapotranspirasi: randomBetween(3, 7),
        radiasiSolarPanel:
          hour >= 6 && hour <= 18
            ? randomBetween(200, 1000) * Math.sin(((hour - 6) / 12) * Math.PI)
            : randomBetween(0, 50),
        kebunId: awsDevice.kebunId,
        awsId: awsDevice.id, // Link to specific AWS device
      });
    }
  }

  console.log(`Generated ${weatherDataRecords.length} WeatherData records`);

  // Batch insert weather data for performance
  for (const weather of weatherDataRecords) {
    await prisma.weatherData.create({ data: weather });
  }

  // Create TMASData records for September 25, 2025 (hourly data for each AWL device)
  console.log("Seeding TMASData...");

  const tmasDataRecords: Array<{
    tanggal: Date;
    ketinggian: number;
    kebunId: string;
    awlId: string;
  }> = [];

  // Generate data for each AWL device that is active
  const activeAWLDevices = createdAWLDevices.filter(
    (device) => device.status === "active"
  );
  console.log(
    `Found ${activeAWLDevices.length} active AWL devices for TMASData generation`
  );

  for (const awlDevice of activeAWLDevices) {
    // Base water level for this specific device (0-120 cm range, convert to meters)
    const baseLevel = randomBetween(0.3, 0.9); // 30-90 cm base level

    for (let hour = 0; hour < 24; hour++) {
      // Water level varies throughout the day with realistic patterns
      const timeOfDayVariation =
        Math.sin(((hour - 6) / 24) * 2 * Math.PI) * 0.15; // 15cm variation
      const randomVariation = randomBetween(-0.05, 0.05); // 5cm random variation
      const currentLevel = baseLevel + timeOfDayVariation + randomVariation;

      // Ensure level stays within 0-120 cm (0-1.2 m) range
      const finalLevel = Math.max(0, Math.min(1.2, currentLevel));

      tmasDataRecords.push({
        tanggal: getTargetDateTime(hour), // Use full DateTime
        ketinggian: finalLevel,
        kebunId: awlDevice.kebunId,
        awlId: awlDevice.id, // Link to specific AWL device
      });
    }
  }

  console.log(`Generated ${tmasDataRecords.length} TMASData records`);

  // Batch insert TMAS data for performance
  for (const tmas of tmasDataRecords) {
    await prisma.tMASData.create({ data: tmas });
  }

  // Calculate total dashboard records created
  const totalDashboardRecords = uniqueCombinations.size * 2; // 2 device types per combination

  // Print summary
  console.log("\n=== SEED SUMMARY ===");
  console.log(`✅ Created 2 PT companies`);
  console.log(`✅ Created 4 Kebuns (2 per PT)`);
  console.log(`✅ Created ${createdAWSDevices.length} AWS devices`);
  console.log(`✅ Created ${createdAWLDevices.length} AWL devices`);
  console.log(
    `✅ Created ${totalDashboardRecords} AlatDashboard records (${uniqueCombinations.size} PT-Kebun combinations × 2 device types)`
  );

  const activeAWSCount = createdAWSDevices.filter(
    (d) => d.status === "active"
  ).length;
  const activeAWLCount = createdAWLDevices.filter(
    (d) => d.status === "active"
  ).length;

  console.log(
    `✅ Created ${weatherDataRecords.length} WeatherData records (${activeAWSCount} active AWS devices × 24 hours)`
  );
  console.log(
    `✅ Created ${tmasDataRecords.length} TMASData records (${activeAWLCount} active AWL devices × 24 hours)`
  );

  // Status distribution
  const allDevices = [...createdAWSDevices, ...createdAWLDevices];
  const statusDist = allDevices.reduce(
    (acc: Record<string, number>, device: { status: string }) => {
      acc[device.status] = (acc[device.status] || 0) + 1;
      return acc;
    },
    {}
  );

  console.log("\nDevice Status Distribution:");
  Object.entries(statusDist).forEach(([status, count]) => {
    console.log(`  ${status}: ${count} devices`);
  });

  // Device type distribution
  console.log("\nDevice Type Distribution:");
  console.log(`  AWL: ${createdAWLDevices.length} devices`);
  console.log(`  AWS: ${createdAWSDevices.length} devices`);

  console.log("\nDashboard Records Created:");
  console.log(`  Total records: ${totalDashboardRecords}`);
  console.log(`  PT-Kebun combinations: ${uniqueCombinations.size}`);
  console.log(
    `  Each combination has separate AWL and AWS dashboard aggregations`
  );

  console.log("\nData Generation Details:");
  console.log(`  Target Date: September 25, 2025`);
  console.log(
    `  Total Device-Hours: ${(activeAWSCount + activeAWLCount) * 24}`
  );
  console.log(
    `  Expected Total Records: ${
      weatherDataRecords.length + tmasDataRecords.length
    }`
  );

  console.log("\nSeed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
