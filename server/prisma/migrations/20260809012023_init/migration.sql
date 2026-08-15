/*
  Warnings:

  - You are about to drop the column `date` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Game` table. All the data in the column will be lost.
  - Added the required column `gameDateTime` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "gameDateTime" TEXT NOT NULL;
