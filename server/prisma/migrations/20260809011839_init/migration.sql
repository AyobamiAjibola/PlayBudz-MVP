/*
  Warnings:

  - You are about to drop the column `gameDateTime` on the `Game` table. All the data in the column will be lost.
  - Added the required column `date` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "gameDateTime",
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL;
