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

  // Real AWS data from CSV for September 25, 2025 (24 hours)
  const realAWSData = [
    {
      hour: 0,
      suhuRataRata: 27.18,
      ch: 3,
      kelembabanRelatif: 19.1,
      tekananUdara: 100.72,
      windSpeed: 1.45,
      windDirec: 124.88,
      suhuMinimal: 24.72,
      suhuMaksimal: 30.44,
      evapotranspirasi: 0.1,
      radiasiSolarPanel: 0,
    },
    {
      hour: 1,
      suhuRataRata: 26.94,
      ch: 3.75,
      kelembabanRelatif: 19.35,
      tekananUdara: 100.83,
      windSpeed: 1.42,
      windDirec: 158.25,
      suhuMinimal: 24.83,
      suhuMaksimal: 29.44,
      evapotranspirasi: 0.07,
      radiasiSolarPanel: 0,
    },
    {
      hour: 2,
      suhuRataRata: 26.23,
      ch: 4.67,
      kelembabanRelatif: 18.55,
      tekananUdara: 100.91,
      windSpeed: 1.05,
      windDirec: 155,
      suhuMinimal: 24.25,
      suhuMaksimal: 28.26,
      evapotranspirasi: 0.06,
      radiasiSolarPanel: 0,
    },
    {
      hour: 3,
      suhuRataRata: 26.69,
      ch: 0.41,
      kelembabanRelatif: 18.01,
      tekananUdara: 100.79,
      windSpeed: 1.32,
      windDirec: 139.31,
      suhuMinimal: 23.34,
      suhuMaksimal: 30.04,
      evapotranspirasi: 0.05,
      radiasiSolarPanel: 0,
    },
    {
      hour: 4,
      suhuRataRata: 26.59,
      ch: 5.16,
      kelembabanRelatif: 18.43,
      tekananUdara: 100.78,
      windSpeed: 1.19,
      windDirec: 222.12,
      suhuMinimal: 24.2,
      suhuMaksimal: 29.16,
      evapotranspirasi: 0.04,
      radiasiSolarPanel: 0,
    },
    {
      hour: 5,
      suhuRataRata: 23.63,
      ch: 4.96,
      kelembabanRelatif: 16.05,
      tekananUdara: 100.98,
      windSpeed: 2.45,
      windDirec: 204.69,
      suhuMinimal: 21.85,
      suhuMaksimal: 25.23,
      evapotranspirasi: 0.05,
      radiasiSolarPanel: 0,
    },
    {
      hour: 6,
      suhuRataRata: 25.74,
      ch: 0.88,
      kelembabanRelatif: 15.2,
      tekananUdara: 100.99,
      windSpeed: 1.04,
      windDirec: 141,
      suhuMinimal: 22.03,
      suhuMaksimal: 29.42,
      evapotranspirasi: 0.1,
      radiasiSolarPanel: 12.5,
    },
    {
      hour: 7,
      suhuRataRata: 26.79,
      ch: 1.13,
      kelembabanRelatif: 17.88,
      tekananUdara: 100.96,
      windSpeed: 1.23,
      windDirec: 157.31,
      suhuMinimal: 23.47,
      suhuMaksimal: 30.48,
      evapotranspirasi: 0.18,
      radiasiSolarPanel: 115.6,
    },
    {
      hour: 8,
      suhuRataRata: 26.88,
      ch: 0.73,
      kelembabanRelatif: 18.92,
      tekananUdara: 100.91,
      windSpeed: 1.67,
      windDirec: 134.12,
      suhuMinimal: 24.55,
      suhuMaksimal: 29.97,
      evapotranspirasi: 0.3,
      radiasiSolarPanel: 218.7,
    },
    {
      hour: 9,
      suhuRataRata: 26.97,
      ch: 1.35,
      kelembabanRelatif: 18.98,
      tekananUdara: 100.87,
      windSpeed: 1.23,
      windDirec: 167,
      suhuMinimal: 24.76,
      suhuMaksimal: 29.56,
      evapotranspirasi: 0.45,
      radiasiSolarPanel: 321.8,
    },
    {
      hour: 10,
      suhuRataRata: 26.88,
      ch: 2.91,
      kelembabanRelatif: 18.92,
      tekananUdara: 100.89,
      windSpeed: 1.68,
      windDirec: 129.69,
      suhuMinimal: 24.3,
      suhuMaksimal: 30.12,
      evapotranspirasi: 0.6,
      radiasiSolarPanel: 424.9,
    },
    {
      hour: 11,
      suhuRataRata: 26.98,
      ch: 0.93,
      kelembabanRelatif: 19.1,
      tekananUdara: 100.84,
      windSpeed: 1.95,
      windDirec: 127.62,
      suhuMinimal: 24.43,
      suhuMaksimal: 30.11,
      evapotranspirasi: 0.75,
      radiasiSolarPanel: 528,
    },
    {
      hour: 12,
      suhuRataRata: 27,
      ch: 0.41,
      kelembabanRelatif: 18.62,
      tekananUdara: 100.77,
      windSpeed: 1.66,
      windDirec: 161.56,
      suhuMinimal: 24.62,
      suhuMaksimal: 30.01,
      evapotranspirasi: 0.85,
      radiasiSolarPanel: 631.1,
    },
    {
      hour: 13,
      suhuRataRata: 27.24,
      ch: 0.45,
      kelembabanRelatif: 18.13,
      tekananUdara: 100.74,
      windSpeed: 1.38,
      windDirec: 176.06,
      suhuMinimal: 24.22,
      suhuMaksimal: 30.69,
      evapotranspirasi: 0.9,
      radiasiSolarPanel: 721.87,
    },
    {
      hour: 14,
      suhuRataRata: 26.91,
      ch: 0.04,
      kelembabanRelatif: 18.01,
      tekananUdara: 100.72,
      windSpeed: 1.72,
      windDirec: 168.19,
      suhuMinimal: 23.69,
      suhuMaksimal: 30.29,
      evapotranspirasi: 0.95,
      radiasiSolarPanel: 218.7,
    },
    {
      hour: 15,
      suhuRataRata: 27.04,
      ch: 0.03,
      kelembabanRelatif: 17.76,
      tekananUdara: 100.6,
      windSpeed: 2.15,
      windDirec: 145.5,
      suhuMinimal: 23.87,
      suhuMaksimal: 31.01,
      evapotranspirasi: 0.9,
      radiasiSolarPanel: 115.6,
    },
    {
      hour: 16,
      suhuRataRata: 27.22,
      ch: 2.74,
      kelembabanRelatif: 18.86,
      tekananUdara: 100.67,
      windSpeed: 1.98,
      windDirec: 124.94,
      suhuMinimal: 24.44,
      suhuMaksimal: 30.64,
      evapotranspirasi: 0.8,
      radiasiSolarPanel: 12.5,
    },
    {
      hour: 17,
      suhuRataRata: 27.06,
      ch: 2.98,
      kelembabanRelatif: 19.65,
      tekananUdara: 100.81,
      windSpeed: 1.67,
      windDirec: 129.88,
      suhuMinimal: 25.07,
      suhuMaksimal: 29.65,
      evapotranspirasi: 0.7,
      radiasiSolarPanel: 7.34,
    },
    {
      hour: 18,
      suhuRataRata: 27.19,
      ch: 2.87,
      kelembabanRelatif: 19.47,
      tekananUdara: 100.84,
      windSpeed: 1.2,
      windDirec: 109.56,
      suhuMinimal: 25.18,
      suhuMaksimal: 29.66,
      evapotranspirasi: 0.55,
      radiasiSolarPanel: 0,
    },
    {
      hour: 19,
      suhuRataRata: 26.64,
      ch: 13.26,
      kelembabanRelatif: 19.04,
      tekananUdara: 100.83,
      windSpeed: 1.15,
      windDirec: 141.25,
      suhuMinimal: 24.72,
      suhuMaksimal: 28.9,
      evapotranspirasi: 0.4,
      radiasiSolarPanel: 0,
    },
    {
      hour: 20,
      suhuRataRata: 26.56,
      ch: 1,
      kelembabanRelatif: 17.88,
      tekananUdara: 100.96,
      windSpeed: 1.43,
      windDirec: 177.38,
      suhuMinimal: 23.59,
      suhuMaksimal: 30.4,
      evapotranspirasi: 0.3,
      radiasiSolarPanel: 0,
    },
    {
      hour: 21,
      suhuRataRata: 26.98,
      ch: 0.19,
      kelembabanRelatif: 17.76,
      tekananUdara: 100.85,
      windSpeed: 1.8,
      windDirec: 120,
      suhuMinimal: 24.45,
      suhuMaksimal: 30.57,
      evapotranspirasi: 0.2,
      radiasiSolarPanel: 0,
    },
    {
      hour: 22,
      suhuRataRata: 27.09,
      ch: 0.27,
      kelembabanRelatif: 18.55,
      tekananUdara: 100.78,
      windSpeed: 2.11,
      windDirec: 137.44,
      suhuMinimal: 23.96,
      suhuMaksimal: 30.98,
      evapotranspirasi: 0.15,
      radiasiSolarPanel: 0,
    },
    {
      hour: 23,
      suhuRataRata: 27.26,
      ch: 11.29,
      kelembabanRelatif: 19.29,
      tekananUdara: 100.82,
      windSpeed: 1.67,
      windDirec: 134.56,
      suhuMinimal: 24.53,
      suhuMaksimal: 30.23,
      evapotranspirasi: 0.1,
      radiasiSolarPanel: 0,
    },
  ];

  for (const awsDevice of activeAWSDevices) {
    for (let hour = 0; hour < 24; hour++) {
      const realData = realAWSData[hour];

      weatherDataRecords.push({
        tanggal: getTargetDateTime(hour), // Use full DateTime
        year: 2025,
        suhuRataRata: realData.suhuRataRata,
        ch: realData.ch,
        kelembabanRelatif: realData.kelembabanRelatif,
        tekananUdara: realData.tekananUdara,
        windSpeed: realData.windSpeed,
        windDirec: realData.windDirec,
        suhuMinimal: realData.suhuMinimal,
        suhuMaksimal: realData.suhuMaksimal,
        evapotranspirasi: realData.evapotranspirasi,
        radiasiSolarPanel: realData.radiasiSolarPanel,
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

  // Real TMAS (water level) data patterns for AWL TMAS Pasut (tidal water level monitoring)
  // Based on typical tidal patterns in Indonesian coastal/agricultural areas
  const tmasWaterLevelPatterns = [
    { hour: 0, level: 0.45 }, // 45cm - night low tide
    { hour: 1, level: 0.48 }, // 48cm - slight rise
    { hour: 2, level: 0.52 }, // 52cm - continuing rise
    { hour: 3, level: 0.58 }, // 58cm - pre-dawn rise
    { hour: 4, level: 0.65 }, // 65cm - early morning rise
    { hour: 5, level: 0.72 }, // 72cm - morning rise
    { hour: 6, level: 0.78 }, // 78cm - sunrise level
    { hour: 7, level: 0.82 }, // 82cm - morning high
    { hour: 8, level: 0.85 }, // 85cm - morning peak
    { hour: 9, level: 0.88 }, // 88cm - mid-morning high
    { hour: 10, level: 0.92 }, // 92cm - approaching high tide
    { hour: 11, level: 0.95 }, // 95cm - near high tide
    { hour: 12, level: 0.98 }, // 98cm - high tide peak
    { hour: 13, level: 0.96 }, // 96cm - post-peak
    { hour: 14, level: 0.92 }, // 92cm - afternoon decline
    { hour: 15, level: 0.87 }, // 87cm - mid-afternoon
    { hour: 16, level: 0.82 }, // 82cm - late afternoon
    { hour: 17, level: 0.76 }, // 76cm - evening decline
    { hour: 18, level: 0.71 }, // 71cm - sunset level
    { hour: 19, level: 0.65 }, // 65cm - evening low
    { hour: 20, level: 0.59 }, // 59cm - night decline
    { hour: 21, level: 0.54 }, // 54cm - late evening
    { hour: 22, level: 0.49 }, // 49cm - approaching low
    { hour: 23, level: 0.46 }, // 46cm - late night low
  ];

  for (const awlDevice of activeAWLDevices) {
    // Each AWL device has slightly different base characteristics
    const deviceOffset = (parseInt(awlDevice.id) % 4) * 0.05; // 0-15cm variation between devices

    for (let hour = 0; hour < 24; hour++) {
      const patternData = tmasWaterLevelPatterns[hour];
      // Add small random variation and device-specific offset
      const finalLevel =
        patternData.level + deviceOffset + randomBetween(-0.02, 0.02);

      tmasDataRecords.push({
        tanggal: getTargetDateTime(hour), // Use full DateTime
        ketinggian: Math.max(0.2, Math.min(1.2, finalLevel)), // Ensure 20cm-120cm range
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
