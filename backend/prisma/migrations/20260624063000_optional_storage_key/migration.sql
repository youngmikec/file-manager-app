/*
  Warnings:

  - A unique constraint covering the columns `[storageKey]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "storageKey" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_storageKey_key" ON "File"("storageKey");

-- CreateIndex
CREATE INDEX "File_filename_status_idx" ON "File"("filename", "status");
