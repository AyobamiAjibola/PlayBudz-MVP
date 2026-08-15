-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "cancelled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false;
