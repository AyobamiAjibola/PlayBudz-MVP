-- CreateTable
CREATE TABLE "SportTypes" (
    "id" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SportTypes_pkey" PRIMARY KEY ("id")
);
