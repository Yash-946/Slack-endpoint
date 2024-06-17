-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "chunk_number" DROP NOT NULL,
ALTER COLUMN "embedding" DROP NOT NULL;
