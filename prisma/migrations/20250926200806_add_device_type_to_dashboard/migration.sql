/*
  Warnings:

  - A unique constraint covering the columns `[ptId,kebunId,deviceType]` on the table `AlatDashboard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceType` to the `AlatDashboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."AlatDashboard_ptId_kebunId_key";

-- AlterTable
ALTER TABLE "public"."AlatDashboard" ADD COLUMN     "deviceType" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AlatDashboard_ptId_kebunId_deviceType_key" ON "public"."AlatDashboard"("ptId", "kebunId", "deviceType");
