import { serve } from '@hono/node-server'
import { PrismaClient } from '@prisma/client'
import { Hono } from 'hono'
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAPI_KEY,
});

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
      data: {
        GC_Emails: gc_emails,
        GC_Time: gc_time,
        Meeting_Raw_Data: meeting_data
      }
    })
    return c.json({ data });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500)
  }

})

app.post('/', async (c) => {
  const body = await c.req.json();

  const gc_emails = body.emails || "";
  const gc_time = body.time || "";

  console.log("Full Body", body);
  console.log("Data",body.data);

  const filterdata = formatMeetingInput(body.data)!;
  const title_embedding = await generateEmbedding(filterdata.title)
  const summary_Embedding =  await generateEmbedding(filterdata.meeting_summary)
  const transcript_Embedding = await generateEmbedding(filterdata.meeting_Transcript);

  try {
    const data = await prisma.meeting.create({
      data: {
        Meet_link: filterdata.meet_link || "",
        Title: filterdata.title || "",
        Title_Embedding:{Embedding:title_embedding} || null,
        Time: gc_time ? gc_time : filterdata.time,
        Month: parseInt(filterdata.month.toString()) || 0,
        Year: filterdata.year || 0,
        Full_Date: filterdata.full_date,
        Attendees: filterdata.attendees || "",
        Attendees_Emails: gc_emails ? gc_emails : "",
        Meeting_Agenda: filterdata.meeting_Agenda || "",
        Meeting_Highlights: filterdata.meeting_Highlights || "",
        Meeting_Transcript: filterdata.meeting_Transcript || "",
        Meeting_Transcript_Embedding:{Embedding:transcript_Embedding} || null,
        Meeting_summary: filterdata.meeting_summary || "",
        Meeting_summary_Embedding:{Embedding:summary_Embedding} || null
      }
    });
    return c.text(data.id);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500)
  }

  // return c.json({ data });

})

app.post('/embedding', async (c) => {
  const body = await c.req.json();
  const text = body.embedding;
  const data = await generateEmbedding(text);
  const update = await prisma.meeting.update({
    where:{id:'ad0e6a05-ec4b-4483-892c-be52a672d75f'},
    data:{
      Title_Embedding:{Embedding:data}
    }
  })
  return c.json({update});
})

app.get('/alldata', async (c) => {
  const alldata = await prisma.meeting.findMany({});
  return c.json({alldata});
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

function formatMeetingInput(input:string) {
  // Split the input into lines
  const lines = input.split('\n');
  
  // Join all lines into a single string without newlines
  const formattedOutput = lines.join('');

  const filterdata = filterMeetingData(formattedOutput);
  
  return filterdata;
}

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
    meeting_Highlights: highlightsMatch ? cleanString(highlightsMatch[1]) : "",
    meeting_Transcript: transcriptMatch ? cleanString(transcriptMatch[1]) : "",
    meeting_summary: summaryMatch ? cleanString(summaryMatch[1]) : "",
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

async function generateEmbedding(text:string) {
  const response = await openai.embeddings.create({
    input: text,
    model: 'text-embedding-3-large', // Specify the model you want to use
  });
  console.log(response.data[0].embedding);
  return response.data[0].embedding;
}