-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT;
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "healthSlug" TEXT;
-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
