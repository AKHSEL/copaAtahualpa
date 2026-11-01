CREATE TYPE "MatchPhase" AS ENUM ('REGULAR', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL');

CREATE TABLE "Season" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT false,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "closedAt" TIMESTAMP(3),
  CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Season_name_key" ON "Season"("name");
CREATE UNIQUE INDEX "Season_only_one_active" ON "Season"("active") WHERE "active" = true;

INSERT INTO "Season" ("name", "active") VALUES ('2026', true);

ALTER TABLE "Team" ADD COLUMN "seasonId" INTEGER;
ALTER TABLE "Round" ADD COLUMN "seasonId" INTEGER;
ALTER TABLE "Match" ADD COLUMN "seasonId" INTEGER;
ALTER TABLE "Match" ADD COLUMN "phase" "MatchPhase" NOT NULL DEFAULT 'REGULAR';
ALTER TABLE "Match" ADD COLUMN "penaltyA" INTEGER;
ALTER TABLE "Match" ADD COLUMN "penaltyB" INTEGER;

UPDATE "Team" SET "seasonId" = (SELECT "id" FROM "Season" WHERE "active" = true);
UPDATE "Round" SET "seasonId" = (SELECT "id" FROM "Season" WHERE "active" = true);
UPDATE "Match" SET "seasonId" = (SELECT "id" FROM "Season" WHERE "active" = true);

ALTER TABLE "Team" ALTER COLUMN "seasonId" SET NOT NULL;
ALTER TABLE "Round" ALTER COLUMN "seasonId" SET NOT NULL;
ALTER TABLE "Match" ALTER COLUMN "seasonId" SET NOT NULL;

ALTER TABLE "Team" ADD CONSTRAINT "Team_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Round" ADD CONSTRAINT "Round_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Match" ADD CONSTRAINT "Match_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "SeasonStanding" (
  "id" SERIAL NOT NULL,
  "seasonId" INTEGER NOT NULL,
  "category" "Category" NOT NULL,
  "position" INTEGER NOT NULL,
  "teamName" TEXT NOT NULL,
  "played" INTEGER NOT NULL,
  "wins" INTEGER NOT NULL,
  "draws" INTEGER NOT NULL,
  "losses" INTEGER NOT NULL,
  "goalsFor" INTEGER NOT NULL,
  "goalsAgainst" INTEGER NOT NULL,
  "goalDifference" INTEGER NOT NULL,
  "points" INTEGER NOT NULL,
  CONSTRAINT "SeasonStanding_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SeasonStanding_seasonId_category_position_key" ON "SeasonStanding"("seasonId", "category", "position");
ALTER TABLE "SeasonStanding" ADD CONSTRAINT "SeasonStanding_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "SeasonChampion" (
  "seasonId" INTEGER NOT NULL,
  "category" "Category" NOT NULL,
  "teamId" INTEGER NOT NULL,
  CONSTRAINT "SeasonChampion_pkey" PRIMARY KEY ("seasonId", "category")
);
ALTER TABLE "SeasonChampion" ADD CONSTRAINT "SeasonChampion_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SeasonChampion" ADD CONSTRAINT "SeasonChampion_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
