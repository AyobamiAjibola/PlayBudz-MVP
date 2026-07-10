/*
  Warnings:

  - You are about to drop the column `notification` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "notification",
ADD COLUMN     "notificationEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "registrationComplete" BOOLEAN DEFAULT false;
