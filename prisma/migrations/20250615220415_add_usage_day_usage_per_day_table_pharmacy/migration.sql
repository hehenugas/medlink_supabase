/*
  Warnings:

  - Added the required column `jamPenggunaan` to the `Pharmacy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usageDay` to the `Pharmacy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usagePerDay` to the `Pharmacy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pharmacy" ADD COLUMN     "jamPenggunaan" JSONB NOT NULL,
ADD COLUMN     "usageDay" INTEGER NOT NULL,
ADD COLUMN     "usagePerDay" INTEGER NOT NULL;
