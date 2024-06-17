-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "meet_link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "attendees" TEXT NOT NULL,
    "meeting_Agenda" TEXT NOT NULL,
    "Meeting_Highlights" TEXT NOT NULL,
    "Meeting_Transcript" TEXT NOT NULL,
    "meeting_summary" TEXT NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);
