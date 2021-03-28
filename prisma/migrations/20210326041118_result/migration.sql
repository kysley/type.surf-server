/*
  Warnings:

  - You are about to drop the column `correct` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `corrections` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `rawCpm` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `rawWpm` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `incorrect` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `wordIndex` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `letterIndex` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `history` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Result` table. All the data in the column will be lost.
  - Added the required column `acc` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raw` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `characters` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('TIME', 'WORDS');

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "correct",
DROP COLUMN "corrections",
DROP COLUMN "rawCpm",
DROP COLUMN "rawWpm",
DROP COLUMN "incorrect",
DROP COLUMN "wordIndex",
DROP COLUMN "letterIndex",
DROP COLUMN "history",
DROP COLUMN "state",
ADD COLUMN     "acc" INTEGER NOT NULL,
ADD COLUMN     "raw" INTEGER NOT NULL,
ADD COLUMN     "characters" TEXT NOT NULL,
ADD COLUMN     "mode" "Mode" NOT NULL;
