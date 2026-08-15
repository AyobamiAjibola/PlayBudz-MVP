-- CreateTable
CREATE TABLE "SavedGame" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedGame_userId_idx" ON "SavedGame"("userId");

-- CreateIndex
CREATE INDEX "SavedGame_gameId_idx" ON "SavedGame"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedGame_userId_gameId_key" ON "SavedGame"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "SavedGame" ADD CONSTRAINT "SavedGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedGame" ADD CONSTRAINT "SavedGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
