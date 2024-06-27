/*
  Warnings:

  - You are about to drop the column `attendees` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `chunk_number` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `embedding` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `meet_link` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `meeting_Agenda` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `meeting_summary` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Meeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "attendees",
DROP COLUMN "chunk_number",
DROP COLUMN "embedding",
DROP COLUMN "meet_link",
DROP COLUMN "meeting_Agenda",
DROP COLUMN "meeting_summary",
DROP COLUMN "month",
DROP COLUMN "time",
DROP COLUMN "title",
DROP COLUMN "year",
ADD COLUMN     "Attendees" TEXT,
ADD COLUMN     "Attendees_Emails" TEXT,
ADD COLUMN     "Chunk_number" TEXT,
ADD COLUMN     "Full_Date" TEXT,
ADD COLUMN     "Meet_link" TEXT,
ADD COLUMN     "Meeting_Agenda" TEXT,
ADD COLUMN     "Meeting_Transcript_Embedding" JSONB,
ADD COLUMN     "Meeting_summary" TEXT,
ADD COLUMN     "Meeting_summary_Embedding" JSONB,
ADD COLUMN     "Month" INTEGER,
ADD COLUMN     "Time" TEXT,
ADD COLUMN     "Title" TEXT,
ADD COLUMN     "Title_Embedding" JSONB,
ADD COLUMN     "Year" INTEGER,
ALTER COLUMN "Meeting_Highlights" DROP NOT NULL,
ALTER COLUMN "Meeting_Transcript" DROP NOT NULL;
