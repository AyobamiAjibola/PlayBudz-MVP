/*
  Warnings:

  - A unique constraint covering the columns `[sport]` on the table `SportTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SportTypes_sport_key" ON "SportTypes"("sport");
