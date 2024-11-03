-- CreateTable
CREATE TABLE "list_hinzufuge" (
    "list_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "list_details" TEXT,
    "list_name" TEXT,
    "list_foreign" INTEGER,
    CONSTRAINT "list_hinzufuge_list_foreign_fkey" FOREIGN KEY ("list_foreign") REFERENCES "region_division" ("region_division_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "place" (
    "place_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "place_name" TEXT,
    "postcode" TEXT,
    "place_foreign" INTEGER,
    CONSTRAINT "place_place_foreign_fkey" FOREIGN KEY ("place_foreign") REFERENCES "region_division" ("region_division_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "region_division" (
    "region_division_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "branch" TEXT,
    "client" TEXT,
    "region_division" TEXT,
    "version" INTEGER,
    "createdOn" TEXT
);

-- CreateTable
CREATE TABLE "restmenge" (
    "restmenge_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restmenge" TEXT,
    "restmenge_forign" INTEGER,
    CONSTRAINT "restmenge_restmenge_forign_fkey" FOREIGN KEY ("restmenge_forign") REFERENCES "region_division" ("region_division_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UKdtxnuwlasogymskdxdph6fy4l" ON "list_hinzufuge"("list_foreign");

-- CreateIndex
CREATE INDEX "FKm03nd6mpnspm1eux54rr78388" ON "place"("place_foreign");

-- CreateIndex
CREATE UNIQUE INDEX "UKh8gw8lgyqdo6htswgfl5mxa" ON "restmenge"("restmenge_forign");
