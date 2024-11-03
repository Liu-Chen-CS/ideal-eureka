-- CreateTable
CREATE TABLE "BonusForm" (
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
    CONSTRAINT "BonusForm_bonusConfigId_fkey" FOREIGN KEY ("bonusConfigId") REFERENCES "BonusConfig" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BonusForm_followersBaseParametersId_fkey" FOREIGN KEY ("followersBaseParametersId") REFERENCES "FollowersBaseParameters" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonusConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isNet" TEXT NOT NULL,
    "newCustomerBonus" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BonusTypeConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isToggled" BOOLEAN DEFAULT false,
    "unit" TEXT NOT NULL,
    "deductNewCustomerBonus" BOOLEAN DEFAULT false,
    "bonusConfigId" TEXT,
    CONSTRAINT "BonusTypeConfig_bonusConfigId_fkey" FOREIGN KEY ("bonusConfigId") REFERENCES "BonusConfig" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConstantConsumptionFactorsRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bonusType" TEXT NOT NULL,
    "subregion" TEXT NOT NULL,
    "consumptionFrom" REAL NOT NULL,
    "consumptionTo" REAL NOT NULL,
    "value" REAL NOT NULL,
    "bonusFormId" TEXT NOT NULL,
    CONSTRAINT "ConstantConsumptionFactorsRow_bonusFormId_fkey" FOREIGN KEY ("bonusFormId") REFERENCES "BonusForm" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FollowersBaseParameters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baseCalculationId" TEXT NOT NULL,
    "aggregateToNkBonus" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "FollowersConsumptionFactorsRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bonusType" TEXT NOT NULL,
    "subregion" TEXT NOT NULL,
    "consumptionFrom" REAL NOT NULL,
    "consumptionTo" REAL NOT NULL,
    "factor" REAL NOT NULL,
    "value" REAL NOT NULL,
    "bonusFormId" TEXT NOT NULL,
    CONSTRAINT "FollowersConsumptionFactorsRow_bonusFormId_fkey" FOREIGN KEY ("bonusFormId") REFERENCES "BonusForm" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FollowersGlobalCalculationFactorsRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bonusType" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "absoluteFactor" REAL NOT NULL,
    "minimumAbsoluteFactor" REAL NOT NULL,
    "maximumAbsoluteFactor" REAL NOT NULL,
    "bonusFormId" TEXT NOT NULL,
    CONSTRAINT "FollowersGlobalCalculationFactorsRow_bonusFormId_fkey" FOREIGN KEY ("bonusFormId") REFERENCES "BonusForm" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RankTargetingCalculationParametersRow" (
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
    CONSTRAINT "RankTargetingCalculationParametersRow_bonusFormId_fkey" FOREIGN KEY ("bonusFormId") REFERENCES "BonusForm" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BonusForm_bonusConfigId_key" ON "BonusForm"("bonusConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "BonusForm_followersBaseParametersId_key" ON "BonusForm"("followersBaseParametersId");
