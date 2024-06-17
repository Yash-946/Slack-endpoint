/*
  Warnings:

  - Added the required column `chunk_number` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `embedding` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "chunk_number" TEXT NOT NULL,
ADD COLUMN     "embedding" TEXT NOT NULL;
