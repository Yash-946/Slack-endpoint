/*
  Warnings:

  - The primary key for the `Meeting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `chunk_number` on table `Meeting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `embedding` on table `Meeting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "chunk_number" SET NOT NULL,
ALTER COLUMN "embedding" SET NOT NULL,
ADD CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Meeting_id_seq";
