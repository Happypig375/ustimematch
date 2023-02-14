/*
  Warnings:

  - Changed the type of `timetables` on the `SharedTimetables` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SharedTimetables" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '1 week',
DROP COLUMN "timetables",
ADD COLUMN     "timetables" JSONB NOT NULL;
