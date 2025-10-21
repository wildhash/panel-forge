-- AlterTable
ALTER TABLE "Comic" ADD COLUMN "artStyle" TEXT;
ALTER TABLE "Comic" ADD COLUMN "characterReference" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comicId" TEXT NOT NULL,
    "pageNum" INTEGER NOT NULL,
    "stripOrder" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Page_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Page" ("comicId", "createdAt", "id", "pageNum", "updatedAt") SELECT "comicId", "createdAt", "id", "pageNum", "updatedAt" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_comicId_pageNum_key" ON "Page"("comicId", "pageNum");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
