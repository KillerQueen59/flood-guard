-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" TEXT
);

-- CreateTable
CREATE TABLE "AlatAWS" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "detailName" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "battery" INTEGER NOT NULL,
    "signal" INTEGER NOT NULL,
    "sensor" INTEGER NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AlatAWL" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "detailName" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "battery" INTEGER NOT NULL,
    "signal" INTEGER NOT NULL,
    "data" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PT" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Kebun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AlatDashboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pt" TEXT NOT NULL,
    "kebun" TEXT NOT NULL,
    "rusak" INTEGER NOT NULL,
    "idle" INTEGER NOT NULL,
    "active" INTEGER NOT NULL,
    "alert" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "WeatherData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tanggal" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "suhuRataRata" REAL NOT NULL,
    "ch" REAL NOT NULL,
    "kelembabanRelatif" REAL NOT NULL,
    "tekananUdara" REAL NOT NULL,
    "windSpeed" REAL NOT NULL,
    "windDirec" REAL NOT NULL,
    "suhuMinimal" REAL NOT NULL,
    "suhuMaksimal" REAL NOT NULL,
    "evapotranspirasi" REAL NOT NULL,
    "radiasiSolarPanel" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "TMASData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tanggal" TEXT NOT NULL,
    "ketinggian" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "TMATData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tanggal" TEXT NOT NULL,
    "ketinggian" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
