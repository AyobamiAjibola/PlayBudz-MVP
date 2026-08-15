/*
  Warnings:

  - You are about to drop the column `interests` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "interests";

-- CreateTable
CREATE TABLE "UserInterest" (
    "id" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "skillLevel" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserInterest_interest_idx" ON "UserInterest"("interest");

-- AddForeignKey
ALTER TABLE "UserInterest" ADD CONSTRAINT "UserInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
