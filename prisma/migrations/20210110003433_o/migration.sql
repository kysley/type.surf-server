/*
  Warnings:

  - Changed the type of `discriminator` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "discriminator",
ADD COLUMN     "discriminator" INTEGER NOT NULL;
