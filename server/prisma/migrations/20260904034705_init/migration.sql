-- CreateTable
CREATE TABLE "adminUser" (
    "email" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,

    CONSTRAINT "adminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adminUser_email_key" ON "adminUser"("email");
