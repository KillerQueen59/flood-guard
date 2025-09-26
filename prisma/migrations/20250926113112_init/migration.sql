-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PT" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kebun" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ptId" TEXT NOT NULL,

    CONSTRAINT "Kebun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AlatAWS" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "detailName" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "battery" INTEGER NOT NULL,
    "signal" INTEGER NOT NULL,
    "sensor" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "ptId" TEXT NOT NULL,
    "kebunId" TEXT NOT NULL,

    CONSTRAINT "AlatAWS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AlatAWL" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "detailName" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "battery" INTEGER NOT NULL,
    "signal" INTEGER NOT NULL,
    "data" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "ptId" TEXT NOT NULL,
    "kebunId" TEXT NOT NULL,

    CONSTRAINT "AlatAWL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AlatDashboard" (
    "id" TEXT NOT NULL,
    "ptId" TEXT NOT NULL,
    "kebunId" TEXT NOT NULL,
    "rusak" INTEGER NOT NULL,
    "idle" INTEGER NOT NULL,
    "active" INTEGER NOT NULL,
    "alert" INTEGER NOT NULL,

    CONSTRAINT "AlatDashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeatherData" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "suhuRataRata" DOUBLE PRECISION NOT NULL,
    "ch" DOUBLE PRECISION NOT NULL,
    "kelembabanRelatif" DOUBLE PRECISION NOT NULL,
    "tekananUdara" DOUBLE PRECISION NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "windDirec" DOUBLE PRECISION NOT NULL,
    "suhuMinimal" DOUBLE PRECISION NOT NULL,
    "suhuMaksimal" DOUBLE PRECISION NOT NULL,
    "evapotranspirasi" DOUBLE PRECISION NOT NULL,
    "radiasiSolarPanel" DOUBLE PRECISION NOT NULL,
    "kebunId" TEXT NOT NULL,
    "awsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TMASData" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "ketinggian" DOUBLE PRECISION NOT NULL,
    "kebunId" TEXT NOT NULL,
    "awlId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TMASData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AlatDashboard_ptId_kebunId_key" ON "public"."AlatDashboard"("ptId", "kebunId");

-- AddForeignKey
ALTER TABLE "public"."Kebun" ADD CONSTRAINT "Kebun_ptId_fkey" FOREIGN KEY ("ptId") REFERENCES "public"."PT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlatAWS" ADD CONSTRAINT "AlatAWS_ptId_fkey" FOREIGN KEY ("ptId") REFERENCES "public"."PT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlatAWS" ADD CONSTRAINT "AlatAWS_kebunId_fkey" FOREIGN KEY ("kebunId") REFERENCES "public"."Kebun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlatAWL" ADD CONSTRAINT "AlatAWL_ptId_fkey" FOREIGN KEY ("ptId") REFERENCES "public"."PT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlatAWL" ADD CONSTRAINT "AlatAWL_kebunId_fkey" FOREIGN KEY ("kebunId") REFERENCES "public"."Kebun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlatDashboard" ADD CONSTRAINT "AlatDashboard_ptId_fkey" FOREIGN KEY ("ptId") REFERENCES "public"."PT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AlatDashboard" ADD CONSTRAINT "AlatDashboard_kebunId_fkey" FOREIGN KEY ("kebunId") REFERENCES "public"."Kebun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeatherData" ADD CONSTRAINT "WeatherData_kebunId_fkey" FOREIGN KEY ("kebunId") REFERENCES "public"."Kebun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeatherData" ADD CONSTRAINT "WeatherData_awsId_fkey" FOREIGN KEY ("awsId") REFERENCES "public"."AlatAWS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TMASData" ADD CONSTRAINT "TMASData_kebunId_fkey" FOREIGN KEY ("kebunId") REFERENCES "public"."Kebun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TMASData" ADD CONSTRAINT "TMASData_awlId_fkey" FOREIGN KEY ("awlId") REFERENCES "public"."AlatAWL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
