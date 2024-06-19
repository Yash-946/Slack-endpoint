import { serve } from '@hono/node-server'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { Hono } from 'hono'

const app = new Hono()
const prisma = new PrismaClient()

app.get('/', async (c) => {
  return c.text("Hello hono");
})

app.post('/', async (c) => {
  const body = await c.req.json();
  // console.log(body);

  const filterdata = filterMeetingData(body.data)!;
  // console.log(filterdata!.year);
  

  try {
    const data = await prisma.meeting.create({
      data: {
        meet_link: filterdata.meet_link || "",
        title: filterdata.title || "",
        time: filterdata.time || "",
        month: parseInt(filterdata.month.toString()) || 0,
        year: filterdata.year || 0,
        attendees: filterdata.attendees || "",
        meeting_Agenda: filterdata.meeting_Agenda || "",
        Meeting_Highlights: filterdata.Meeting_Highlights || "",
        Meeting_Transcript: filterdata.Meeting_Transcript || "",
        meeting_summary: filterdata.meeting_summary || "",
        chunk_number: filterdata.chunk_number || "",
        embedding: filterdata.embedding || ""
      }
    });
    return c.text(data.id);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500)
  }

})

const port = 3000
console.log(`Server is running on port ${port}`)

// const str = body.time;
  // const regex = /T(\d{2}:\d{2}:\d{2})Z UTC/;

  // const match = str.match(regex);
  // // if (match) {
  // const time = match[1];
  // }

  // const indian_time = convertUTCToIST(time);

// function convertUTCToIST(utcTime: string) {
//   console.log(utcTime);
//   // Parse the time string and create a Date object
//   const date = new Date(`1970-01-01T${utcTime}Z`);

//   // India Standard Time is UTC+5:30
//   const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds

//   // Get the time in milliseconds and add IST offset
//   const istTime = new Date(date.getTime() + istOffset);

//   // Extract the time part (HH:MM:SS)
//   const hours = String(istTime.getUTCHours()).padStart(2, '0');
//   const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
//   const seconds = String(istTime.getUTCSeconds()).padStart(2, '0');

//   return `${hours}:${minutes}:${seconds}`;
// }

serve({
  fetch: app.fetch,
  port
})

// function filterMeetingData(rawData:string) {
//   // Extract relevant sections from the raw data
//   const titleMatch = rawData.match(/Title: ([^\n]+)/);
//   const linkMatch = rawData.match(/Link: ([^\n]+)/);
//   const dateMatch = rawData.match(/Date: ([^\n]+)/);
//   const attendeesMatch = rawData.match(/Attendees: ([^\n]+)/);
//   const agendaMatch = rawData.match(/Agenda: ([\s\S]+?)Meeting Summary/);
//   const summaryMatch = rawData.match(
//     /Meeting Summary([\s\S]+?)Meeting Highlights/
//   );
//   const highlightsMatch = rawData.match(
//     /Meeting Highlights([\s\S]+?)Meeting Transcript/
//   );
//   const transcriptMatch = rawData.match(/Meeting Transcript([\s\S]+)/);

//   const dateObj = new Date(dateMatch![1].trim().replace(" UTC", ""));  

//   // Convert to IST (UTC+5:30)
//   const offsetIST = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
//   const istDateObj = new Date(dateObj.getTime() + offsetIST);

//   // Extract year, month, and time in HH:MM:SS format
//   const year = istDateObj.getUTCFullYear();
//   const month = istDateObj.getUTCMonth() + 1; // getUTCMonth() returns 0-11
//   const day = istDateObj.getUTCDate();
//   const hours = istDateObj.getUTCHours();
//   const minutes = istDateObj.getUTCMinutes();
//   const seconds = istDateObj.getUTCSeconds();

//   // Format month and day to always have two digits
//   const formattedMonth = month < 10 ? `0${month}` : month;
//   const formattedDay = day < 10 ? `0${day}` : day;

//   // Construct time in HH:MM:SS format
//   const time = `${hours}:${minutes}:${seconds}`;

//   // return {
//   //   year: year,
//   //   month: formattedMonth,
//   //   day: formattedDay,
//   //   time: time
//   // };
//   // }

//   return {
//     meet_link: linkMatch ? linkMatch[1].trim() : "",
//     title: titleMatch ? titleMatch[1].trim() : "",
//     date: dateMatch ? dateMatch[1].trim() : "",
//     time: time,
//     month: formattedMonth,
//     year: year,
//     attendees: attendeesMatch ? attendeesMatch[1].trim() : "",
//     meeting_Agenda: agendaMatch ? agendaMatch[1].trim() : "",
//     Meeting_Highlights: highlightsMatch ? highlightsMatch[1].trim() : "",
//     Meeting_Transcript: transcriptMatch ? transcriptMatch[1].trim() : "",
//     meeting_summary: summaryMatch ? summaryMatch[1].trim() : "",
//     chunk_number: "",
//     embedding: "",
//   };
// }

function filterMeetingData(rawData:string) {
  // Remove byte order mark (BOM) if present
  rawData = rawData.replace(/^\uFEFF/, '');

  // Extract relevant sections from the raw data
  const titleMatch = rawData.match(/Title: ([^\n]+)/);
  const linkMatch = rawData.match(/Link: ([^\n]+)/);
  const dateMatch = rawData.match(/Date: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/);
  const attendeesMatch = rawData.match(/Attendees: ([^\n]+)/);
  const agendaMatch = rawData.match(/Agenda: ([\s\S]+?)Meeting Summary/);
  const summaryMatch = rawData.match(/Meeting Summary([\s\S]+?)Meeting Highlights/);
  const highlightsMatch = rawData.match(/Meeting Highlights([\s\S]+?)Meeting Transcript/);
  const transcriptMatch = rawData.match(/Meeting Transcript([\s\S]+)/);

  if (!dateMatch) {
    console.error('Date field not found or invalid format');
    return null; // Handle the case where date cannot be extracted
  }

  const dateObj = new Date(dateMatch[1].trim().replace("Z", ""));  

  // Convert to IST (UTC+5:30)
  const offsetIST = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  const istDateObj = new Date(dateObj.getTime() + offsetIST);

  // Extract year, month, and time in HH:MM:SS format
  const year = istDateObj.getUTCFullYear();
  const month = istDateObj.getUTCMonth() + 1; // getUTCMonth() returns 0-11
  const day = istDateObj.getUTCDate();
  const hours = istDateObj.getUTCHours();
  const minutes = istDateObj.getUTCMinutes();
  const seconds = istDateObj.getUTCSeconds();

  // Format month and day to always have two digits
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  // Construct time in HH:MM:SS format
  const time = `${hours}:${minutes}:${seconds}`;

  return {
    meet_link: linkMatch ? linkMatch[1].trim() : "",
    title: titleMatch ? titleMatch[1].trim() : "",
    date: dateMatch ? dateMatch[1].trim() : "", // Ensure the date field is correctly matched
    time: time,
    month: formattedMonth,
    year: year,
    attendees: attendeesMatch ? attendeesMatch[1].trim() : "",
    meeting_Agenda: agendaMatch ? agendaMatch[1].trim() : "",
    Meeting_Highlights: highlightsMatch ? highlightsMatch[1].trim() : "",
    Meeting_Transcript: transcriptMatch ? transcriptMatch[1].trim() : "",
    meeting_summary: summaryMatch ? summaryMatch[1].trim() : "",
    chunk_number: "",
    embedding: "",
  };
}