/*
  Warnings:

  - You are about to drop the column `Level` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "Level",
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;
