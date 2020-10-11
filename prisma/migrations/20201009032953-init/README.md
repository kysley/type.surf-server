# Migration `20201009032953-init`

This migration has been generated by Evan Kysley at 10/8/2020, 11:29:53 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
Begin;
CREATE TYPE "public"."Mode_new" AS ENUM ('Words', 'Time', 'Takedown', 'TimeAttack');
ALTER TABLE "public"."Result" ALTER COLUMN "mode" TYPE "Mode_new" USING ("mode"::text::"Mode_new");
ALTER TYPE "Mode" RENAME TO "Mode_old";
ALTER TYPE "Mode_new" RENAME TO "Mode";
DROP TYPE "Mode_old";
Commit

DROP TYPE "Difficulty"

CREATE TABLE "public"."Account" (
"id" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL ,
"username" text   NOT NULL ,
"confirmed" boolean   NOT NULL DEFAULT false,
"email" text   NOT NULL ,
"lastSeen" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"password" text   NOT NULL ,
"role" "Role"  NOT NULL DEFAULT E'USER',
"tag" integer   NOT NULL ,
"rank" "Rank"  NOT NULL DEFAULT E'Beginner',
"discordLinked" boolean   NOT NULL DEFAULT false,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Result" (
"id" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL ,
"correct" integer   NOT NULL ,
"corrections" integer   NOT NULL ,
"cpm" integer   NOT NULL ,
"rawCpm" integer   NOT NULL ,
"wpm" integer   NOT NULL ,
"rawWpm" integer   NOT NULL ,
"incorrect" integer   NOT NULL ,
"wordIndex" integer   NOT NULL ,
"letterIndex" integer   NOT NULL ,
"history" integer   NOT NULL ,
"punctuated" boolean   NOT NULL DEFAULT false,
"state" text   NOT NULL ,
"seed" text   NOT NULL ,
"isArcade" boolean   NOT NULL DEFAULT false,
"mode" "Mode"  NOT NULL DEFAULT E'Time',
"slug" text   NOT NULL DEFAULT E'60',
"mods" "Mods"[]  ,
"mapId" text   ,
"accountId" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Map" (
"id" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"custom" boolean   DEFAULT false,
"updatedAt" timestamp(3)   NOT NULL ,
"name" text   NOT NULL ,
"published" boolean   DEFAULT false,
"wordset" text   NOT NULL ,
"creatorId" text   ,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "Account.username_unique" ON "public"."Account"("username")

CREATE UNIQUE INDEX "Account.email_unique" ON "public"."Account"("email")

ALTER TABLE "public"."Result" ADD FOREIGN KEY ("mapId")REFERENCES "public"."Map"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Result" ADD FOREIGN KEY ("accountId")REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Map" ADD FOREIGN KEY ("creatorId")REFERENCES "public"."Account"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201009032953-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,94 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model Account {
+  id            String   @id @default(cuid())
+  createdAt     DateTime @default(now())
+  updatedAt     DateTime @updatedAt
+  username      String   @unique
+  // color         String?
+  confirmed     Boolean  @default(false)
+  email         String   @unique
+  lastSeen      DateTime @default(now())
+  password      String
+  role          Role     @default(USER)
+  tag           Int
+  rank          Rank     @default(Beginner)
+  history       Result[]
+  maps          Map[]
+  discordLinked Boolean  @default(false)
+}
+
+model Result {
+  id          String   @id @default(cuid())
+  createdAt   DateTime @default(now())
+  updatedAt   DateTime @updatedAt
+  correct     Int
+  corrections Int
+  cpm         Int
+  rawCpm      Int
+  wpm         Int
+  rawWpm      Int
+  incorrect   Int
+  wordIndex   Int
+  letterIndex Int
+  history     Int
+  punctuated  Boolean  @default(false)
+  state       String
+  seed        String
+  isArcade    Boolean  @default(false)
+  mode        Mode     @default(Time)
+  slug        String   @default("60")
+  mods        Mods[]
+  map         Map?     @relation(fields: [mapId], references: [id])
+  mapId       String?
+  account     Account  @relation(fields: [accountId], references: [id])
+  accountId   String
+}
+
+model Map {
+  id        String   @id @default(cuid())
+  createdAt DateTime @default(now())
+  custom    Boolean? @default(false)
+  updatedAt DateTime @updatedAt
+  name      String
+  published Boolean? @default(false)
+  wordset   String
+  results   Result[]
+  creator   Account? @relation(fields: [creatorId], references: [id])
+  creatorId String?
+}
+
+enum Role {
+  USER
+  ADMIN
+  PRO
+  BETA
+}
+
+enum Rank {
+  Novice
+  Beginner
+  Competent
+  Proficient
+  Expert
+  Master
+}
+
+enum Mode {
+  Words
+  Time
+  Takedown
+  TimeAttack
+}
+
+enum Mods {
+  Rush
+  Perfectionist
+}
```

