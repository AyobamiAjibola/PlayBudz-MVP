/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "biography" TEXT,
ADD COLUMN     "dob" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "interests" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "notification" BOOLEAN;
