/*
  Warnings:

  - You are about to drop the `list_hinzufuge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `place_foreign` on the `place` table. All the data in the column will be lost.
  - You are about to drop the column `restmenge_forign` on the `restmenge` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UKdtxnuwlasogymskdxdph6fy4l";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "list_hinzufuge";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "list" (
    "list_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "list_name" TEXT,
    "list_details" TEXT,
    "region_division_id" INTEGER,
    CONSTRAINT "list_region_division_id_fkey" FOREIGN KEY ("region_division_id") REFERENCES "region_division" ("region_division_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_place" (
    "place_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "place_name" TEXT,
    "postcode" TEXT,
    "list_id" INTEGER,
    CONSTRAINT "place_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "list" ("list_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_place" ("place_id", "place_name", "postcode") SELECT "place_id", "place_name", "postcode" FROM "place";
DROP TABLE "place";
ALTER TABLE "new_place" RENAME TO "place";
CREATE TABLE "new_restmenge" (
    "restmenge_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restmenge" TEXT,
    "region_division_id" INTEGER,
    CONSTRAINT "restmenge_region_division_id_fkey" FOREIGN KEY ("region_division_id") REFERENCES "region_division" ("region_division_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_restmenge" ("restmenge", "restmenge_id") SELECT "restmenge", "restmenge_id" FROM "restmenge";
DROP TABLE "restmenge";
ALTER TABLE "new_restmenge" RENAME TO "restmenge";
CREATE UNIQUE INDEX "restmenge_region_division_id_key" ON "restmenge"("region_division_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
