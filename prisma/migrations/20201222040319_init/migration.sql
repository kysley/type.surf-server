-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'PRO', 'BETA');

-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('Novice', 'Beginner', 'Competent', 'Proficient', 'Expert', 'Master');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('Words', 'Time', 'Takedown', 'TimeAttack');

-- CreateEnum
CREATE TYPE "Mods" AS ENUM ('Rush', 'Perfectionist');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "tag" INTEGER NOT NULL,
    "rank" "Rank" NOT NULL DEFAULT E'Beginner',
    "discordLinked" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "correct" INTEGER NOT NULL,
    "corrections" INTEGER NOT NULL,
    "cpm" INTEGER NOT NULL,
    "rawCpm" INTEGER NOT NULL,
    "wpm" INTEGER NOT NULL,
    "rawWpm" INTEGER NOT NULL,
    "incorrect" INTEGER NOT NULL,
    "wordIndex" INTEGER NOT NULL,
    "letterIndex" INTEGER NOT NULL,
    "history" INTEGER NOT NULL,
    "punctuated" BOOLEAN NOT NULL DEFAULT false,
    "state" TEXT NOT NULL,
    "seed" TEXT NOT NULL,
    "isArcade" BOOLEAN NOT NULL DEFAULT false,
    "mode" "Mode" NOT NULL DEFAULT E'Time',
    "slug" TEXT NOT NULL DEFAULT E'60',
    "mods" "Mods"[],
    "mapId" TEXT,
    "accountId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Map" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "custom" BOOLEAN DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "published" BOOLEAN DEFAULT false,
    "wordset" TEXT NOT NULL,
    "creatorId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account.username_unique" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account.email_unique" ON "Account"("email");

-- AddForeignKey
ALTER TABLE "Result" ADD FOREIGN KEY("mapId")REFERENCES "Map"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD FOREIGN KEY("accountId")REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Map" ADD FOREIGN KEY("creatorId")REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
