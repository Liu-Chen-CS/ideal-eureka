/*
  Warnings:

  - You are about to drop the column `bonusConfigId` on the `BonusForm` table. All the data in the column will be lost.
  - You are about to drop the column `followersBaseParametersId` on the `BonusForm` table. All the data in the column will be lost.
  - Added the required column `bonusFormId` to the `BonusConfig` table without a default value. This is not possible if the table is not empty.
  - Made the column `bonusConfigId` on table `BonusTypeConfig` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `bonusFormId` to the `FollowersBaseParameters` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BonusConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isNet" TEXT NOT NULL,
    "newCustomerBonus" TEXT NOT NULL,
    "bonusFormId" TEXT NOT NULL,
    CONSTRAINT "BonusConfig_bonusFormId_fkey" FOREIGN KEY ("bonusFormId") REFERENCES "BonusForm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BonusConfig" ("id", "isNet", "newCustomerBonus") SELECT "id", "isNet", "newCustomerBonus" FROM "BonusConfig";
DROP TABLE "BonusConfig";
ALTER TABLE "new_BonusConfig" RENAME TO "BonusConfig";
CREATE UNIQUE INDEX "BonusConfig_bonusFormId_key" ON "BonusConfig"("bonusFormId");
CREATE TABLE "new_BonusForm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logic" TEXT NOT NULL,
    "dateFrom" DATETIME NOT NULL,
    "dateTo" DATETIME NOT NULL,
    "tariffList" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "internal" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "manager" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "subClassification" TEXT NOT NULL,
    "classificationType" TEXT
);
INSERT INTO "new_BonusForm" ("classification", "classificationType", "dateFrom", "dateTo", "division", "id", "internal", "logic", "manager", "name", "region", "segment", "subClassification", "tariffList") SELECT "classification", "classificationType", "dateFrom", "dateTo", "division", "id", "internal", "logic", "manager", "name", "region", "segment", "subClassification", "tariffList" FROM "BonusForm";
DROP TABLE "BonusForm";
ALTER TABLE "new_BonusForm" RENAME TO "BonusForm";
CREATE TABLE "new_BonusTypeConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isToggled" BOOLEAN DEFAULT false,
    "unit" TEXT NOT NULL,
    "deductNewCustomerBonus" BOOLEAN DEFAULT false,
    "bonusConfigId" TEXT NOT NULL,
    CONSTRAINT "BonusTypeConfig_bonusConfigId_fkey" FOREIGN KEY ("bonusConfigId") REFERENCES "BonusConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BonusTypeConfig" ("bonusConfigId", "deductNewCustomerBonus", "id", "isToggled", "name", "unit") SELECT "bonusConfigId", "deductNewCustomerBonus", "id", "isToggled", "name", "unit" FROM "BonusTypeConfig";
DROP TABLE "BonusTypeConfig";
ALTER TABLE "new_BonusTypeConfig" RENAME TO "BonusTypeConfig";
CREATE TABLE "new_FollowersBaseParameters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baseCalculationId" TEXT NOT NULL,
    "aggregateToNkBonus" BOOLEAN NOT NULL,
    "bonusFormId" TEXT NOT NULL,
    CONSTRAINT "FollowersBaseParameters_bonusFormId_fkey" FOREIGN KEY ("bonusFormId") REFERENCES "BonusForm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FollowersBaseParameters" ("aggregateToNkBonus", "baseCalculationId", "id") SELECT "aggregateToNkBonus", "baseCalculationId", "id" FROM "FollowersBaseParameters";
DROP TABLE "FollowersBaseParameters";
ALTER TABLE "new_FollowersBaseParameters" RENAME TO "FollowersBaseParameters";
CREATE UNIQUE INDEX "FollowersBaseParameters_bonusFormId_key" ON "FollowersBaseParameters"("bonusFormId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
