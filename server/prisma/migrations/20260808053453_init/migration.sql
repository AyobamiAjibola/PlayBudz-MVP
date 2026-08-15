/*
  Warnings:

  - You are about to drop the column `skillLevel` on the `UserInterest` table. All the data in the column will be lost.
  - Added the required column `skill_level` to the `UserInterest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserInterest" DROP COLUMN "skillLevel",
ADD COLUMN     "skill_level" TEXT NOT NULL;
