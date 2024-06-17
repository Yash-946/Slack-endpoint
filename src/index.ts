import { serve } from '@hono/node-server'
import { PrismaClient } from '@prisma/client'
import { Hono } from 'hono'

const app = new Hono()
const prisma = new PrismaClient()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/', async (c) => {
  const body = await c.req.json();
  // console.log(body);
  const str = body.time;
  const regex = /T(\d{2}:\d{2}:\d{2})Z UTC/;

  const match = str.match(regex);
  // if (match) {
    const time = match[1];
  // }

  const indian_time = convertUTCToIST(time);

  try {
    const data = await prisma.meeting.create({
      data: {
        meet_link: body.meet_link || "",
        title: body.title || "",
        time: indian_time || "",
        month: body.month || 0,
        year: body.year || 0,
        attendees: body.attendees || "",
        meeting_Agenda: body.meeting_Agenda || "",
        Meeting_Highlights: body.Meeting_Highlights || "",
        Meeting_Transcript: body.Meeting_Transcript || "",
        meeting_summary: body.meeting_summary || "",
        chunk_number: body.chunk_number || "",
        embedding: body.embedding || ""
      }
    });
    return c.json({ data })
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500)
  }
})

const port = 3000
console.log(`Server is running on port ${port}`)

function convertUTCToIST(utcTime: string) {
  console.log(utcTime);
  // Parse the time string and create a Date object
  const date = new Date(`1970-01-01T${utcTime}Z`);

  // India Standard Time is UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds

  // Get the time in milliseconds and add IST offset
  const istTime = new Date(date.getTime() + istOffset);

  // Extract the time part (HH:MM:SS)
  const hours = String(istTime.getUTCHours()).padStart(2, '0');
  const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(istTime.getUTCSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

serve({
  fetch: app.fetch,
  port
})
