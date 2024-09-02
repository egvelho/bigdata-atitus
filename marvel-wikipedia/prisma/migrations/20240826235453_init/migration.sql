-- CreateTable
CREATE TABLE "Characters" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "char_name" TEXT NOT NULL,
    "summary" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Characters_char_name_key" ON "Characters"("char_name");
