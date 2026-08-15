/*
  Warnings:

  - Added the required column `gameDateTime` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "gameDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "image" TEXT;
