/*
  Warnings:

  - You are about to drop the column `rank` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `isArcade` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `mods` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `mapId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the `Map` table. If the table is not empty, all the data it contains will be lost.
  - The migration will add a unique constraint covering the columns `[username,discriminator]` on the table `Account`. If there are existing duplicate values, the migration will fail.
  - Added the required column `discriminator` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account.username_unique";

-- DropForeignKey
ALTER TABLE "Map" DROP CONSTRAINT "Map_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_mapId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "rank",
ADD COLUMN     "discriminator" INTEGER NOT NULL,
ADD COLUMN     "Level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "exp" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "isArcade",
DROP COLUMN "mode",
DROP COLUMN "slug",
DROP COLUMN "mods",
DROP COLUMN "mapId";

-- DropEnum
DROP TYPE "Mode";

-- DropEnum
DROP TYPE "Mods";

-- DropEnum
DROP TYPE "Rank";

-- DropTable
DROP TABLE "Map";

-- CreateIndex
CREATE UNIQUE INDEX "Account.username_discriminator_unique" ON "Account"("username", "discriminator");
