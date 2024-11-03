-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "classificationType" TEXT,
    "bonusConfigId" TEXT,
    "followersBaseParametersId" TEXT,
    CONSTRAINT "BonusForm_bonusConfigId_fkey" FOREIGN KEY ("bonusConfigId") REFERENCES "BonusConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BonusForm_followersBaseParametersId_fkey" FOREIGN KEY ("followersBaseParametersId") REFERENCES "FollowersBaseParameters" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_BonusForm" ("bonusConfigId", "classification", "classificationType", "dateFrom", "dateTo", "division", "followersBaseParametersId", "id", "internal", "logic", "manager", "name", "region", "segment", "subClassification", "tariffList") SELECT "bonusConfigId", "classification", "classificationType", "dateFrom", "dateTo", "division", "followersBaseParametersId", "id", "internal", "logic", "manager", "name", "region", "segment", "subClassification", "tariffList" FROM "BonusForm";
DROP TABLE "BonusForm";
ALTER TABLE "new_BonusForm" RENAME TO "BonusForm";
CREATE UNIQUE INDEX "BonusForm_bonusConfigId_key" ON "BonusForm"("bonusConfigId");
CREATE UNIQUE INDEX "BonusForm_followersBaseParametersId_key" ON "BonusForm"("followersBaseParametersId");
CREATE TABLE "new_BonusTypeConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isToggled" BOOLEAN DEFAULT false,
    "unit" TEXT NOT NULL,
    "deductNewCustomerBonus" BOOLEAN DEFAULT false,
    "bonusConfigId" TEXT,
    CONSTRAINT "BonusTypeConfig_bonusConfigId_fkey" FOREIGN KEY ("bonusConfigId") REFERENCES "BonusConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BonusTypeConfig" ("bonusConfigId", "deductNewCustomerBonus", "id", "isToggled", "name", "unit") SELECT "bonusConfigId", "deductNewCustomerBonus", "id", "isToggled", "name", "unit" FROM "BonusTypeConfig";
DROP TABLE "BonusTypeConfig";
ALTER TABLE "new_BonusTypeConfig" RENAME TO "BonusTypeConfig";
CREATE TABLE "new_ConstantConsumptionFactorsRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bonusType" TEXT NOT NULL,
    "subregion" TEXT NOT NULL,
    "consumptionFrom" REAL NOT NULL,
    "consumptionTo" REAL NOT NULL,
    "value" REAL NOT NULL,
    "bonusFormId" TEXT NOT NULL,
    CONSTRAINT "ConstantConsumptionFactorsRow_bonusFormId_fkey" FOREIGN KEY ("bonusFormId") REFERENCES "BonusForm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ConstantConsumptionFactorsRow" ("bonusFormId", "bonusType", "consumptionFrom", "consumptionTo", "id", "subregion", "value") SELECT "bonusFormId", "bonusType", "consumptionFrom", "consumptionTo", "id", "subregion", "value" FROM "ConstantConsumptionFactorsRow";
DROP TABLE "ConstantConsumptionFactorsRow";
ALTER TABLE "new_ConstantConsumptionFactorsRow" RENAME TO "ConstantConsumptionFactorsRow";
CREATE TABLE "new_FollowersConsumptionFactorsRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bonusType" TEXT NOT NULL,
    "subregion" TEXT NOT NULL,
    "consumptionFrom" REAL NOT NULL,
    "consumptionTo" REAL NOT NULL,
    "factor" REAL NOT NULL,
    "value" REAL NOT NULL,
    "bonusFormId" TEXT NOT NULL,
    CONSTRAINT "FollowersConsumptionFactorsRow_bonusFormId_fkey" FOREIGN KEY ("bonusFormId") REFERENCES "BonusForm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FollowersConsumptionFactorsRow" ("bonusFormId", "bonusType", "consumptionFrom", "consumptionTo", "factor", "id", "subregion", "value") SELECT "bonusFormId", "bonusType", "consumptionFrom", "consumptionTo", "factor", "id", "subregion", "value" FROM "FollowersConsumptionFactorsRow";
DROP TABLE "FollowersConsumptionFactorsRow";
ALTER TABLE "new_FollowersConsumptionFactorsRow" RENAME TO "FollowersConsumptionFactorsRow";
CREATE TABLE "new_FollowersGlobalCalculationFactorsRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bonusType" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "absoluteFactor" REAL NOT NULL,
    "minimumAbsoluteFactor" REAL NOT NULL,
    "maximumAbsoluteFactor" REAL NOT NULL,
    "bonusFormId" TEXT NOT NULL,
    CONSTRAINT "FollowersGlobalCalculationFactorsRow_bonusFormId_fkey" FOREIGN KEY ("bonusFormId") REFERENCES "BonusForm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FollowersGlobalCalculationFactorsRow" ("absoluteFactor", "bonusFormId", "bonusType", "id", "maximumAbsoluteFactor", "minimumAbsoluteFactor", "value") SELECT "absoluteFactor", "bonusFormId", "bonusType", "id", "maximumAbsoluteFactor", "minimumAbsoluteFactor", "value" FROM "FollowersGlobalCalculationFactorsRow";
DROP TABLE "FollowersGlobalCalculationFactorsRow";
ALTER TABLE "new_FollowersGlobalCalculationFactorsRow" RENAME TO "FollowersGlobalCalculationFactorsRow";
CREATE TABLE "new_RankTargetingCalculationParametersRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subregion" TEXT NOT NULL,
    "consumptionFrom" REAL NOT NULL,
    "consumptionTo" REAL NOT NULL,
    "targetRank" INTEGER NOT NULL,
    "maximumTotalBonus" REAL NOT NULL,
    "maximumRelativeNewCustomerBonus" REAL,
    "minimumInstantBonus" REAL,
    "maximumRelativeInstantBonus" REAL,
    "ontopBonus" REAL,
    "voucher" REAL,
    "bonus" REAL,
    "bonusFormId" TEXT NOT NULL,
    CONSTRAINT "RankTargetingCalculationParametersRow_bonusFormId_fkey" FOREIGN KEY ("bonusFormId") REFERENCES "BonusForm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RankTargetingCalculationParametersRow" ("bonus", "bonusFormId", "consumptionFrom", "consumptionTo", "id", "maximumRelativeInstantBonus", "maximumRelativeNewCustomerBonus", "maximumTotalBonus", "minimumInstantBonus", "ontopBonus", "subregion", "targetRank", "voucher") SELECT "bonus", "bonusFormId", "consumptionFrom", "consumptionTo", "id", "maximumRelativeInstantBonus", "maximumRelativeNewCustomerBonus", "maximumTotalBonus", "minimumInstantBonus", "ontopBonus", "subregion", "targetRank", "voucher" FROM "RankTargetingCalculationParametersRow";
DROP TABLE "RankTargetingCalculationParametersRow";
ALTER TABLE "new_RankTargetingCalculationParametersRow" RENAME TO "RankTargetingCalculationParametersRow";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
