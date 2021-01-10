/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[username,discriminator]` on the table `Account`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "discriminator" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account.username_discriminator_unique" ON "Account"("username", "discriminator");
