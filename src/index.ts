import { serve } from '@hono/node-server'
import { PrismaClient } from '@prisma/client'
import { Hono } from 'hono'

const app = new Hono()
const prisma = new PrismaClient()

app.get('/', async (c) => {
  return c.text("Hello hono")
})

app.post('/input', async (c) => {
  const body = await c.req.json();
  const gc_emails = body.emails || "";
  const gc_time = body.time || "";
  const meeting_data = body.data || "";
  console.log(body);
  

  try {
    const data = await prisma.input.create({
      data:{
        GC_Emails:gc_emails,
        GC_Time:gc_time,
        Meeting_Raw_Data: meeting_data
      }
    })
    return c.json({data});
  } catch (error) {
    return c.json({error});
  }

})
app.post('/', async (c) => {
  const body = await c.req.json();
  const filterdata = filterMeetingData(body.data.toString());
  console.log(filterdata);
  // try {
  //   const data = await prisma.meeting.create({
  //     data: {
  //       meet_link: filterdata.meet_link || "",
  //       title: filterdata.title || "",
  //       time: filterdata.time || "",
  //       month: parseInt(filterdata.month.toString()) || 0,
  //       year: filterdata.year || 0,
  //       attendees: filterdata.attendees || "",
  //       meeting_Agenda: filterdata.meeting_Agenda || "",
  //       Meeting_Highlights: filterdata.Meeting_Highlights || "",
  //       Meeting_Transcript: filterdata.Meeting_Transcript || "",
  //       meeting_summary: filterdata.meeting_summary || "",
  //       chunk_number: filterdata.chunk_number || "",
  //       embedding: filterdata.embedding || ""
  //     }
  //   });
  //   return c.text(data.id);
  // } catch (error) {
  //   return c.json({ error: (error as Error).message }, 500)
  // }
  return c.json({ filterdata });
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

 function filterMeetingData(rawData: string) {
  rawData = rawData.replace(/^\uFEFF/, ''); // Remove BOM

  const titleMatch = rawData.match(/Title: ([^\n]+)Location/);
  const linkMatch = rawData.match(/Link: ([^\n]+)Agenda:/);
  const dateMatch = rawData.match(/Date: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)/);
  const attendeesMatch = rawData.match(/Attendees: ([^\n]+)Link:/);
  const agendaMatch = rawData.match(/Agenda: ([\s\S]+?)Meeting Summary/);
  const summaryMatch = rawData.match(/Meeting Summary([\s\S]+?)Meeting Highlights/);
  const highlightsMatch = rawData.match(/Meeting Highlights([\s\S]+?)Meeting Transcript/);
  const transcriptMatch = rawData.match(/Meeting Transcript([\s\S]+)/);

  if (!dateMatch) {
    console.error('Date field not found or invalid format');
    return null;
  }

  const { year, month, day, time } = convertUTCToIST(dateMatch[1].trim());

  function cleanString(str: string) {
    return str.replace(/\n/g, ' ').replace(/\+/g, '').trim();
  }

  return {
    meet_link: linkMatch ? cleanString(linkMatch[1]) : "",
    title: titleMatch ? cleanString(titleMatch[1]) : "",
    time: time,
    date: day,
    month: month,
    year: year,
    full_date: `${year}-${month}-${day}`,
    attendees: attendeesMatch ? cleanString(attendeesMatch[1]) : "",
    meeting_Agenda: agendaMatch ? cleanString(agendaMatch[1]) : "",
    Meeting_Highlights: highlightsMatch ? cleanString(highlightsMatch[1]) : "",
    Meeting_Transcript: transcriptMatch ? cleanString(transcriptMatch[1]) : "",
    meeting_summary: summaryMatch ? cleanString(summaryMatch[1]) : "",
    chunk_number: "",
    embedding: "",
  };
}

function convertUTCToIST(dateStr: string) {
  const dateObj = new Date(dateStr);
  const offsetIST = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  const istDateObj = new Date(dateObj.getTime() + offsetIST);

  const year = istDateObj.getUTCFullYear();
  const month = (istDateObj.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = istDateObj.getUTCDate().toString().padStart(2, '0');
  const time = istDateObj.toTimeString().split(' ')[0]; // HH:MM:SS

  return { year, month, day, time };
}
