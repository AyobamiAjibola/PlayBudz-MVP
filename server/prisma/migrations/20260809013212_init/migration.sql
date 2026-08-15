/*
  Warnings:

  - Added the required column `skill_level` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gameDateTime` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "skill_level" TEXT NOT NULL,
DROP COLUMN "gameDateTime",
ADD COLUMN     "gameDateTime" TIMESTAMP(3) NOT NULL;
